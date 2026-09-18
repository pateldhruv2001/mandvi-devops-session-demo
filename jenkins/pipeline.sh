#!/bin/bash
# Jenkins Freestyle "Execute shell" build step.
#
# This does the SAME thing as the GitHub Actions workflow
# (.github/workflows/docker-ci.yml), just with a different tool:
#   1. Get latest code
#   2. Log in to Docker Hub
#   3. Build the image                    <-- "CI"
#   4. Push the image to Docker Hub        <-- "CI"
#   5. Redeploy the local container        <-- "CD"
#   6. Smoke test the redeployed app
#
# `set -e` makes the whole job stop at the first failing command. If step 3
# or 4 (the CI part) fails, steps 5/6 (the CD part) never run - Jenkins marks
# the build FAILED and does NOT redeploy a broken image. This is intentional.
set -e

# --- Configuration ---
# NOTE: hardcoding a token here is the quick/simple way (and mirrors how some
# older Jenkins setups plainly export credentials in a shell step), but it
# means anyone with access to this job's configuration can read the token in
# plain text, and it will appear in this file if committed to git.
# The safer alternative (what we used in the GitHub Actions workflow) is
# Jenkins' own "Credentials" store + the Credentials Binding plugin, which
# injects the secret as an env var without ever displaying it. Know the
# tradeoff you are making before you copy this pattern into a real project.
export DOCKERHUB_USERNAME="dhruvpatel2001"
export DOCKERHUB_TOKEN="REPLACE_WITH_YOUR_DOCKERHUB_TOKEN"

REPO_URL="https://github.com/pateldhruv2001/mandvi-devops-session-demo.git"
IMAGE="$DOCKERHUB_USERNAME/devops-session-app"
TAG="jenkins-native-${BUILD_NUMBER:-local}"
DEPLOY_PORT=5070
CONTAINER_NAME="devops-session-app-jenkins-live"

echo "=== Step 1: Get latest code ==="
if [ -d repo/.git ]; then
  cd repo
  git pull origin main
else
  git clone "$REPO_URL" repo
  cd repo
fi

echo "=== Step 2: Docker Hub login ==="
echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

echo "=== Step 3: Build image (CI) ==="
docker build -t "$IMAGE:$TAG" -t "$IMAGE:latest" .

echo "=== Step 4: Push image (CI) ==="
docker push "$IMAGE:$TAG"
docker push "$IMAGE:latest"

echo "=== Step 5: Redeploy local container (CD) ==="
docker rm -f "$CONTAINER_NAME" || true
docker run -d --name "$CONTAINER_NAME" \
  -p ${DEPLOY_PORT}:5000 \
  -e APP_ENV=jenkins-native-cd \
  "$IMAGE:latest"

echo "=== Step 6: Smoke test ==="
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -sf http://localhost:${DEPLOY_PORT}/health; then
    echo "App is up and healthy at http://localhost:${DEPLOY_PORT}/"
    exit 0
  fi
  echo "Not ready yet, retrying..."
  sleep 2
done
echo "App did not become healthy in time"
exit 1
