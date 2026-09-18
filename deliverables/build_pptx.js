const pptxgen = require("pptxgenjs");

const NAVY = "0B2559";
const BLUE = "1F6FD8";
const ICEBLUE = "EAF3FB";
const WHITE = "FFFFFF";
const GREY = "5B6B85";
const GREEN = "1A7F4B";
const DARKBG = "081A3D";

function newDeck() {
  const p = new pptxgen();
  p.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
  return p;
}

function titleSlide(pres, title, subtitle, meta) {
  const s = pres.addSlide();
  s.background = { color: DARKBG };
  s.addText("THE MANDVI EDUCATION SOCIETY - MCA", {
    x: 0.7, y: 0.6, w: 12, h: 0.5, fontFace: "Calibri", fontSize: 16, color: "9FC0F0", bold: true, isTextBox: true, charSpacing: 2,
  });
  s.addText(title, {
    x: 0.7, y: 2.2, w: 11.9, h: 1.7, fontFace: "Cambria", fontSize: 44, color: WHITE, bold: true, isTextBox: true,
  });
  s.addText(subtitle, {
    x: 0.7, y: 3.75, w: 11.5, h: 0.8, fontFace: "Calibri", fontSize: 20, color: "CADCFC", italic: true, isTextBox: true,
  });
  s.addShape(pres.ShapeType.rect, { x: 0.7, y: 5.0, w: 3.2, h: 0.02, fill: { color: "2A4B85" } });
  s.addText(meta, {
    x: 0.7, y: 5.3, w: 11, h: 1.2, fontFace: "Calibri", fontSize: 15, color: "B9D1F5", isTextBox: true, lineSpacingMultiple: 1.3,
  });
  return s;
}

function sectionSlide(pres, kicker, title) {
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addText(kicker.toUpperCase(), {
    x: 0.9, y: 2.7, w: 11, h: 0.5, fontFace: "Calibri", fontSize: 16, color: "8FB3EA", bold: true, isTextBox: true, charSpacing: 2,
  });
  s.addText(title, {
    x: 0.9, y: 3.2, w: 11.5, h: 1.8, fontFace: "Cambria", fontSize: 38, color: WHITE, bold: true, isTextBox: true,
  });
  return s;
}

function contentSlide(pres, title, kicker) {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  if (kicker) {
    s.addText(kicker.toUpperCase(), {
      x: 0.6, y: 0.35, w: 10, h: 0.35, fontFace: "Calibri", fontSize: 12, color: BLUE, bold: true, isTextBox: true, charSpacing: 1.5,
    });
  }
  s.addText(title, {
    x: 0.6, y: kicker ? 0.68 : 0.4, w: 12.1, h: 0.9, fontFace: "Cambria", fontSize: 30, color: NAVY, bold: true, isTextBox: true,
  });
  return s;
}

function bulletsBlock(pres, s, items, opts) {
  const o = Object.assign({ x: 0.6, y: 1.7, w: 6.0, h: 5.0, fontSize: 15 }, opts || {});
  const paras = items.map((t, i) => ({
    text: t,
    options: {
      bullet: { code: "2022", indent: 18 },
      color: NAVY,
      fontFace: "Calibri",
      fontSize: o.fontSize,
      breakLine: i !== items.length - 1,
      paraSpaceAfter: 12,
    },
  }));
  s.addText(paras, { x: o.x, y: o.y, w: o.w, h: o.h, isTextBox: true, valign: "top" });
}

function codeBox(pres, s, code, opts) {
  const o = Object.assign({ x: 6.9, y: 1.7, w: 5.9, h: 5.0, fontSize: 11 }, opts || {});
  s.addShape(pres.ShapeType.roundRect, {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.08, fill: { color: "1E1E1E" }, line: { type: "none" },
  });
  s.addText(code, {
    x: o.x + 0.25, y: o.y + 0.2, w: o.w - 0.5, h: o.h - 0.4, fontFace: "Consolas", fontSize: o.fontSize,
    color: "D4D4D4", isTextBox: true, valign: "top", margin: 0, lineSpacingMultiple: 1.15,
  });
}

