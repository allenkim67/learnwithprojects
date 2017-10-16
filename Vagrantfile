Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.provision "shell", path: "provision.sh"


  config.vm.define "dev" do |dev|
    dev.vm.synced_folder "./", "/home/vagrant/school"
    dev.vm.network :forwarded_port, guest: 3000, host: 3000
  end

  config.vm.define "prod" do |prod|
    prod.vm.provider :digital_ocean do |provider, override|
      override.ssh.private_key_path = '~/.ssh/id_rsa'
      override.vm.box = 'digital_ocean'
      override.vm.box_url = "https://github.com/devopsgroup-io/vagrant-digitalocean/raw/master/box/digital_ocean.box"
      provider.token = '13f634b2dc470c40c274d8ef867611cd03d1d2abe6e59945c1f2c430d4da0ac7'
      provider.image = 'ubuntu-14-04-x64'
      provider.region = 'nyc1'
      provider.size = '512mb'
    end
  end
end