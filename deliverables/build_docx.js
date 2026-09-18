const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, LevelFormat, PageBreak
} = require("docx");
const fs = require("fs");

const NAVY = "0B2559";
const BLUE = "1F6FD8";
const LIGHTBG = "F2F6FB";
const GREY = "5B6B85";

function h1(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } });
}
function h2(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 } });
}
function h3(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 } });
}
function p(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, italics: opts.italics, bold: opts.bold, color: opts.color })],
    spacing: { after: 150 },
  });
}
function why(text) {
  return new Paragraph({
    children: [new TextRun({ text: "Why this matters: ", bold: true, color: BLUE }), new TextRun({ text })],
    spacing: { after: 200 },
    shading: { type: ShadingType.CLEAR, fill: LIGHTBG },
  });
}
function bullet(text) {
  return new Paragraph({ text, bullet: { level: 0 }, spacing: { after: 80 } });
}
function callout(title, text) {
  return new Paragraph({
    children: [new TextRun({ text: title + " ", bold: true, color: "B00020" }), new TextRun({ text })],
    spacing: { before: 100, after: 200 },
    shading: { type: ShadingType.CLEAR, fill: "FDEEEE" },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: "B00020" } },
  });
}
function code(text) {
  const lines = text.split("\n");
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [9350],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 9350, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: "1E1E1E" },
            margins: { top: 120, bottom: 120, left: 150, right: 150 },
            children: lines.map(
              (line) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.length ? line : " ",
                      font: "Consolas",
                      size: 18,
                      color: "D4D4D4",
                    }),
                  ],
                  spacing: { after: 0 },
                })
            ),
          }),
        ],
      }),
    ],
  });
}
function spacer() {
  return new Paragraph({ text: "", spacing: { after: 100 } });
}
function tocRow(num, title) {
  return new Paragraph({
    children: [new TextRun({ text: `${num}. `, bold: true }), new TextRun({ text: title })],
    spacing: { after: 100 },
  });
}

const APP_PY = fs.readFileSync("/home/dhruv/session/student-cicd-project/app.py", "utf8");
const DOCKERFILE = fs.readFileSync("/home/dhruv/session/student-cicd-project/Dockerfile", "utf8");
const REQS = fs.readFileSync("/home/dhruv/session/student-cicd-project/requirements.txt", "utf8");
const WORKFLOW = fs.readFileSync("/home/dhruv/session/student-cicd-project/.github/workflows/docker-ci.yml", "utf8");
const PIPELINE = fs.readFileSync("/home/dhruv/session/student-cicd-project/jenkins/pipeline.sh", "utf8");
const K8S_YAML = fs.readFileSync("/home/dhruv/session/azure-showcase/k8s-scaling/deployment.yaml", "utf8");

const children = [];

// ---------- Title page ----------
children.push(
  new Paragraph({ text: "", spacing: { before: 800 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "THE MANDVI EDUCATION SOCIETY - MCA", bold: true, size: 32, color: NAVY })],
    spacing: { after: 200 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "DevOps in Production", bold: true, size: 44, color: BLUE })],
    spacing: { after: 100 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Git, IaC, Docker, and the Architecture Behind Scale", italics: true, size: 24, color: GREY })],
    spacing: { after: 600 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Student Hands-On Guide", bold: true, size: 28 })],
    spacing: { after: 100 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Resource Person: Dhruv Hemantbhai Patel, DevOps Engineer at Raapid Inc.", size: 22 })],
    spacing: { after: 800 },
  }),
  callout(
    "How to use this guide:",
    "Every command here is copy-pasteable. Follow it top to bottom even after the session ends - the Jenkins and GitHub Actions sections work standalone, from your own machine, with your own accounts. A Troubleshooting appendix at the end lists every real problem we hit while preparing this guide, and its exact fix."
  ),
  new Paragraph({ children: [new PageBreak()] })
);

