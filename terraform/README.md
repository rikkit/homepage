Infrastructure is managed by Terraform.

# Setup

[Install Terraform v0.13+](https://learn.hashicorp.com/tutorials/terraform/install-cli)

```bash
cat > terraform.tf << EOM
terraform {
  backend "local" {
    path = "[relative path to folder]/terraform.tfstate"
  }
}
EOM

# Define API keys
cat > terraform.tfvars << EOM
digitalocean_token=""
EOM

# Wrapper script
cat > terraform << EOM
terraform $1 -state /mnt/s/OneDrive/backup/homepage/terraform.tfstate ${@:2}
EOM
chmod +x terraform

./terraform init
```

Don't check in `terraform.tf`, `terraform`, `terraform.tfvars`!

# DNS

`rikk.it` is managed by GoDaddy with DigitalOcean nameservers.

# Deploy process

1. Ensure git is committed (at least any relevant changes to `docker-compose.*.yml` files)
1. Run `./do-deploy.sh`
  1. Docker containers are built locally, and pushed to Docker Hub at `rikkit/homepage_<container>:latest`
  1. Deploy triggered via Terraform taint mechanism
  1. (local) Git sync
  1. (remote) Git sync
  1. (remote) Pull docker containers
  1. (remote) Start containers
