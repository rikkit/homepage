# homepage

This is the source for [rikk.it](http://rikk.it). The site is built using JQuery/TypeScript and a static site generator written in C#.

# Setup (dev)

Run in WSL 2 (Ubuntu)

## Containers

1. Get DO API key and save to ~/.digitalocean.ini `dns_digitalocean_token = xxxxx`
1. Create SSL cert for local dev `dc run --entrypoint certbot certbot certonly  --dns-digitalocean --dns-digitalocean-credentials /root/.digitalocean.ini --agree-tos --email hello@rikk.it --domain dev.rikk.it`
1. 

# Licence

Code is licensed under MIT.