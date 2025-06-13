---
title: Create a self-hosted chat service with your own Matrix server
date: 2021-02-15T01:38:07-05:00

aliases:
    - /blog/create-a-self-hosted-chat-service-with-your-own-matrix-server/
description: A speed-run introduction to Matrix via Dendrite.
tags:
    - privacy
    - protocols
    - linux
    - aws
    - go
    - terminal
 
draft: false
categories: ["article"]
---

[Matrix](https://matrix.org/docs/guides/introduction) is an open standard for decentralized real-time communication. The [specification](https://matrix.org/docs/spec/) is production-ready and [bridges](https://matrix.org/bridges/) to tons of silo products like Slack, Gitter, Telegram, Discord, and even Facebook Messenger. This lets you use Matrix to link together disjoint communities in one place, or create an alternative communication method that works with, but is independent of, communication silos.

You can create your own self-hosted Matrix chat for as little as $3.50 USD per month on an [AWS Lightsail](https://aws.amazon.com/lightsail/) instance. Your homeserver can federate with other Matrix servers, giving you a reliable and fault-tolerant means of communication.

Matrix is most widely installed via its [Synapse](https://element-hq.github.io/synapse/latest/index.html) homeserver implementation written in Python 3. Dendrite, its second-generation homeserver implementation written in Go, is currently released in beta. Dendrite will provide more memory efficiency and reliability out-of-the-box, making it an excellent choice for running on a virtual instance.

Here's how to set up your own homeserver on AWS Lightsail with Dendrite. You can also [contribute to Dendrite today](https://github.com/matrix-org/dendrite).

## Create a Lightsail instance

Spin up a new Lightsail instance on AWS with Debian as your operating system. It's a good idea to create a new per-instance key for use with SSH. You can do this by with the SSH key pair manager on the instance creation page. Don't forget to download your private key and `.gitignore` your secrets.

Click **Create Instance.** Wait for the status of your instance to change from **Pending** to **Running**, then click its name to see further information. You'll need the Public IP address.

To enable people including yourself to connect to the instance, go to the Networking tab and add a firewall rule for HTTPS. This will open `443` so you can connect over IPv4. You can also do this for IPv6.

## Connect DNS

Give your instance a catchier address by {{< namecheap text="buying a domain at Namecheap" >}} and setting up DNS records.

1. On your domain management page in the **Nameservers** section, choose **Namecheap BasicDNS**.
2. On the **Advanced DNS** tab, click **Add New Record**.

Add an `A Record` to your Lightsail Public IP. You can use a subdomain if you want one, for example,

- **Type:** `A Record`
- **Host:** `matrix`
- **Value:** `13.59.251.229`

This points `matrix.example.org` to your Lightsail instance.

## Set up your Matrix homeserver

Change permissions on the private key you downloaded:

```sh
chmod 600 <path/to/key>
```

Then [SSH to your Public IP](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/amazon-lightsail-ssh-using-terminal):

```sh
ssh -i <path/to/key> admin@<public ip>
```

Welcome to your instance! You can make it more interesting by downloading some packages you'll need for Dendrite. It's a good idea to use `apt` for this, but first you'll want to make sure you're getting the latest stuff.

*Dec 2021 update: As the good people of Mastodon point out, you might like to ensure you're choosing the stable version for Debian. For instance, replace `buster` below with [what's "stable" at the moment](https://www.debian.org/releases/).*

Change your [sources list](https://wiki.debian.org/SourcesList) in order to get the newest version of Go:

```sh
sudo vim /etc/apt/sources.list
```

Delete everything except these two lines:

```vim
deb http://cdn-aws.deb.debian.org/debian buster main
deb-src http://cdn-aws.deb.debian.org/debian buster main
```

Then replace the distributions:

```vim
:%s/buster main/testing main contrib non-free/g
```

Run `sudo apt dist-upgrade`. If you're asked about modified configuration files, choose the option to "keep the local version currently installed."

Once the upgrade is finished, restart your instance with `sudo shutdown -r now`.

Go make some coffee, then SSH back in. Get the packages you'll need with:

```sh
sudo apt update
sudo apt upgrade
sudo apt install -y git golang nginx python3-certbot-nginx
```

You're ready to get Dendrite.

## Get Dendrite

Clone [Dendrite](https://github.com/matrix-org/dendrite) and follow the [README instructions to get started](https://github.com/matrix-org/dendrite#get-started). You'll need to choose whether you want your Matrix instance to be federating. For simplicity, here's how to set up a non-federating deployment to start:

```sh
git clone https://github.com/matrix-org/dendrite
cd dendrite
./build.sh

# Generate a Matrix signing key for federation (required)
./bin/generate-keys --private-key matrix_key.pem

# Generate a self-signed certificate (optional, but a valid TLS certificate is normally
# needed for Matrix federation/clients to work properly!)
./bin/generate-keys --tls-cert server.crt --tls-key server.key

# Copy and modify the config file - you'll need to set a server name and paths to the keys
# at the very least, along with setting up the database connection strings.
cp dendrite-config.yaml dendrite.yaml
```

## Configure Dendrite

Modify the configuration file you just copied:

```sh
sudo vim dendrite.yaml
```

At minimum, set:

- `server name` to your shiny new domain name, e.g. `matrix.example.org`
- `disable_federation` to true or false
- `registration_disabled` to true or false

You might like to read the [Dendrite FAQ](https://github.com/matrix-org/dendrite/blob/master/docs/FAQ.md).

## Configure nginx

Get the required packages if you didn't already install them above:

```sh
sudo apt install nginx python3-certbot-nginx
```

Create your site's configuration file under `sites-available` with:

```sh
cd /etc/nginx/sites-available
ln -s /etc/nginx/sites-available/<sitename> /etc/nginx/sites-enabled/<sitename>
sudo cp default <sitename>
```

Edit your site configuration. Delete the `root` and `index` lines if you don't need them, and input your server name.

Your `location` block should look like:

```nginx
location / {
    proxy_pass https://localhost:8448;
}
```

Remove the `default` with: `sudo rm /etc/nginx/sites-enabled/default`.

## Create self-signed certificates

You can use [Certbot](https://certbot.eff.org/) to generate self-signed certificates with [Let's Encrypt](https://letsencrypt.org/).

```sh
sudo certbot --nginx -d <your.site.address>
```

If you don't want to give an email, add the `--register-unsafely-without-email` flag.

Test your configuration and restart nginx with:

```sh
sudo nginx -t
sudo systemctl restart nginx
```

Then start up your Matrix server.

```sh
# Build and run the server:
./bin/dendrite-monolith-server --tls-cert server.crt --tls-key server.key --config dendrite.yaml
```

Your Matrix server is up and running at your web address! If you disabled registration in your configuration, you may need to create a user. You can do this by running the included `dendrite/bin/createuser`.

You can log on to your new homeserver with any [Matrix client](https://matrix.org/clients/), or Matrix-capable applications like [Pidgin with the Matrix plugin](https://www.pidgin.im/plugins/?publisher=all&query=&type=).

## Other troubleshooting

### Log files

If you get an error such as:

```text
... [github.com/matrix-org/dendrite/internal/log.go:155] setupFileHook
  Couldn't create directory /var/log/dendrite: "mkdir /var/log/dendrite: permission denied"
```

You'll need to create a spot for your log files. Avoid the bad practice of running stuff with `sudo` whenever you can. Instead, create the necessary file with the right permissions:

```sh
sudo mkdir /var/log/dendrite
sudo chown admin:admin /var/log/dendrite

# Build and run the server:
./bin/dendrite-monolith-server --tls-cert server.crt --tls-key server.key --config dendrite.yaml
```

### Unable to decrypt

If you see: `Unable to decrypt: The sender's device has not sent us the keys for this message.` you may need to verify a user (sometimes yourself).

1. In your client, open the user's profile. Click the lock icon if there is one, or otherwise look for a way to verify them.
1. You may be asked to see if some emojis presented to both users match if you're using certain clients like Element.
1. You can then re-request encryption keys for any sent messages.

## Set up your own Matrix server today

I hope you found this introduction to setting up your own Matrix homeserver to be helpful!