// ---------- TOC ----------
children.push(h1("Contents"));
[
  "Before You Arrive - Prerequisites",
  "GitHub Setup - Clone, Then Push to Your Own Account",
  "The Manual Pain - Docker Build, Tag, Push by Hand",
  "GitHub Actions - Part A: Continuous Integration (CI)",
  "GitHub Actions - Part B: Continuous Deployment (CD) via a Self-Hosted Runner",
  "Jenkins - Native Install, One Job Does Both CI and CD",
  "Terraform - Infrastructure as Code (Concept + Instructor Demo)",
  "Kubernetes Autoscaling - Self-Serve Guide",
  "How These Three Pieces Connect - Terraform, Events, and Scaling as One Story",
  "Cleanup",
  "Troubleshooting Appendix",
].forEach((t, i) => children.push(tocRow(i, t)));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- 0. Prerequisites ----------
children.push(h1("0. Before You Arrive - Prerequisites"));
children.push(why("Account creation and email verification eat real clock time in a room full of people. Do this BEFORE the session so we spend our two hours building, not signing up."));
children.push(h2("You need, created in advance:"));
[
  "A GitHub account (github.com) - free.",
  "A Docker Hub account (hub.docker.com) - free.",
  "A Docker Hub Access Token (NOT your account password): after logging in, go to Account Settings -> Security -> New Access Token. Give it a name like \"mandvi-session\", copy it somewhere safe - you will not be able to see it again.",
].forEach((t) => children.push(bullet(t)));
children.push(h2("Confirm on your lab machine:"));
children.push(code("docker --version\ngit --version"));
children.push(p("Both commands should print a version number. If either fails, flag it immediately - don't wait until your turn in the exercise."));

// ---------- 1. GitHub setup ----------
children.push(h1("1. GitHub Setup - Clone, Then Push to Your Own Account"));
children.push(why("Every pipeline in this guide watches a GitHub repository you own. If you push to the instructor's repo, nothing will work for you personally - you need your own copy."));
children.push(h2("Step 1: Create an empty repository on your own account"));
children.push(p("Go to github.com -> New repository. Name it anything (e.g. mandvi-devops-demo). Do NOT initialize it with a README - leave it completely empty. Copy its URL."));
children.push(h2("Step 2: Clone the instructor's repo, then re-point it at yours"));
children.push(code(
`git clone https://github.com/pateldhruv2001/mandvi-devops-session-demo.git
cd mandvi-devops-session-demo

# Remove the link to the instructor's repo
rm -rf .git

# Start a fresh repo of your own
git init
git add .
git commit -m "Initial commit"

# Point it at YOUR empty repo from Step 1
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main`
));
children.push(p("Replace <your-username> and <your-repo-name> with your own values. Refresh your repo's page on github.com - you should see app.py, Dockerfile, and the other files."));
children.push(callout("Common snag:", "If `git push` asks for a password and rejects it, GitHub no longer accepts account passwords over plain git. Use `gh auth login` (GitHub CLI) once first, or set up a Personal Access Token as your git password when prompted."));

// ---------- 2. Manual pain ----------
children.push(h1("2. The Manual Pain - Docker Build, Tag, Push by Hand"));
children.push(why("Before automating anything, feel what you're automating away. Every time you changed one line of code, you would have to repeat every step below, by hand, correctly, in order - forever."));
children.push(h2("The app"));
children.push(p("A tiny Flask app (app.py) with three routes: / (a branded HTML status page), /api (the same data as JSON), /health (a plain health check used by automation later)."));
children.push(code(APP_PY.slice(0, 900) + "\n... (full file is in the repo) ..."));
children.push(h2("The Dockerfile"));
children.push(code(DOCKERFILE));
children.push(p("Note the order: requirements.txt is copied and installed BEFORE app.py. Docker caches each step - if only app.py changes, the (slow) pip install step is skipped entirely on the next build."));
children.push(h2("Build, run, and check it locally"));
children.push(code(
`docker build -t devops-session-app:local .
docker run -d --name devops-app-test -p 5001:5000 devops-session-app:local
curl http://localhost:5001/health
# {"status": "ok"}
docker rm -f devops-app-test`
));
children.push(h2("Push it to Docker Hub, by hand"));
children.push(code(
`docker login -u <your-dockerhub-username>
# Paste your ACCESS TOKEN as the password, not your account password.

docker tag devops-session-app:local <your-dockerhub-username>/devops-session-app:manual
docker push <your-dockerhub-username>/devops-session-app:manual`
));
children.push(callout(
  "If docker login hangs and fails with \"context deadline exceeded\":",
  "This looks like a network timeout, but it usually means you tried your account PASSWORD instead of an Access Token. Generate a token (see Section 0) and use that as the password every time - it also avoids this specific confusing failure."
));
children.push(p("Go check hub.docker.com - your image is there. Now imagine doing this for every change, all day. That's exactly the pain the next two sections remove."));

