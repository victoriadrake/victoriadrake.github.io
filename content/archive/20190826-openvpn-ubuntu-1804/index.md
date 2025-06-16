---
title: How to set up OpenVPN on AWS EC2 and fix DNS leaks on Ubuntu 18.04 LTS
date: 2019-08-26T09:01:23-04:00
updated: true

aliases:
    - /verbose/how-to-set-up-openvpn-on-aws-ec2-and-fix-dns-leaks-on-ubuntu-18.04-lts/
description: A guide for setting up your own private VPN service, and understanding and fixing a DNS leak.
tags:
    - cloud
    - security
    
image: cover.png
showtoc: true
draft: false
categories: ["article"]
---

There's no better way to strive for maximum privacy than a VPN service you control, configure, and maintain yourself. Here's a step-by-step tutorial for [setting up your own OpenVPN on AWS EC2](#set-up-openvpn-on-aws-ec2), and [how to check for and fix DNS leaks](#what-a-dns-leak-looks-like).

For a VPN that also blocks ads and trackers, you can [set up a Pi-hole VPN on an AWS Lightsail instance](/blog/set-up-a-pi-hole-vpn-on-an-aws-lightsail-instance/) instead.

## Set up OpenVPN on AWS EC2

This post will cover how to set up the [OpenVPN Access Server](https://aws.amazon.com/marketplace/pp/B00MI40CAE/) product on AWS Marketplace, running on an [Amazon EC2 instance](https://aws.amazon.com/ec2/). Then, you'll look at how to fix a [known NetworkManager bug in Ubuntu 18.04 that might cause DNS leaks](https://gitlab.gnome.org/GNOME/NetworkManager-openvpn/issues/10). The whole process should take about fifteen minutes, so grab a ☕ and let's be configuration superheroes.

_Note: IDs and IP addresses shown for demonstration in this tutorial are invalid._

### 1. Launch the OpenVPN Access Server on AWS Marketplace

The [OpenVPN Access Server](https://aws.amazon.com/marketplace/pp/B00MI40CAE) is available on AWS Marketplace. The Bring Your Own License (BYOL) model doesn't actually require a license for up to two connected devices; to connect more clients, you can get [bundled billing](https://aws.amazon.com/marketplace/seller-profile/ref=srh_res_product_vendor?ie=UTF8&id=aac3a8a3-2823-483c-b5aa-60022894b89d) for five, ten, or twenty-five clients, or [purchase a minimum of ten OpenVPN licenses a la carte](https://openvpn.net/access-server/pricing/) for $15/device/year. For most of us, the two free connected devices will suffice; and if using an EC2 Micro instance, your set up will be [AWS Free Tier eligible](https://aws.amazon.com/free/) as well.

Start by clicking **Continue to Subscribe** for the [OpenVPN Access Server](https://aws.amazon.com/marketplace/pp/B00MI40CAE), which will bring you to a page that looks like this:

![Subscription details page for OpenVPN Access Server](1-subscribe.jpg#screenshot)

Click **Continue to Configuration**.

![Configure this software page for OpenVPN Access Server](2-configure.jpg#screenshot)

You may notice that the EC2 instance type in the right side bar (and consequently, the Monthly Estimate) isn't the one you want - that's okay, you can change it soon. Just ensure that the **Region** chosen is where you want the instance to be located. Generally, the closer it is to the physical location of your client (your laptop, in this case), the faster your VPN will be. Click **Continue to Launch**.

![Launch this software page](3-launch.jpg#screenshot)

On this page, you'll change three things:

#### 1. The EC2 Instance type

Different types of EC2 (Elastic Compute Cloud) instances will offer you different levels of computing power. If you plan to use your instance for something more than just this VPN, you may want to choose something with higher memory or storage capacity, depending on how you plan to use it. You can view each instance offering on the [Amazon EC2 Instance Types page](https://aws.amazon.com/ec2/instance-types/).

For simple VPN use, the `t2.nano` or `t2.micro` instances are likely sufficient. Only the Micro instance is Free Tier eligible.

#### 2. The Security Group settings

A [Security Group](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html) is a profile, or collection of settings, that Amazon uses to control access to your instance. If you've set up other AWS products before, you may already have some groups with their own rules defined. You should be careful to understand the reasons for your Security Group settings, as these define how public or private your instance is, and consequently, who has access to it.

If you click **Create New Based on Seller Settings**, the OpenVPN server defines some recommended settings for a default Security Group.

![Security group settings](4-security-group.jpg#screenshot)

The default recommended settings are all `0.0.0.0/0` for TCP ports 22, 943, 443, and 945, and UDP port 1194. OpenVPN offers an [explanation of how the ports are used](https://openvpn.net/vpn-server-resources/amazon-web-services-ec2-byol-appliance-quick-start-guide/#Instance_Launch_Options) on their website. With the default settings, all these ports are left open to support various features of the OpenVPN server. You may wish to restrict access to these ports to a specific IP address or block of addresses (like that of your own ISP) to increase the security of your instance. However, if your IP address frequently changes (like when you travel and connect to a different WiFi network), restricting the ports may not be as helpful as you hope.

In any case, your instance will require SSH keys to connect to, and the OpenVPN server will be password protected. Unless you have other specific security goals, it's fine to accept the default settings for now.

Let's give the Security Group a name and brief description, so you know what it's for. Then click **Save**.

#### 3. The Key Pair settings

The aforementioned SSH keys are access credentials that you'll use to connect to your instance. You can [create a key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair) in this section, or you can choose a key pair you may already be using with AWS.

![Key Pair Settings link](5-keys.jpg#screenshot)

To create a new set of access credentials, click **Create a key pair in EC2** to open a new window. Then, click the **Create Key Pair** blue button. Once you give your key pair a name, it will be created and the private key will automatically download to your machine. It's a file ending with the extension `.pem`. Store this key in a secure place on your computer. You'll need to refer to it when you connect to your new EC2 instance.

You can return to the previous window to select the key pair you just created. If it doesn't show up, hit the little "refresh" icon next to the drop-down. Once it's selected, hit the shiny yellow **Launch** button.

You should see a message like this:

![Launch success message](6-launched.jpg#screenshot)

Great stuff! Now that your instance exists, let's make sure you can access it and start up your VPN. For a shortcut to the next step, click on the "EC2 Console" link in the success message.

### 2. Associate an Elastic IP

Amazon's [Elastic IP Addresses](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html) provides you with a public IPv4 address controlled by your account, unlike the public IP address tied to your EC2 instance. It's considered a best practice to create one and associate it with your VPN instance. If anything should go wrong with your instance, or if you want to use a new instance for your VPN in the future, the Elastic IP can be disassociated from the current instance and reassociated with your new one. This makes the transition seamless for your connected clients. Think of the Elastic IP like a web domain address that you register - you can point it at whatever you choose.

We can create a new Elastic IP address on the Amazon EC2 Console. If you clicked the link from the success message above, we're already there.

![EC2 console](7-ec2.jpg#screenshot)

If you have more than one instance, take note of the Instance ID of the one you've just launched.

In the left sidebar under **Network & Security**, choose **Elastic IPs**. Then click the blue **Allocate new address** button.

![Allocate new address page](8-elasticip.jpg#screenshot)

Choose **Amazon Pool,** then click **Allocate**.

![Allocate elastic IP success message](9-elasticip.jpg#screenshot)

Success! Click **Close** to return to the Elastic IP console.

![Associate elastic IP](10-associateip.jpg#screenshot)

Now that you have an Elastic IP, let's associate it with your instance. Select the IP address, then click **Actions,** and choose **Associate address**.

![Associate elastic IP with instance](11-associateip.jpg#screenshot)

Ensure the **Instance** option is selected, then click the drop-down menu. You should see your EC2 instance ID there. Select it, then click **Associate**.

![Associate elastic IP success message](12-associateip.jpg#screenshot)

Success! Now that you'll be able to access your VPN instance, let's get your VPN service up and running.

### 3. Initialize OpenVPN on the EC2 server

First, you'll need to connect to the EC2 instance via your terminal. You'll use the private key you created earlier.

Open a new terminal window and navigate to the directory containing the private key `.pem` file. You'll need to set its permissions with:

```sh
sudo chmod 400 <name>.pem
```

Be sure to substitute `<name>` with the name of your key.

This sets the file permissions to `-r--------` so that it can only be read by the user (you). It may help to protect the private key from read and write operations by other users, but more importantly, will prevent AWS from throwing an error when you try to connect to your instance.

We can now do just that by running:

```sh
ssh -i <name>.pem openvpnas@<elastic ip>
```

The user `openvpnas` is set up by the OpenVPN Access Server to allow you to connect to your instance. Replace `<elastic ip>` with the Elastic IP address you just associated.

We may get a message saying that the authenticity of your host can't be established. As long as you've typed the Elastic IP correctly, go ahead and answer **yes** to the prompt.

Upon the initial connection to the OpenVPN instance, a set up wizard called **Initial Configuration Tool** should automatically run. (If, for some reason, it doesn't, or you panic-mashed a button, you can restart it with `sudo ovpn-init –ec2`.) You'll be asked to accept the agreement, then the wizard will help to walk you through some configuration settings for your VPN server.

You may generally accept the default settings, however, there are a couple questions you may like to answer knowledgeably. They are:

__Should client traffic be routed by default through the VPN?__

__Should client DNS traffic be routed by default through the VPN?__

These answers depend on your privacy goals for your VPN.

When asked for your **OpenVPN-AS license key**, you can leave it blank to use the VPN with up to two clients. If you've purchased a key, enter it here.

Once the configuration wizard finishes running, you should see the message "Initial Configuration Complete!" Before you move on, you should set a password for your server's administration account. To do this, run:

```sh
sudo passwd openvpn
```

Then enter your chosen password twice. Now we're ready to get connected!

To close the SSH connection, type `exit`.

### 4. Connect the client to the VPN

To connect your client (in this case, your laptop) to the VPN and start reaping the benefits, you'll need to do two things; first, obtain your connection profile; second, install the `openvpn` daemon.

#### 1. Get your `.ovpn` connection profile

You'll need to download a connection profile; this is like a personal configuration file with information, including keys, that the VPN server will need to allow your connection. You can do this by logging in with the password you just set at your Elastic IP address, port 943. This looks like:

```sh
https://<elastic ip>:943/
```

The `https` part is important; without it, the instance won't send any data.

When you go to this URL, you may see a page warning you that this site's certificate issuer is unknown or invalid. As long as you've typed your Elastic IP correctly, it's safe to proceed. If you're using Firefox, click **Advanced**, and then **Accept the Risk and Continue**. In Chrome, click **Advanced**, then **Proceed** to the elastic IP.

![Security warning page](13-warning.jpg#screenshot)

Log in with the username `openvpn` and the password you just set. You'll now be presented with a link to download your user-locked connection profile:

![Connection profile download page](14-profile.jpg#screenshot)

When you click the link, a file named `client.ovpn` will download.

#### 2. Install and start `openvpn` on your Ubuntu 18.04 client

The `openvpn` daemon will allow your client to connect to your VPN server. It can be installed through the default Ubuntu repositories. Run:

```sh
sudo apt install openvpn
```

In order for OpenVPN to automatically start when you boot up your computer, you'll need to rename and move the connection profile file. I suggest using a [symlink](https://en.wikipedia.org/wiki/Symbolic_link) to accomplish this, as it leaves your original file more easily accessible for editing, and allows you to store it in any directory you choose. You can create a symlink by running this command in the directory where your file is located:

```sh
sudo ln -s client.ovpn /etc/openvpn/<name>.conf
```

This creates a symbolic link for the connection profile in the appropriate folder for `systemd` to find it. The `<name>` can be anything. When the Linux kernel has booted, `systemd` is used to initialize the services and daemons that the user has set up to run; one of these will now be OpenVPN. Renaming the file with the extension `.conf` will let the `openvpn` daemon know to use it as your connection file.

For now, you can manually start and connect to OpenVPN by running:

```sh
sudo openvpn --config client.ovpn
```

You'll be asked for a username and password, which will be the same credentials you used before. Once the service finishes starting up, you'll see "Initialization Sequence Complete." If you now visit [the DNS leak test website](https://www.dnsleaktest.com/), you should see the Elastic IP and the location of your EC2 server. Yay!

If you're on a later version of Ubuntu, you may check for DNS leaks by clicking on one of the test buttons. If all the ISPs shown are Amazon and none are your own service provider's, congratulations! No leaks! You can move on to [Step 3 in the second section](#3-set-up-openvpn-as-networkmanager-system-connection) below, after which, you'll be finished.

If you're using Ubuntu 18.04 LTS, however, we're not yet done.

## What a DNS leak looks like

Sites like [the DNS leak test website](https://dnsleaktest.com/) can help you check your configuration and see if the Internet knows more about your location than you'd like. On the main page you'll see a big hello, your IP address, and your location, so far as can be determined.

If you have a DNS leak, you can see what it looks like by clicking on one of the test buttons on the [the DNS leak test page](https://www.dnsleaktest.com/). When you do, you'll see not only your Amazon.com IP addresses, but also your own ISP and location.

You can also see the leak by running `systemd-resolve --status` in your terminal. Your results will contain two lines under different interfaces that both have entries for DNS Servers. It'll look something like this:

```sh
Link 7 (tun0)
      Current Scopes: DNS
       LLMNR setting: yes
MulticastDNS setting: no
      DNSSEC setting: no
    DNSSEC supported: no
         DNS Servers: 172.31.0.2
          DNS Domain: ~.

Link 3 (wlp4s0)
      Current Scopes: none
       LLMNR setting: yes
MulticastDNS setting: no
      DNSSEC setting: no
    DNSSEC supported: no
         DNS Servers: 192.168.0.1
          DNS Domain: ~.
```

The [DNS leak problem in Ubuntu 18.04](https://unix.stackexchange.com/questions/434916/how-to-fix-openvpn-dns-leak) stems from Ubuntu's DNS resolver, `systemd-resolved`, failing to properly handle your OpenVPN configuration. In order to try and be a good, efficient DNS resolver, `systemd-resolved` will send DNS lookup requests in parallel to each interface that has a DNS server configuration, and then utilizes the fastest response. In your case, you only want to use your VPN's DNS servers. Sorry, `systemd-resolved`. You tried.

## How to fix OpenVPN DNS leak on Ubuntu 18.04

Luckily, there is a fix that you can implement. You'll need to install a few helpers from the Ubuntu repositories, update your configuration file, then set up OpenVPN using NetworkManager. Let's do it!

### 1. Install some helpers

To properly integrate OpenVPN with `systemd-resolved`, you'll need a bit more help. In a terminal, run:

```sh
sudo apt install -y openvpn-systemd-resolved network-manager-openvpn network-manager-openvpn-gnome
```

This will install a helper script that integrates OpenVPN and `systemd-resolved`, a NetworkManager plugin for OpenVPN, and its GUI counterpart for GNOME desktop environment.

### 2. Add DNS implementation to your connection profile

You'll need to edit the connection profile file you downloaded earlier. Since it's symbolically linked, you can accomplish this by changing the `.ovpn` file, wherever it's stored. Run `vim <name>.ovpn` to open it in Vim, then add the following lines at the bottom. Explanation in the comments:

```sh
# Allow OpenVPN to call user-defined scripts
script-security 2
# Tell systemd-resolved to send all DNS queries over the VPN
dhcp-option DOMAIN-ROUTE .

# Use the update-systemd-resolved script when TUN/TAP device is opened,
# and also run the script on restarts and before the TUN/TAP device is closed
up /etc/openvpn/update-systemd-resolved
up-restart
down /etc/openvpn/update-systemd-resolved
down-pre
```

For the full list of OpenVPN options, see [OpenVPN Scripting and Environment Variables](https://openvpn.net/community-resources/reference-manual-for-openvpn-2-1/). You may also like [more information about TUN/TAP](https://en.wikipedia.org/wiki/TUN/TAP).

### 3. Set up OpenVPN as NetworkManager system connection

Use the GUI to set up your VPN with NetworkManager. Open up Network Settings, which should look something like this:

![Network Settings window on Ubuntu 18.04](15-networksettings.png#screenshot)

Then click the plus sign (**+**) button. On the window that pops up, counterintuitively, choose **Import from file...** instead of the OpenVPN option.

![Add VPN window](16-importvpn.jpg#screenshot)

Navigate to, and then select, your `.ovpn` file. You should now see something like this:

![The filled VPN connection settings](17-vpnsettings.png#screenshot)

Add your username and password for the server (`openvpn` and the password you set in [the first section's Step 3](#3-initialize-openvpn-on-the-ec2-server)), and your user key password (the same one again, if you've followed this tutorial), then click the "Add" button.

### 4. Edit your OpenVPN NetworkManager configuration

Nearly there! Now that you've added the VPN as a NetworkManager connection, you'll need to make a quick change to it. You can see a list of NetworkManager connections by running:

```sh
ls -la /etc/NetworkManager/system-connections/*
```

The one for your VPN is probably called `openvpn`, so let's edit it by running:

```sh
sudo vim /etc/NetworkManager/system-connections/openvpn
```

Under `[ipv4]`, you'll need to add the line `dns-priority=-42`. It should end up looking like this:

![Connection settings for ipv4](18-connsettings.jpg#screenshot)

Setting a negative number is a workaround that prioritizes this DNS server. The actual number is arbitrary (`-1` should also work) but I like 42. ¯\\\_(ツ)\_/¯

### 5. Restart, connect, profit

In a terminal, run:

```sh
sudo service network-manager restart
```

Then in the Network Settings, click the magic button that turns on the VPN:

![Network Settings window](19-vpnon.jpg#screenshot)

Finally, visit [the DNS leak test website](https://www.dnsleaktest.com/) and click on **Extended test** to verify the fix. If everything's working properly, you should now see a list containing only your VPN ISP.

![Successful DNS leak test results](20-noleaks.png#screenshot)

And we're done! Congratulations on rolling your very own VPN server and stopping DNS leaks with OpenVPN. Enjoy surfing in (relative) privacy. Now your only worry at the local coffeeshop is who's watching you surf from the seat behind you.

If you enjoyed this post, there's a lot more where it came from! I write about computing, cybersecurity, and leading great technical teams. You can subscribe below to see new posts first.

{{< subscribe >}}
