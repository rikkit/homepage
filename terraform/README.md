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


