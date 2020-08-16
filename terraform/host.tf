
resource "digitalocean_droplet" "rikk_it" {
  image   = "14169855"
  name    = "snorunt3"
  region  = "lon1"
  size    = "s-1vcpu-1gb"
  backups = true
  ipv6    = true
  ssh_keys = [
    data.digitalocean_ssh_key.snorunt.id
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
    password    = var.host_password
  }
}

resource "null_resource" "deploy" {
  depends_on = [null_resource.provision]
  triggers = {
    instance_ids = "null_resource.provision.id"
  }

  provisioner "file" {
    content     = templatefile("./scripts/init.sh", {})
    destination = "~/init.sh"
  }

  provisioner "local-exec" {
    command = templatefile("./scripts/build.sh", {
      ip = digitalocean_droplet.rikk_it.ipv4_address
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
    password    = var.host_password
  }
}
