#!/bin/bash
set -e

git push ssh://root@${ip}/~/osrfc.git

# Build locally and push
docker-compose build

docker tag osrfc_frontend:latest rikkit/osrfc:frontend
docker tag osrfc_wordpress:latest rikkit/osrfc:wordpress
docker tag osrfc_scraper:latest rikkit/osrfc:scraper

docker push rikkit/osrfc:frontend
docker push rikkit/osrfc:wordpress
docker push rikkit/osrfc:scraper