// ---------- 3. GitHub Actions CI ----------
children.push(h1("3. GitHub Actions - Part A: Continuous Integration (CI)"));
children.push(why("This automatically rebuilds and re-pushes your image every time you push code - no manual docker commands, ever again, for this part."));
children.push(h2("Step 1: Store your Docker Hub credentials as GitHub Secrets"));
children.push(p("In your repo: Settings -> Secrets and variables -> Actions -> New repository secret. Create two secrets:"));
[
  "DOCKERHUB_USERNAME - your Docker Hub username",
  "DOCKERHUB_TOKEN - the Access Token from Section 0",
].forEach((t) => children.push(bullet(t)));
children.push(callout("Never", "put the raw token directly in a workflow YAML file. Secrets are encrypted and masked in logs; plain text in a YAML file committed to a public repo is not."));
children.push(h2("Step 2: The workflow file"));
children.push(p("Already at .github/workflows/docker-ci.yml in your repo (from the clone in Section 1). Full contents:"));
children.push(code(WORKFLOW));
children.push(h2("What's happening"));
[
  "Triggers on every push to the main branch.",
  "docker/login-action logs in using the two secrets - the token is never printed to the log.",
  "Two tags are built: the commit SHA (a permanent, traceable snapshot) and latest (a moving pointer that always means \"the newest version\"). Use the SHA tag whenever you need to know exactly what's running; use latest for convenience.",
].forEach((t) => children.push(bullet(t)));
children.push(p("Push any small change and watch it run under your repo's \"Actions\" tab. The build-and-push job runs entirely on GitHub's own servers."));

