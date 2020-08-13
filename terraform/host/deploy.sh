#!/bin/bash
set -e

echo "✨ Setting up build directory..."

[ -d "osrfc/" ] && rm -rf osrfc/
git clone osrfc.git
cd osrfc
git checkout master
git status

echo "🏗 Building and starting containers..."
cp ~/osrfc.env .env
mv docker-compose.host.yml docker-compose.override.yml
docker-compose pull -q
docker-compose up -d

echo "✅ Deploy complete!"
