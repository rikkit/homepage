#!/bin/bash
set -e

sudo apt-get update

if ! [ -x "$(command -v unzip)" ]; then
  sudo apt-get -y install unzip
fi

# Install docker https://docs.docker.com/install/linux/docker-ce/ubuntu/
if ! [ -x "$(command -v docker)" ]; then
  sudo apt-get -y install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
  sudo apt-get update
  sudo apt-get -y install docker-ce docker-ce-cli containerd.io

  sudo docker run hello-world
fi

if ! [ -x "$(command -v docker-compose)" ]; then
  sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
fi

git init --bare osrfc.git
