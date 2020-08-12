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

terraform init
```

Don't check in `terraform.tf` or `terraform.tfvars`!

# DNS

`rikk.it` is managed by GoDaddy with DigitalOcean nameservers.


