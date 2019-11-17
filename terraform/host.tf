
resource "digitalocean_droplet" "rikk_it" {
  image   = "14169855"
  name    = "snorunt3"
  region  = "lon1"
  size    = "s-1vcpu-1gb"
  backups = true
  ipv6    = true
  ssh_keys = [
    data.digitalocean_ssh_key.osrfc.id
  ]
}