// ---------- 4. GitHub Actions CD ----------
children.push(h1("4. GitHub Actions - Part B: Continuous Deployment (CD) via a Self-Hosted Runner"));
children.push(why("CI alone only pushes an image to Docker Hub - nothing is actually running anywhere yet. To see the new version actually redeploy and serve traffic, GitHub Actions needs a machine it can reach that stays alive: your own laptop."));
children.push(h2("The problem this solves"));
children.push(p("GitHub's own cloud runners (the ones that just ran your CI job) are thrown away the moment the job finishes. They cannot host a long-running app, because they don't exist five minutes later. A self-hosted runner is a small program YOU run on YOUR OWN machine that registers itself to your repo and waits for jobs - so when a \"deploy\" job runs on it, it really does run on your machine, and any container it starts keeps running after the job ends."));
children.push(h2("Step 1: Register a runner (get a token)"));
children.push(p("In your repo: Settings -> Actions -> Runners -> New self-hosted runner. Pick Linux. The page shows a set of copy-paste commands with a registration token already filled in for you - use those exact commands (the token expires quickly, so don't reuse an old copy from this guide)."));
children.push(h2("Step 2: Download, extract, configure, and start it"));
children.push(p("The page's commands look like this (yours will have a real token in place of <TOKEN>):"));
children.push(code(
`mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64.tar.gz -L \\
  https://github.com/actions/runner/releases/download/v2.328.0/actions-runner-linux-x64-2.328.0.tar.gz
tar xzf actions-runner-linux-x64.tar.gz

./config.sh --url https://github.com/<your-username>/<your-repo> --token <TOKEN> \\
  --name laptop-runner --labels self-hosted,docker

# Quick test (stops when you close the terminal):
./run.sh

# Recommended instead - runs as a background service, survives closing the terminal:
sudo ./svc.sh install
sudo ./svc.sh start`
));
children.push(p("Check your repo's Settings -> Actions -> Runners page - it should now show your runner as \"Idle\" or \"Online\". That confirms it worked."));
children.push(h2("Step 3: The deploy job"));
children.push(p("Already in your workflow file above - the second job, deploy, targets your runner via runs-on: [self-hosted, docker] (matching the labels from Step 1). It pulls the freshly-pushed image and redeploys the container, then checks it's actually responding:"));
children.push(code(
`  deploy:
    needs: build-and-push
    runs-on: [self-hosted, docker]
    steps:
      - name: Pull latest image
        run: docker pull \${{ secrets.DOCKERHUB_USERNAME }}/devops-session-app:latest

      - name: Redeploy container
        run: |
          docker rm -f devops-session-app-live || true
          docker run -d --name devops-session-app-live \\
            -p 5050:5000 \\
            -e APP_ENV=github-actions-cd \\
            \${{ secrets.DOCKERHUB_USERNAME }}/devops-session-app:latest

      - name: Smoke test
        run: |
          for i in 1 2 3 4 5 6 7 8 9 10; do
            if curl -sf http://localhost:5050/health; then
              echo "App is up."
              exit 0
            fi
            echo "Not ready yet, retrying..."
            sleep 2
          done
          echo "App did not become healthy in time"
          exit 1`
));
children.push(callout(
  "Why the retry loop, not a plain \"sleep 3; curl\"?",
  "We tried a fixed sleep 3 first. It intermittently failed because the container needs a moment to fully start Flask before it can answer a health check - sometimes 3 seconds wasn't enough. Retrying for up to ~20 seconds is much more reliable than guessing one fixed number."
));
children.push(p("Push a change and watch both jobs run in your repo's Actions tab. Then confirm from your own terminal:"));
children.push(code("curl http://localhost:5050/"));
children.push(p("You should see the branded HTML page, with served_by_env showing github-actions-cd."));

