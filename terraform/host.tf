
resource "digitalocean_droplet" "rikk_it" {
  image   = "ubuntu-20-04-x64"
  name    = "snorunt3"
  region  = "lon1"
  size    = "s-1vcpu-1gb"
  backups = true
  ipv6    = true
  ssh_keys = [
    data.digitalocean_ssh_key.snorunt.id,
    data.digitalocean_ssh_key.grizzly.id
  ]
}

resource "null_resource" "provision" {
  depends_on = [digitalocean_droplet.rikk_it]
  triggers = {
    instance_ids = digitalocean_droplet.rikk_it.id
  }

  provisioner "file" {
    source      = "scripts/provision.sh"
    destination = "~/provision.sh"
  }

  provisioner "file" {
    source      = "../data/.digitalocean.ini"
    destination = "~/homepage-data/.digitalocean.ini"
  }

  provisioner "file" {
    source      = "../data/tiles/config.json"
    destination = "~/homepage-data/tiles/config.json"
  }

  provisioner "remote-exec" {
    inline = [
      "cd ~",
      "chmod +x ./provision.sh",
      "./provision.sh",
    ]
  }

  connection {
    type        = "ssh"
    host        = digitalocean_droplet.rikk_it.ipv4_address
    user        = "root"
    private_key = file(var.host_ssh_key)
  }
}

resource "null_resource" "deploy" {
  depends_on = [null_resource.provision]
  triggers = {
    instance_ids = "null_resource.provision.id"
  }

  provisioner "file" {
    content     = templatefile("./scripts/init.sh", {
      certbot_email = var.certbot_email,
      domain_api = var.domain_api,
      domain_web = var.domain_web,
    })
    destination = "~/init.sh"
  }

  provisioner "local-exec" {
    command = templatefile("./scripts/deploy.sh", {
      ip = digitalocean_droplet.rikk_it.ipv4_address,
    })
  }

  provisioner "remote-exec" {
    inline = [
      "cd ~",
      "chmod +x ./init.sh",
      "./init.sh",
    ]
  }

  connection {
    type        = "ssh"
    host        = digitalocean_droplet.rikk_it.ipv4_address
    user        = "root"
    private_key = file(var.host_ssh_key)
    agent       = true
  }
}