function iconCircleRow(pres, s, rows, opts) {
  const o = Object.assign({ x: 0.6, y: 1.7, w: 12.1, itemH: 1.15 }, opts || {});
  rows.forEach((row, i) => {
    const y = o.y + i * o.itemH;
    s.addShape(pres.ShapeType.ellipse, { x: o.x, y: y, w: 0.55, h: 0.55, fill: { color: ICEBLUE }, line: { color: BLUE, width: 1.5 } });
    s.addText(row.num || String(i + 1), { x: o.x, y: y, w: 0.55, h: 0.55, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 18, bold: true, color: BLUE, isTextBox: true, margin: 0 });
    s.addText(row.title, { x: o.x + 0.75, y: y - 0.05, w: o.w - 0.75, h: 0.4, fontFace: "Calibri", fontSize: 16, bold: true, color: NAVY, isTextBox: true, margin: 0 });
    s.addText(row.desc, { x: o.x + 0.75, y: y + 0.32, w: o.w - 0.75, h: 0.7, fontFace: "Calibri", fontSize: 13, color: GREY, isTextBox: true, margin: 0 });
  });
}

function footerTag(pres, s, text) {
  s.addText(text, { x: 0.6, y: 7.05, w: 12, h: 0.35, fontFace: "Calibri", fontSize: 10, color: "9AA7BD", isTextBox: true });
}

const pres = newDeck();

// 1. Title
titleSlide(
  pres,
  "DevOps in Production",
  "Git, IaC, Docker, and the Architecture Behind Scale",
  `Resource Person: Dhruv Hemantbhai Patel  |  DevOps Engineer at Raapid Inc.
19 September  |  12:00 PM  |  Computer Lab - B
Affiliated to GTU Ahmedabad, Approved by AICTE, New Delhi`
);