// ---------- 5. Jenkins ----------
children.push(h1("5. Jenkins - Native Install, One Job Does Both CI and CD"));
children.push(why("Jenkins is one of the most widely used CI/CD tools in real companies. Seeing the SAME pipeline (build, push, redeploy) implemented in a second tool makes clear that CI/CD is a pattern, not a specific product."));
children.push(h2("Step 1: Download Jenkins"));
children.push(code("wget https://updates.jenkins.io/download/war/2.581/jenkins.war"));
children.push(p("Check https://www.jenkins.io/download/ for the current LTS version if 2.581 is no longer current by the time you read this."));
children.push(h2("Step 2: Java"));
children.push(p("Jenkins needs a specific Java version to run. Your instructor will guide you to the right one live if `java -version` doesn't work as expected - this varies by what's already installed on your lab machine, so it isn't a fixed command here."));
children.push(h2("Step 3: Run it"));
children.push(code(
`nohup java -jar -Djetty.httpConfig.requestHeaderSize=65536 \\
  jenkins.war --httpListenAddress=127.0.0.1 --httpPort=8081 --prefix=/ &`
));
children.push(callout(
  "\"Address already in use\" / port binding error:",
  "Something else on your machine is already listening on that port (this happened to us with port 8080 during rehearsal - an unrelated process had it). Check with `ss -tlnp | grep <port>` and just pick a different --httpPort value, e.g. 8082 or 8085. No need to find or kill the other process."
));
children.push(h2("Step 4: First-run setup"));
children.push(p("Jenkins prints an initial admin password in its own startup logs, and tells you the exact file path it saved it to (inside its home directory, under secrets/initialAdminPassword). It will also offer to install a set of \"suggested plugins\" over the internet - for the single Freestyle job we're building (with one plain shell step), this is optional and can be skipped to save time."));
children.push(h2("Step 5: Create the job"));
[
  "New Item -> Freestyle project -> name it (e.g. SESSION-CICD).",
  "Under Source Code Management, leave it set to None - the shell script below does its own git clone/git pull, so Jenkins doesn't need to manage the checkout itself.",
  "Under Build Steps, add \"Execute shell\", and paste in the ENTIRE script below.",
].forEach((t) => children.push(bullet(t)));
children.push(h2("The script (also saved at jenkins/pipeline.sh in the repo)"));
children.push(callout(
  "EDIT THESE LINES BEFORE RUNNING:",
  "DOCKERHUB_USERNAME and DOCKERHUB_TOKEN must be YOUR OWN Docker Hub username and Access Token. REPO_URL must point at YOUR OWN GitHub repo from Section 1 - not the instructor's."
));
children.push(code(PIPELINE));
children.push(h2("Why this works no matter where you installed Jenkins or cloned things earlier"));
children.push(p("Jenkins always runs this script with its working directory set to that job's own workspace folder - regardless of where the jenkins.war file lives or what directory you were sitting in when you started it. The script then clones its OWN fresh copy of the repo straight from GitHub. It never depends on any folder you created by hand earlier in Section 1 - so there is no path to get wrong here."));
children.push(h2("The credentials tradeoff, honestly"));
children.push(p("This script uses plain export statements for the Docker Hub token - anyone with access to this job's configuration screen can read it in plain text, and it would appear in git history if you ever committed a filled-in copy. The safer alternative is Jenkins' own built-in, encrypted Credentials store plus the Credentials Binding plugin, which injects a secret as an environment variable without ever displaying it - that's what we used on the GitHub Actions side. We're using plain exports here because it's simpler to understand on a first exposure, and it mirrors how some real organizations' older Jenkins jobs are actually written."));
children.push(h2("Why a failed build never gets deployed"));
children.push(p("The script starts with `set -e`. If ANY command fails - most importantly, the docker build or docker push steps - the script stops immediately at that line. Steps 5 and 6 (redeploy and smoke test) never run, and Jenkins marks the whole job FAILED. A broken image is never redeployed over a working one. This is deliberate, not a bug."));
children.push(h2("Run it"));
children.push(p("Build Now -> click into the build -> Console Output, to watch it run live. Once it says \"Finished: SUCCESS\":"));
children.push(code("curl http://localhost:5070/health"));

