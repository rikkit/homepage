# homepage

This is the source for [rikk.it](http://rikk.it). The site is built using JQuery/TypeScript and a static site generator written in C#.

# Setup (dev)

Run in WSL 2 (Ubuntu)

## Containers

1. Get DO API key and save to `./data/.digitalocean.ini` `dns_digitalocean_token = xxxxx`
1. Create SSL cert for local dev `dc run --entrypoint certbot certbot certonly --dns-digitalocean --dns-digitalocean-credentials /root/.digitalocean.ini --agree-tos --email hello@rikk.it --domain dev.rikk.it`
1. If certs are newly created, `sudo chown -R <user>` to match nginx user: in `docker-compose.override.yml`
1. Add entries to hosts on Windows `xx.xx.xx.xx		dev.rikk.it api-dev.rikk.it` - IP is `host.docker.internal` resolved
1. `dc up -d`

# Licence

Code is licensed under MIT.