// 2. Agenda
{
  const s = contentSlide(pres, "Today's Plan - 2 Hours", "Agenda");
  iconCircleRow(pres, s, [
    { title: "Hands-on: Docker + Git, the manual way", desc: "Build, tag, and push an image by hand - and feel why that doesn't scale." },
    { title: "Hands-on: GitHub Actions - CI then CD", desc: "Automate the build/push, then deploy it back to your own machine." },
    { title: "Hands-on: Jenkins - the same pipeline, a different tool", desc: "One Freestyle job, one shell script, CI and CD together." },
    { title: "Showcase: Production concepts at scale", desc: "Terraform, Managed Identity, event-driven architecture, Kubernetes autoscaling." },
  ], { itemH: 1.2 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 3. Concept refresher
{
  const s = contentSlide(pres, "Quick Refresher", "Concepts");
  bulletsBlock(pres, s, [
    "Git - tracks every change to your code, forever, with full history.",
    "GitHub - hosts your Git repository, plus automation (Actions) around it.",
    "Docker - packages your app + everything it needs to run into one portable image.",
    "CI (Continuous Integration) - automatically build and test on every push.",
    "CD (Continuous Deployment) - automatically ship the new build somewhere it runs.",
  ], { w: 12.1, fontSize: 17, y: 1.8 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 4. Architecture diagram (built from shapes, not an image)
{
  const s = contentSlide(pres, "What We're Building Today", "Architecture");
  const boxes = [
    { t: "Your Code (Flask app)", x: 0.5 },
    { t: "GitHub (git push)", x: 2.85 },
    { t: "GitHub Actions (build + push)", x: 5.2 },
    { t: "Docker Hub (image registry)", x: 7.55 },
    { t: "Self-Hosted Runner (your laptop - deploy)", x: 9.9 },
  ];
  const y = 2.6, w = 2.1, h = 1.3;
  boxes.forEach((b) => {
    s.addShape(pres.ShapeType.roundRect, { x: b.x, y, w, h, rectRadius: 0.06, fill: { color: ICEBLUE }, line: { color: BLUE, width: 1.25 } });
    s.addText(b.t, { x: b.x, y, w, h, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 12.5, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  });
  for (let i = 0; i < boxes.length - 1; i++) {
    s.addShape(pres.ShapeType.rightArrow, { x: boxes[i].x + w + 0.02, y: y + h / 2 - 0.1, w: boxes[i + 1].x - (boxes[i].x + w) - 0.04, h: 0.2, fill: { color: BLUE }, line: { type: "none" } });
  }
  s.addShape(pres.ShapeType.roundRect, { x: 3.2, y: 4.6, w: 6.9, h: 1.3, rectRadius: 0.06, fill: { color: "FDF3E3" }, line: { color: "C9922C", width: 1.25 } });
  s.addText("Jenkins (native, on this same laptop) One shell script: build -> push -> redeploy -> smoke test", {
    x: 3.2, y: 4.6, w: 6.9, h: 1.3, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 13.5, bold: true, color: "7A5A10", isTextBox: true, margin: 0,
  });
  footerTag(pres, s, "Two tools, same pattern: build -> push -> deploy -> verify");
}

// 5. The app
{
  const s = contentSlide(pres, "The App We'll Ship", "Live Coding");
  bulletsBlock(pres, s, [
    "A small Flask app - three routes:",
    "/  - branded HTML status page",
    "/api  - the same data as JSON",
    "/health  - plain health check (used by automation)",
    "Shows container hostname + request count - proves each deploy is a fresh container.",
  ], { w: 5.9, fontSize: 15 });
  codeBox(pres, s, `FROM python:3.12-slim
WORKDIR /app

# requirements first = better layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir \\
    -r requirements.txt

COPY app.py .
RUN useradd -m appuser
USER appuser

ENV APP_ENV=docker
EXPOSE 5000
CMD ["python", "app.py"]`, { fontSize: 12.5 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 6. Manual pain
{
  const s = contentSlide(pres, "Before We Automate Anything...", "The Manual Pain");
  codeBox(pres, s, `docker build -t devops-session-app:local .

docker login -u <username>
# (paste Access Token as password)

docker tag devops-session-app:local \\
    <username>/devops-session-app:manual

docker push \\
    <username>/devops-session-app:manual`, { x: 0.6, w: 6.0, fontSize: 13.5 });
  bulletsBlock(pres, s, [
    "Every one of these steps, by hand,",
    "every single time you change one line of code.",
    "Miss a step, or typo a tag, and you ship",
    "the wrong image without knowing it.",
    "This is exactly what CI/CD removes.",
  ], { x: 6.9, w: 5.9, fontSize: 16 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 7. GH Actions CI intro
{
  const s = sectionSlide(pres, "Part 1", "GitHub Actions - Continuous Integration");
}

// 8. GH Actions CI workflow
{
  const s = contentSlide(pres, "The CI Workflow", "GitHub Actions - CI");
  codeBox(pres, s, `on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}
      - run: docker build -t $USER/app:$SHA
                          -t $USER/app:latest .
      - run: docker push $USER/app:$SHA
      - run: docker push $USER/app:latest`, { x: 0.6, w: 6.4, fontSize: 11.5 });
  bulletsBlock(pres, s, [
    "Triggers on every push to main.",
    "Two secrets, never in plain YAML: DOCKERHUB_USERNAME, DOCKERHUB_TOKEN",
    "Two tags: commit SHA (traceable) and latest (moving pointer).",
    "Runs entirely on GitHub's own cloud runner.",
  ], { x: 7.3, w: 5.4, fontSize: 15 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 9. GH Actions CD - why
{
  const s = contentSlide(pres, "Why CD Needs Something Extra", "GitHub Actions - CD");
  bulletsBlock(pres, s, [
    "GitHub's cloud runner is thrown away the second the CI job finishes.",
    "It cannot host a long-running app - it simply won't exist five minutes later.",
    "A Self-Hosted Runner solves this: a small program YOU run, on YOUR OWN machine, registered to your repo.",
    "When a deploy job targets it, it really runs on your machine - and anything it starts keeps running.",
  ], { w: 12.1, fontSize: 17, y: 1.8 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 10. GH Actions CD - setup + job
{
  const s = contentSlide(pres, "Registering and Using the Runner", "GitHub Actions - CD");
  codeBox(pres, s, `./config.sh --url <repo-url> \\
  --token <TOKEN> \\
  --name laptop-runner \\
  --labels self-hosted,docker

sudo ./svc.sh install
sudo ./svc.sh start

# in the workflow:
  deploy:
    needs: build-and-push
    runs-on: [self-hosted, docker]`, { x: 0.6, w: 6.0, fontSize: 12.5 });
  bulletsBlock(pres, s, [
    "Get a registration token from Settings -> Actions -> Runners.",
    "Deploy job: pull latest image, restart the container, smoke-test it.",
    "Smoke test retries for ~20s - a fresh container needs a moment to start before it answers.",
  ], { x: 6.9, w: 5.9, fontSize: 15 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 11. Jenkins intro
sectionSlide(pres, "Part 2", "Jenkins - Same Pipeline, Different Tool");

// 12. Jenkins setup
{
  const s = contentSlide(pres, "Native Install - No Docker-in-Docker Needed", "Jenkins");
  codeBox(pres, s, `wget https://updates.jenkins.io/\\
  download/war/2.581/jenkins.war

nohup java -jar \\
  jenkins.war \\
  --httpListenAddress=127.0.0.1 \\
  --httpPort=8081 --prefix=/ &`, { x: 0.6, w: 6.0, fontSize: 13 });
  bulletsBlock(pres, s, [
    "Runs directly on the laptop - your user account already has Docker access.",
    "Port already in use? Just pick a different --httpPort.",
    "One Freestyle job. Source Code Management: None - the script clones its own fresh copy every run.",
    "One \"Execute shell\" build step does everything.",
  ], { x: 6.9, w: 5.9, fontSize: 15 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 13. Jenkins script
{
  const s = contentSlide(pres, "One Script: CI + CD Together", "Jenkins");
  codeBox(pres, s, `set -e   # stop at the FIRST failure

git clone $REPO_URL repo && cd repo

echo "$TOKEN" | docker login -u "$USER" \\
  --password-stdin

docker build -t $IMAGE:$TAG .      # CI
docker push $IMAGE:$TAG            # CI

docker rm -f app-live || true      # CD
docker run -d --name app-live \\
  -p 5070:5000 $IMAGE:latest       # CD

curl -sf localhost:5070/health     # verify`, { x: 0.6, w: 6.6, fontSize: 11.5 });
  bulletsBlock(pres, s, [
    "set -e = fail-fast, on purpose.",
    "If build/push fails, deploy never runs - a broken image is never redeployed over a working one.",
    "Uses plain export for credentials here (simple, but visible in job config) - Jenkins' own encrypted Credentials store is the safer production pattern.",
  ], { x: 7.5, w: 5.2, fontSize: 14 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 14. Transition
sectionSlide(pres, "Instructor Showcase", "Now Let's See This at Real Production Scale");

// 15. Terraform intro
{
  const s = contentSlide(pres, "Infrastructure as Code", "Terraform");
  bulletsBlock(pres, s, [
    "Clicking through a cloud portal is slow, unrepeatable, and undocumented.",
    "A Terraform file is a single reviewable, version-controlled source of truth.",
    "terraform init - download provider plugins",
    "terraform plan - dry run: what WOULD change",
    "terraform apply - actually make the change",
  ], { w: 12.1, fontSize: 17, y: 1.8 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 16. Terraform state/drift/replace
{
  const s = contentSlide(pres, "State, Locking, Drift, and \"Must Be Replaced\"", "Terraform");
  iconCircleRow(pres, s, [
    { title: "State file", desc: "Terraform's record of what it believes exists - without it, every apply would try to build everything from scratch." },
    { title: "State locking", desc: "Prevents two applies writing the state file at once. \"Error acquiring the lock\" = the safety net working, not a bug." },
    { title: "Drift", desc: "Someone changes a resource outside Terraform (e.g. in the Portal) - plan detects the mismatch." },
    { title: "\"Must be replaced\"", desc: "Some properties can't change in-place - Terraform destroys and recreates. On a database or storage account: stop and think before approving." },
  ], { itemH: 1.15 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 17. Managed Identity
{
  const s = contentSlide(pres, "Zero Passwords, Zero Connection Strings", "Managed Identity");
  bulletsBlock(pres, s, [
    "The problem: secrets scattered everywhere - in config files, env vars, scripts.",
    "The idea: the cloud resource itself HAS an identity - it authenticates as itself.",
    "Live-validated today: a container with ZERO stored credentials logged in using only its attached identity...",
    "...and successfully uploaded a real file to Azure Blob Storage. No password, no connection string, anywhere.",
  ], { w: 12.1, fontSize: 17, y: 1.8 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 18. Event-driven architecture
{
  const s = contentSlide(pres, "A File Lands. Something Reacts. Automatically.", "Event-Driven Architecture");
  const boxes = [
    { t: "Blob Uploaded", x: 0.6 },
    { t: "Event Grid (BlobCreated)", x: 3.35 },
    { t: "Storage Queue", x: 6.1 },
    { t: "Consumer (processes file)", x: 8.85 },
  ];
  const y = 2.4, w = 2.4, h = 1.3;
  boxes.forEach((b) => {
    s.addShape(pres.ShapeType.roundRect, { x: b.x, y, w, h, rectRadius: 0.06, fill: { color: ICEBLUE }, line: { color: BLUE, width: 1.25 } });
    s.addText(b.t, { x: b.x, y, w, h, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 14, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  });
  for (let i = 0; i < boxes.length - 1; i++) {
    s.addShape(pres.ShapeType.rightArrow, { x: boxes[i].x + w + 0.03, y: y + h / 2 - 0.11, w: boxes[i + 1].x - (boxes[i].x + w) - 0.06, h: 0.22, fill: { color: BLUE }, line: { type: "none" } });
  }
  bulletsBlock(pres, s, [
    "Live-validated today: a text file uploaded to blob storage triggered an Event Grid notification, landed in a Storage Queue, and a small consumer script picked it up, transformed it, and wrote the result to a separate container - fully automatically, in under 15 seconds.",
    "Same pattern that powers real ingestion pipelines - e.g. a document lands, OCR processing kicks off automatically.",
  ], { x: 0.6, y: 4.2, w: 12.1, fontSize: 15 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 19. K8s scaling
{
  const s = contentSlide(pres, "\"If 2 Million Pages Need Processing...\"", "Kubernetes Autoscaling");
  bulletsBlock(pres, s, [
    "...each service should scale to meet that load, automatically.",
    "A HorizontalPodAutoscaler watches real CPU/memory metrics per pod.",
    "Cross the target utilization, and Kubernetes adds more worker pods.",
    "Load drops, and it scales back down (with a deliberate delay, so it doesn't flap up and down).",
  ], { w: 6.4, fontSize: 16 });
  codeBox(pres, s, `kubectl get hpa -w

NAME             TARGETS      REPLICAS
page-processor   250%/50%     1 -> 10

# live demo: watch pods scale
kubectl get pods -w`, { x: 7.1, w: 5.4, fontSize: 13, y: 2.5, h: 2.2 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 19b. How the three pieces connect
{
  const s = contentSlide(pres, "How These Three Pieces Connect", "The Bigger Picture");
  iconCircleRow(pres, s, [
    { num: "1", title: "Terraform - the foundation", desc: "Literally provisioned everything underneath: the resource group, VNet, storage account (containers + queue), the Managed Identity + RBAC role, and the Event Grid topic/subscription. Its job is purely building the plumbing." },
    { num: "2", title: "Event-driven pipeline - the trigger", desc: "Runs directly ON that Terraform-built plumbing - a real, tested, live chain: upload -> BlobCreated event -> Event Grid -> Queue -> consumer script -> result in a separate container. Every arrow was proven live, end to end." },
    { num: "3", title: "Kubernetes scaling - the multiplier", desc: "A SEPARATE, standalone demo on a local kind cluster - not literally wired into the Azure pipeline above. It illustrates the concept: what happens to \"the processing step\" when volume goes from a trickle to 2 million pages." },
  ], { itemH: 1.55 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 19c. The natural next step
{
  const s = contentSlide(pres, "From Proven Building Blocks to One System", "The Bigger Picture");
  bulletsBlock(pres, s, [
    "Today's single consumer.py script is one worker - fine for a trickle of files, but it processes one file at a time and would fall permanently behind 2 million pages landing in the queue at once.",
    "The natural next step (not built today): replace that one script with a Kubernetes Deployment - many identical pod replicas polling the SAME Azure Storage Queue directly, authenticating with the SAME Managed Identity, no secrets anywhere.",
    "A HorizontalPodAutoscaler then adds pod replicas as queue depth or CPU load rises, so many pages get pulled and processed in parallel - and scales back down once the backlog clears.",
  ], { w: 12.1, fontSize: 16, y: 1.8 });
  s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 5.35, w: 12.1, h: 1.35, rectRadius: 0.06, fill: { color: ICEBLUE }, line: { color: BLUE, width: 1.25 } });
  s.addText(
    [
      { text: "Terraform ", options: { bold: true, color: NAVY } },
      { text: "= build the infrastructure reliably.   ", options: { color: GREY } },
      { text: "Event-driven architecture ", options: { bold: true, color: NAVY } },
      { text: "= pick up and process one job automatically.   ", options: { color: GREY } },
      { text: "Kubernetes scaling ", options: { bold: true, color: NAVY } },
      { text: "= multiply that step to handle real volume, elastically.", options: { color: GREY } },
    ],
    { x: 0.9, y: 5.55, w: 11.5, h: 1.0, fontFace: "Calibri", fontSize: 14.5, isTextBox: true, valign: "middle", margin: 0, lineSpacingMultiple: 1.25 }
  );
  footerTag(pres, s, "Three proven building blocks today - one production system when wired together");
}

// 20. MySQL AAD + connection exhaustion
{
  const s = contentSlide(pres, "Two More Production Realities", "Concepts (No Live Demo)");
  iconCircleRow(pres, s, [
    { title: "MySQL Azure AD (passwordless) authentication", desc: "A hardcoded database password is a leak waiting to happen. Azure AD-based auth removes the password from the equation entirely - same idea as Managed Identity, applied to a database connection." },
    { title: "Database connection exhaustion at scale", desc: "A connection pool sized for normal traffic can pin a database's CPU at 100% during a spike - and take down a completely unrelated service that happens to share that database. Capacity planning is a production skill, not an afterthought." },
  ], { itemH: 1.6 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 21. Recap
{
  const s = contentSlide(pres, "What You Built Today", "Recap");
  bulletsBlock(pres, s, [
    "A Dockerized Flask app, pushed to Docker Hub by hand and understood why that doesn't scale.",
    "A GitHub Actions pipeline: CI (build+push) and CD (deploy via your own self-hosted runner).",
    "A Jenkins Freestyle job doing the same CI+CD, natively, in one shell script.",
    "Watched real production concepts live: Terraform, Managed Identity, event-driven architecture, and Kubernetes autoscaling.",
  ], { w: 12.1, fontSize: 17, y: 1.8 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 22. Next steps
{
  const s = contentSlide(pres, "Keep Going After Today", "What's Next");
  bulletsBlock(pres, s, [
    "Everything from today - app code, workflows, Jenkins script, Terraform, Kubernetes manifests - is in the shared GitHub repository.",
    "The Student Hands-On Guide walks through every step again, with every command, so you can redo this on your own, anytime.",
    "Try the Kubernetes autoscaling section yourself - it costs nothing and needs no cloud account.",
  ], { w: 12.1, fontSize: 17, y: 1.8 });
  footerTag(pres, s, "Mandvi Education Society - MCA  |  DevOps in Production");
}

// 23. Thank you
{
  const s = pres.addSlide();
  s.background = { color: DARKBG };
  s.addText("Thank You", { x: 0.7, y: 2.5, w: 11.9, h: 1.2, fontFace: "Cambria", fontSize: 44, bold: true, color: WHITE, isTextBox: true });
  s.addText("Questions?", { x: 0.7, y: 3.6, w: 11.9, h: 0.7, fontFace: "Calibri", fontSize: 22, color: "CADCFC", italic: true, isTextBox: true });
  s.addText(
    [
      { text: "The Mandvi Education Society, At & Post Mandvi, Dis-Surat, Gujarat, 394160", options: { breakLine: true } },
      { text: "WhatsApp: +91-84600 82200   |   www.mestech.ac.in" },
    ],
    { x: 0.7, y: 5.6, w: 11.5, h: 1.0, fontFace: "Calibri", fontSize: 14, color: "9FC0F0", isTextBox: true, lineSpacingMultiple: 1.3, paraSpaceAfter: 4 }
  );
}

pres.writeFile({ fileName: "/home/dhruv/session/deliverables/Mandvi_DevOps_Session_Presentation.pptx" }).then((fileName) => {
  console.log("PPT written:", fileName);
});
