# Mandvi DevOps Session - DevOps in Production

Materials for the "DevOps in Production: Git, IaC, Docker, and the Architecture Behind Scale"
workshop at The Mandvi Education Society - MCA.

Clone this repo to follow along - everything you need is in here.

## Structure

- **`app.py`, `Dockerfile`, `requirements.txt`, `.dockerignore`** - the sample Flask app used for
  the hands-on CI/CD exercise.
- **`.github/workflows/docker-ci.yml`** - the GitHub Actions workflow (CI: build + push to Docker
  Hub; CD: redeploy on a self-hosted runner).
- **`jenkins/pipeline.sh`** - the Jenkins Freestyle "Execute shell" build step script (does the
  same CI+CD, using a second tool).
- **`deliverables/`** - the full student guide (`Mandvi_DevOps_Session_Student_Guide.docx`) and
  session presentation (`Mandvi_DevOps_Session_Presentation.pptx`), plus the scripts used to
  build them (`build_docx.js`, `build_pptx.js` - re-run with `npm install && node build_docx.js && node build_pptx.js`).
- **`azure-showcase/`** - the instructor-led production concepts showcase (Terraform, event-driven
  architecture, Kubernetes autoscaling):
  - `terraform/main.tf` - provisions the resource group, VNet, storage account, Managed Identity,
    Event Grid topic/subscription, and storage queue used in the demos. Run `terraform init && terraform plan && terraform apply`
    against your own Azure subscription to recreate it (nothing is deployed until you do).
  - `event-driven/consumer.py` - the queue-polling script completing the event-driven pipeline
    (blob upload -> Event Grid -> queue -> this script -> processed container).
  - `k8s-scaling/deployment.yaml` - the Deployment + HorizontalPodAutoscaler used for the
    Kubernetes autoscaling demo on a local `kind` cluster.

Start with `deliverables/Mandvi_DevOps_Session_Student_Guide.docx` - it walks through every
section above step by step, including all prerequisite install commands and a troubleshooting
appendix.

## No secrets are stored in this repo

Every credential-shaped value in this repo is either a placeholder you must replace with your own
(e.g. `jenkins/pipeline.sh` has `REPLACE_WITH_YOUR_DOCKERHUB_TOKEN`) or a GitHub Actions secret
referenced by name only (`${{ secrets.DOCKERHUB_TOKEN }}`), set via your own repo's Settings ->
Secrets and variables -> Actions - never committed as plain text. Terraform state (which would
contain real Azure resource keys once you `apply`) is intentionally excluded via `.gitignore` and
must never be committed.
