terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "azurerm" {
  features {}
}

variable "prefix" {
  default = "mandvidevops"
}

variable "location" {
  default = "centralindia"
}

resource "azurerm_resource_group" "main" {
  name     = "${var.prefix}-rg"
  location = var.location
}

resource "azurerm_virtual_network" "main" {
  name                = "${var.prefix}-vnet"
  address_space       = ["10.20.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_subnet" "main" {
  name                 = "${var.prefix}-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.20.1.0/24"]
}

resource "azurerm_storage_account" "main" {
  name                     = "${var.prefix}sa${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

resource "azurerm_user_assigned_identity" "main" {
  name                = "${var.prefix}-identity"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

# Give the managed identity read/write access to the storage account
# WITHOUT ever putting a connection string / key anywhere.
resource "azurerm_role_assignment" "identity_storage_access" {
  scope                = azurerm_storage_account.main.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_user_assigned_identity.main.principal_id
}

data "azurerm_client_config" "current" {}

# Grants YOUR OWN account data-plane access, separate from control-plane
# ("Owner"). This is the same distinction we saw with the managed identity:
# being able to manage the storage account doesn't mean you can read its data.
resource "azurerm_role_assignment" "me_blob_access" {
  scope                = azurerm_storage_account.main.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = data.azurerm_client_config.current.object_id
}

resource "azurerm_role_assignment" "me_queue_access" {
  scope                = azurerm_storage_account.main.id
  role_definition_name = "Storage Queue Data Contributor"
  principal_id         = data.azurerm_client_config.current.object_id
}

resource "azurerm_storage_container" "demo" {
  name                  = "demo"
  storage_account_id    = azurerm_storage_account.main.id
  container_access_type = "private"
}

# Proves the managed identity actually works: this container has NO password,
# NO connection string, NO key anywhere in its definition. It authenticates to
# Azure purely via the identity attached below (IMDS token), then lists blobs.
resource "azurerm_container_group" "identity_demo" {
  name                = "${var.prefix}-identity-demo"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  os_type             = "Linux"
  restart_policy      = "Never"
  ip_address_type     = "None"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.main.id]
  }

  container {
    name   = "identity-check"
    image  = "mcr.microsoft.com/azure-cli:latest"
    cpu    = "0.5"
    memory = "0.5"

    commands = ["/bin/bash", "-c", <<-EOT
      echo '--- Logging in using the MANAGED IDENTITY, no secrets involved ---'
      az login --identity --client-id ${azurerm_user_assigned_identity.main.client_id}
      echo '--- Listing blobs in the storage container using --auth-mode login (AAD token, no storage key) ---'
      az storage blob list --account-name ${azurerm_storage_account.main.name} --container-name ${azurerm_storage_container.demo.name} --auth-mode login -o table
      echo '--- Uploading a test blob using the same identity ---'
      echo 'hello from managed identity' > /tmp/test.txt
      az storage blob upload --account-name ${azurerm_storage_account.main.name} --container-name ${azurerm_storage_container.demo.name} --name proof.txt --file /tmp/test.txt --auth-mode login --overwrite
      echo '--- Done ---'
    EOT
    ]
  }

  depends_on = [azurerm_role_assignment.identity_storage_access]
}

# --- Simple event-driven architecture demo ---
#
#   upload blob -> "demo" container
#        |
#        v
#   Event Grid (BlobCreated event)
#        |
#        v
#   Storage Queue "incoming-files"
#        |
#        v
#   consumer script (polls queue, "processes" the file,
#                     writes result into "processed" container)

resource "azurerm_storage_container" "processed" {
  name                  = "processed"
  storage_account_id    = azurerm_storage_account.main.id
  container_access_type = "private"
}

resource "azurerm_storage_queue" "incoming_files" {
  name                 = "incoming-files"
  storage_account_name = azurerm_storage_account.main.name
}

resource "azurerm_eventgrid_system_topic" "storage_events" {
  name                   = "${var.prefix}-storage-events"
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  source_arm_resource_id = azurerm_storage_account.main.id
  topic_type             = "Microsoft.Storage.StorageAccounts"
}

resource "azurerm_eventgrid_system_topic_event_subscription" "blob_created" {
  name                = "blob-created-to-queue"
  system_topic        = azurerm_eventgrid_system_topic.storage_events.name
  resource_group_name = azurerm_resource_group.main.name

  included_event_types = ["Microsoft.Storage.BlobCreated"]

  subject_filter {
    subject_begins_with = "/blobServices/default/containers/${azurerm_storage_container.demo.name}/"
  }

  storage_queue_endpoint {
    storage_account_id = azurerm_storage_account.main.id
    queue_name         = azurerm_storage_queue.incoming_files.name
  }
}

output "resource_group" {
  value = azurerm_resource_group.main.name
}

output "storage_account_name" {
  value = azurerm_storage_account.main.name
}

output "managed_identity_client_id" {
  value = azurerm_user_assigned_identity.main.client_id
}

output "managed_identity_principal_id" {
  value = azurerm_user_assigned_identity.main.principal_id
}

output "queue_name" {
  value = azurerm_storage_queue.incoming_files.name
}