// ---------- 6. Terraform ----------
children.push(h1("6. Terraform - Infrastructure as Code"));
children.push(why("Manually clicking through a cloud portal to create resources is slow, unrepeatable, and leaves no record of what was created or why. This section is demonstrated LIVE by your instructor on Azure - read this to understand what you're watching, you won't be doing this hands-on today."));
children.push(h2("The problem Infrastructure as Code (IaC) solves"));
children.push(p("A Terraform file (.tf) is a single, reviewable, version-controlled source of truth describing exactly what cloud resources should exist. Anyone can read it to understand the infrastructure, review a proposed change before it happens, and re-run it to get an identical environment again (a second environment, a disaster-recovery copy, etc.)."));
children.push(h2("The core workflow"));
[
  "terraform init - downloads the plugins (\"providers\") needed to talk to a specific cloud, e.g. Azure.",
  "terraform plan - a DRY RUN. Shows exactly what would be created, changed, or destroyed, without touching anything yet.",
  "terraform apply - actually makes the change, after you review the plan.",
].forEach((t) => children.push(bullet(t)));
children.push(h2("The state file"));
children.push(p("Terraform keeps a file (terraform.tfstate) recording what it believes already exists and how each resource maps to its configuration. Without this file, Terraform would have no way to know what's already there versus what's new - every apply would try to create everything from scratch."));
children.push(h2("State locking"));
children.push(p("If two apply operations could run at the same time, they could both try to write the state file simultaneously and corrupt it. Terraform locks the state file for the duration of an operation, so a second, concurrent apply is refused with an \"Error acquiring the state lock\" message until the first one finishes. We hit this ourselves during rehearsal when two applies were started close together - it is the safety mechanism working correctly, not a bug to work around."));
children.push(h2("Drift"));
children.push(p("If someone changes a resource OUTSIDE of Terraform - for example, editing a setting directly in the Azure Portal - the real infrastructure no longer matches what Terraform's state file believes. This mismatch is called drift. Running terraform plan detects and reports it, showing you exactly what changed behind Terraform's back."));
children.push(h2("\"Must be replaced\" - force-replacement"));
children.push(p("Some resource properties simply cannot be changed in place by the cloud provider's own API - the only option Terraform has is to destroy the existing resource and create a brand new one. terraform plan marks these with \"-/+ destroy and recreate\"."));
[
  "Azure Storage Accounts: certain identity-defining properties (such as changing account_kind in some conversions) cannot be updated in place and force a full replacement.",
  "Azure Database for MySQL Flexible Server: properties that are only meaningful at creation time - such as the availability zone or the create_mode - force a brand new server if you try to change them after creation.",
].forEach((t) => children.push(bullet(t)));
children.push(callout(
  "The practical danger:",
  "A force-replace on a database or storage account means real data loss and downtime risk - the old one is destroyed before/while the new one is created. Whenever terraform plan shows \"destroy and recreate\" on anything stateful, stop and think hard before approving it. Never approve this kind of plan without reading exactly what it says it will do."
));
children.push(h2("What was actually provisioned in this session's demo"));
[
  "A resource group - the container everything else lives inside.",
  "A virtual network and subnet - private networking for anything that needs it.",
  "A storage account, with a private container for blobs.",
  "A user-assigned managed identity, with an RBAC role assignment granting it access to the storage account - proving identity-based access with zero passwords or connection strings anywhere.",
  "An Event Grid system topic and subscription, plus a storage queue - a simple event-driven pipeline: upload a file, and something reacts automatically.",
].forEach((t) => children.push(bullet(t)));

// ---------- 7. K8s ----------
children.push(h1("7. Kubernetes Autoscaling - Self-Serve Guide"));
children.push(why("Your instructor demonstrates this live today. This section lets you redo the exact same thing yourself afterward, on your own laptop, for free, with no cloud account needed."));
children.push(h2("The story"));
children.push(p("Imagine 2 million pages need OCR processing. One worker can't keep up - you want Kubernetes to automatically add more workers (pods) when load increases, and remove them again once the backlog clears. This is exactly what a HorizontalPodAutoscaler (HPA) does, driven by real CPU/memory metrics."));
children.push(h2("Step 1: Install kind and kubectl (no cloud account needed - runs entirely on your laptop)"));
children.push(p("kind (\"Kubernetes IN Docker\") runs a real, full Kubernetes cluster inside Docker containers on your own machine. Both are single downloaded binaries:"));
children.push(code(
`# kind
curl -Lo kind https://kind.sigs.k8s.io/dl/v0.30.0/kind-linux-amd64
chmod +x kind && sudo mv kind /usr/local/bin/

# kubectl
curl -Lo kubectl "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl && sudo mv kubectl /usr/local/bin/`
));
children.push(h2("Step 2: Create the cluster"));
children.push(code("kind create cluster --name devops-session"));
children.push(h2("Step 3: Install metrics-server (needed for autoscaling to see CPU usage)"));
children.push(code(
`kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# One required patch for a LOCAL kind cluster specifically:
kubectl patch deployment metrics-server -n kube-system --type='json' \\
  -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'`
));
children.push(p("Why the patch is needed: kind's internal kubelet certificates aren't signed by a certificate authority that metrics-server trusts by default. Without --kubelet-insecure-tls, metrics-server can't scrape CPU/memory from any pod at all, and the autoscaler would have no data to react to."));
children.push(h2("Step 4: Deploy a worker + autoscaler"));
children.push(p("Save this as deployment.yaml (it's also in the repo at azure-showcase/k8s-scaling/deployment.yaml):"));
children.push(code(K8S_YAML));
children.push(code("kubectl apply -f deployment.yaml"));
children.push(h2("Step 5: Watch it scale"));
children.push(code(
`kubectl get hpa -w
kubectl get pods -w`
));
children.push(p("Within a couple of minutes you'll see the pod count climb from 1 toward 10 as CPU utilization is measured well above the 50% target - exactly like more OCR workers spinning up under a growing backlog. Scale-DOWN has a several-minute stabilization delay by design (so it doesn't rapidly flap up and down when load is borderline) - be patient if watching it shrink back."));
children.push(h2("Cleanup when you're done"));
children.push(code("kubectl delete -f deployment.yaml\nkind delete cluster --name devops-session"));

