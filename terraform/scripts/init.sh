#!/bin/bash
set -e

echo "✨ Recreating home directory"
[ -d "homepage/" ] && rm -rf homepage/
git clone homepage.git
cd homepage

mkdir -p ~/homepage-data
ln -s /root/homepage-data/ /root/homepage/data
mkdir -p data/tiles
mkdir -p data/certbot
touch data/certbot/tiles.json
touch data/certbot/config.json
touch data/.digitalocean.ini
chmod 0700 data/.digitalocean.ini

git checkout next

echo "🏗 Loading deployed containers..."
mv docker-compose.host.yml docker-compose.override.yml
docker-compose pull -q
docker-compose up -d

echo "🔑 Checking SSL.."
if ! [ -f "./data/certbot/conf/live/${domain_web}/cert.pem" ]; then
  echo "🔑 Creating SSL cert for ${domain_web} as it doesn't exist..."
  docker-compose run --entrypoint certbot certbot certonly \
    --dns-digitalocean --dns-digitalocean-credentials /root/.digitalocean.ini \
    --agree-tos --email ${certbot_email} --domain ${domain_web} -n
fi

if ! [ -f "./data/certbot/conf/live/${domain_api}/cert.pem" ]; then
  echo "🔑 Creating SSL cert for ${domain_api} as it doesn't exist..."
  docker-compose run --entrypoint certbot certbot certonly \
    --dns-digitalocean --dns-digitalocean-credentials /root/.digitalocean.ini \
    --agree-tos --email ${certbot_email} --domain ${domain_api} -n
fi

echo "✅ Deploy complete!"
