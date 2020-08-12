terraform {
  required_providers {
    digitalocean = {
      source = "terraform-providers/digitalocean"
    }
    null = {
      source = "hashicorp/null"
    }
  }
  required_version = ">= 0.13"
}
