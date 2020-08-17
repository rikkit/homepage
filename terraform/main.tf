
variable "digitalocean_token" {}
variable "host_ssh_key" {}

variable "certbot_email" {}
variable "domain_web" {}
variable "domain_api" {}

provider "digitalocean" {
  token = var.digitalocean_token
}

data "digitalocean_ssh_key" "snorunt" {
  name = "snorunt"
}

data "digitalocean_ssh_key" "grizzly" {
  name = "grizzly"
}
