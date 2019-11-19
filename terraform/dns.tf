
resource "digitalocean_domain" "rikk_it" {
  name = "rikk.it"
}

resource "digitalocean_record" "root_ipv4" {
  domain = digitalocean_domain.rikk_it.name
  type   = "A"
  name   = "@"
  value  = digitalocean_droplet.rikk_it.ipv4_address
  ttl    = 3600
}

resource "digitalocean_record" "root_ipv6" {
  domain = digitalocean_domain.rikk_it.name
  type   = "AAAA"
  name   = "@"
  value  = digitalocean_droplet.rikk_it.ipv6_address
  ttl    = 3600
}

resource "digitalocean_record" "www" {
  domain = digitalocean_domain.rikk_it.name
  type   = "CNAME"
  name   = "www"
  value  = "@"
  ttl    = 3600
}

resource "digitalocean_record" "mail_cname" {
  domain = digitalocean_domain.rikk_it.name
  type   = "CNAME"
  name   = "mail"
  value  = "go.domains.live.com."
  ttl    = 3600
}

resource "digitalocean_record" "mail_mx" {
  domain   = digitalocean_domain.rikk_it.name
  type     = "MX"
  name     = "@"
  value    = "614e34c75a0d4eaf20719231a5a989.pamx1.hotmail.com."
  priority = 10
  ttl      = 1800
}

resource "digitalocean_record" "mail_txt" {
  domain = digitalocean_domain.rikk_it.name
  type   = "TXT"
  name   = "@"
  value  = "v=spf1 include:hotmail.com ~all"
  ttl    = 3600
}

resource "digitalocean_record" "mail_srv" {
  domain   = digitalocean_domain.rikk_it.name
  type     = "SRV"
  name     = "_sipfederationtls._tcp.rikk.it._tcp"
  value    = "federation.messenger.msn.com"
  priority = 10
  weight   = 2
  port     = 5061
  ttl      = 3600
}
