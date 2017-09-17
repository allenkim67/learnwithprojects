Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 68576280
    sudo apt-add-repository "deb https://deb.nodesource.com/node_8.x $(lsb_release -sc) main"
    sudo apt-get update
    sudo apt-get install -y nodejs git
  SHELL

  config.vm.synced_folder "./", "/home/vagrant/school"
  config.vm.network :forwarded_port, guest: 3000, host: 3000
end