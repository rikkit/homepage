
variable "digitalocean_token" {}
variable "host_password" {}

provider "digitalocean" {
  token = var.digitalocean_token
}

data "digitalocean_ssh_key" "snorunt" {
  name = "snorunt"
}
