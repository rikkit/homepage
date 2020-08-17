#!/bin/bash
set -e

echo "🐳 Building docker containers..."
(cd .. && docker-compose build --progress --parallel)

docker tag homepage_generator rikkit/homepage_generator:latest
docker tag homepage_frontend rikkit/homepage_frontend:latest
docker tag homepage_backend rikkit/homepage_backend:latest
docker tag homepage_proxy rikkit/homepage_proxy:latest

echo "🐳 Pushing to Docker Hub..."
docker push rikkit/homepage_generator:latest
docker push rikkit/homepage_frontend:latest
docker push rikkit/homepage_backend:latest
docker push rikkit/homepage_proxy:latest

echo "🌍 Starting Terraform..."
./terraform taint null_resource.deploy
./terraform apply
