
variable "digitalocean_token" {}

provider "digitalocean" {
  token = var.digitalocean_token
}

data "digitalocean_ssh_key" "osrfc" {
  name = "osrfc"
}
