# Define variables
PROJECT_ID="v2-layer8-playground"
REGION="asia-southeast1"
REPO="k8s-exercise-repo"

# Build and Push (Example for Backend)
docker build -t backend ./backend
docker tag backend $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/backend:v1
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/backend:v1

# Apply K8s Config
kubectl apply -f k8s/config-env.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/reverse-proxy.yaml