// ---------- 8. How the three pieces connect ----------
children.push(h1("8. How These Three Pieces Connect"));
children.push(why("Terraform, the event-driven pipeline, and Kubernetes scaling were each demonstrated as separate proofs today. This section is explicit about what's literally wired together versus what's a conceptual illustration - and how a real production system would join all three."));

children.push(h2("1. Terraform - the foundation"));
children.push(p("Terraform literally provisioned everything the event-driven pipeline below runs on: the resource group, the VNet/subnet, the storage account (with the \"demo\" and \"processed\" containers plus the \"incoming-files\" queue), the user-assigned Managed Identity with its RBAC role assignment, and the Event Grid system topic + subscription. Terraform's job here is purely to build the plumbing - declared once, reviewably, instead of manual portal clicks."));

children.push(h2("2. Event-driven architecture - the trigger"));
children.push(p("This runs directly ON TOP of what Terraform built, and every arrow in the chain below was proven live, end to end:"));
children.push(p("upload a file -> lands in the \"demo\" container -> the storage account fires a BlobCreated event -> the Event Grid system topic -> its event subscription routes the event -> the \"incoming-files\" storage queue -> consumer.py polls the queue -> downloads the blob, \"processes\" it (uppercases the text, standing in for something heavier like OCR), and uploads the result -> the \"processed\" container."));
children.push(p("During the actual demo, the consumer script was already running and actively polling before the file was uploaded, so it reacted the moment the event landed - about 13 seconds from upload to the processed result appearing. (Technically the message would simply wait in the queue even if the consumer started late - processing order isn't required for correctness, that's just how it was demonstrated.)"));

children.push(h2("3. Kubernetes scaling - the multiplier"));
children.push(callout(
  "Be explicit about this:",
  "the Kubernetes scaling demo is a SEPARATE, standalone illustration. It ran on a local kind cluster with a synthetic CPU-load container scaling from 1 to 10 pods via a HorizontalPodAutoscaler - it was NOT literally wired into the Azure event-driven pipeline above."
));
children.push(p("The conceptual link to understand: in the event-driven demo, one Python script (consumer.py) was \"the worker\" processing each file - perfectly fine for a trickle of files. Now picture 2 million pages landing in that queue at once. A single script processing one file at a time would fall permanently behind, no matter how fast it runs."));
children.push(p("The Kubernetes demo shows the fix for exactly that bottleneck: replace the single consumer script with a Kubernetes Deployment - many identical pod replicas running the same processing logic - fronted by a HorizontalPodAutoscaler. As load increases (in a real system, tracked by queue depth or CPU usage - the demo used an artificial fixed CPU load to trigger the same behavior), Kubernetes automatically adds more pod replicas, so many pages get pulled off the queue and processed in parallel. When the backlog clears, it scales back down - with a multi-minute stabilization delay by design, so it doesn't rapidly flap up and down."));

