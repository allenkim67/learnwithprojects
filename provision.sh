#!/usr/bin/env bash

# add repos for latest version of node
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 68576280
sudo apt-add-repository "deb https://deb.nodesource.com/node_8.x $(lsb_release -sc) main"

# add repo for libstdc++6
sudo add-apt-repository ppa:ubuntu-toolchain-r/test

sudo apt-get update

# need libssl-dev and libstdc++6 for nodegit
sudo apt-get install -y nodejs git libssl-dev
sudo apt-get upgrade -y libstdc++6