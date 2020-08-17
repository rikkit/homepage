#!/bin/bash
set -e

echo "✨ Recreating home directory"
[ -d "homepage/" ] && rm -rf homepage/
git clone homepage.git
cd homepage
git checkout next
git status

echo "🏗 Loading deployed containers..."
mv docker-compose.host.yml docker-compose.override.yml
docker-compose pull
docker-compose up -d

echo "✅ Deploy complete!"
