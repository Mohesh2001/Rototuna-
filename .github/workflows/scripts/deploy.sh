#!/bin/bash

set -e

IMAGE="mohesh2001/rototuna_frontend"
TAG="latest"
CONTAINER="rototuna-frontend"

echo "======================================"
echo "Rototuna Frontend Deployment"
echo "======================================"

echo "Docker version:"
docker --version

echo ""
echo "Pulling latest image from Docker Hub..."
docker pull ${IMAGE}:${TAG}

echo ""
echo "Stopping existing container..."
docker stop ${CONTAINER} || true

echo ""
echo "Removing existing container..."
docker rm ${CONTAINER} || true

echo ""
echo "Starting new container..."

docker run -d \
    --name ${CONTAINER} \
    --restart unless-stopped \
    -p 80:80 \
    ${IMAGE}:${TAG}

echo ""
echo "Waiting for container to start..."
sleep 5

echo ""
echo "Checking container status..."
docker ps --filter "name=${CONTAINER}"

echo ""
echo "Cleaning unused Docker images..."
docker image prune -af

echo ""
echo "======================================"
echo "Deployment completed successfully!"
echo "======================================"