children.push(h2("The natural next step (a stretch idea, not built today)"));
children.push(p("A real production design would go one step further than any single piece shown today: have the Kubernetes pods themselves poll the SAME Azure Storage Queue directly - authenticating with the SAME Managed Identity, no secrets anywhere - instead of a local Python script. That single change is what actually joins all three building blocks into one running system, rather than three separate proven pieces."));

children.push(h2("The one-line summary"));
children.push(callout(
  "Terraform",
  "= build the infrastructure reliably.  Event-driven architecture = pick up and process one job automatically.  Kubernetes scaling = multiply that pickup-and-process step to handle real volume, elastically."
));

// ---------- 9. Cleanup ----------
children.push(h1("9. Cleanup"));
children.push(why("Leave your lab machine (and your GitHub/Docker Hub accounts) tidy - especially the self-hosted runner and Jenkins, both of which keep running in the background using your machine's resources until you stop them."));
children.push(h2("Stop Jenkins"));
children.push(code(`ps aux | grep jenkins.war\nkill <the-pid-you-see>`));
children.push(h2("Unregister and remove the GitHub Actions runner"));
children.push(p("In your repo: Settings -> Actions -> Runners -> click your runner -> Remove. That page shows the exact remove command with a fresh token, similar to:"));
children.push(code(`cd actions-runner\n./config.sh remove --token <TOKEN-FROM-THE-REMOVE-PAGE>`));
children.push(h2("Clean up Docker"));
children.push(code(
`docker rm -f devops-session-app-live devops-session-app-jenkins-live
docker rmi devops-session-app:local <your-dockerhub-username>/devops-session-app:manual`
));
children.push(p("Optional: delete your throwaway GitHub repo and Docker Hub images from Section 1-2 if you don't want to keep them around."));

// ---------- 9. Troubleshooting ----------
children.push(h1("10. Troubleshooting Appendix"));
children.push(p("Every one of these is a REAL problem hit while preparing this exact guide - not a hypothetical."));
const trouble = [
  ["Port already in use / bind error starting Jenkins", "Something else on your machine already listens on that port. Check with `ss -tlnp | grep <port>` and pick a different --httpPort value."],
  ["docker login hangs, fails with \"context deadline exceeded\"", "This looks like a network problem but usually means you used your account PASSWORD instead of a Docker Hub Access Token. Generate a token (Section 0) and use that as the password."],
  ["gh CLI shows you're logged in, but git push fails with \"Repository not found\"", "Run `gh auth setup-git` once - this wires the GitHub CLI's existing login into git's own credential helper. Without it, git may use a stale or wrong credential even though gh itself looks authenticated."],
  ["A private GitHub repo returns 404 to a teammate", "This is expected behavior, not a bug - GitHub returns 404 (not 403) for private repos to anyone without access, indistinguishable from \"this repo doesn't exist\". Double-check repo visibility and who has access."],
  ["Smoke-test curl fails immediately after a deploy step", "The container needs a moment to fully start before it can answer a health check. Retry a handful of times with a short pause between attempts, instead of a single fixed sleep - see the retry loop pattern used in both the GitHub Actions and Jenkins scripts in this guide."],
  ["Terraform: \"Error acquiring the state lock\"", "Another apply/plan is already running (or one that crashed left a stale lock). Wait for the other operation to finish. This is a safety feature working as intended, not a bug."],
];
trouble.forEach(([t, sol]) => {
  children.push(h3(t));
  children.push(p(sol));
});

const doc = new Document({
  sections: [
    {
      properties: { page: { size: { width: 12240, height: 15840 } } },
      children,
    },
  ],
  numbering: {
    config: [
      {
        reference: "default-bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT }],
      },
    ],
  },
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("/home/dhruv/session/deliverables/Mandvi_DevOps_Session_Student_Guide.docx", buf);
  console.log("Word doc written, bytes:", buf.length);
});
