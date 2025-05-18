---
title: Set up a Pi-hole VPN on an AWS Lightsail instance
date: 2021-10-07T11:01:13Z

aliases: /blog/vpn
description: Build your own VPN with Pi-hole to block ads and trackers.
series:
tags:
    - privacy
    - aws
    - cybersecurity
    - open-source
 
draft: false
---

I've written a fair bit in the past about the [whys of online privacy](/tags/privacy), and [a lot about staying safe online](/tags/cybersecurity). Chances are, if a search brought you here, you're well-past why. Let's go straight on to how.

This guide will walk you through setting up [Pi-hole](https://pi-hole.net/) on an [AWS Lightsail](https://aws.amazon.com/lightsail/) instance that acts as your VPN thanks to [OpenVPN](https://openvpn.net/). It's a more succinct version of the [official Pi-hole docs for OpenVPN](https://docs.pi-hole.net/guides/vpn/openvpn/overview/), made specifically for Lightsail with a few tips and tricks added in, because you deserve it.

## Create and connect to a Lightsail instance

1. Log in or sign up to AWS and [create a Lightsail Instance](https://lightsail.aws.amazon.com/ls/webapp/home/instances).
2. Under **Select a platform**, choose **Linux/Unix**.
3. Under **Select a blueprint**, choose the **OS Only** button.
4. Select the latest [officially supported Ubuntu server](https://docs.pi-hole.net/main/prerequisites/#supported-operating-systems).
5. You can save a tidbit of effort by putting the following into the **Launch script** box:

    ```sh
    # Update installed packages
    sudo apt-get update
    sudo apt-get upgrade -y
    ```

6. Create a new SSH key for this server and ensure you download the `.pem`.
7. Choose your plan. The $3.50 USD instance is sufficient.
8. Give it a name then click **Create instance**.
9. Stare eagerly at the page until the instance status is **Running**, then go to the **Networking** tab.
10. Create a [Static IP](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/understanding-static-ip-addresses-in-amazon-lightsail) and attach it to your new instance. Remember that static IP addresses are free only while attached to an instance.
11. Click on your instance name to return to its dashboard. Go back to the **Networking** tab. It'll look a bit different now.
12. Under **IPv6 networking**, click the toggle to turn it off (unless you know what you are doing and you want IPv6 for some reason. Most of y'all don't need it).
13. Under **IPv4 Firewall**, delete the rule for `HTTP`.
14. Click **Add rule**. In the **Application** dropdown, choose **Custom**.
    - For **Protocol**, choose **UDP**.
    - In the **Port or range** input, enter a UDP port for the OpenVPN server to run on. (It's typically `1194`, which you can choose to use, but you might like a different number for security purposes. Port range is `0-65535`.)
15. Connect using SSH and your new key pair, either [in your terminal](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/amazon-lightsail-ssh-using-terminal) or on the **Connect** tab with the [browser-based client](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/lightsail-how-to-connect-to-your-instance-virtual-private-server).

## Install OpenVPN on your server

After connecting to your server using SSH, install OpenVPN on your server.

```sh
# Download OpenVPN
wget https://git.io/vpn -O openvpn-install.sh
chmod 755 openvpn-install.sh
sudo ./openvpn-install.sh
```

You'll see:

```txt
Welcome to this OpenVPN road warrior installer!

This server is behind NAT. What is the public IPv4 address or hostname?
Public IPv4 address / hostname [x.xx.xxx.xxx]:
```

...where the default option is your static IP that you set up earlier. Hit return to accept this. Then:

```txt
Which protocol should OpenVPN use?
    1) UDP (recommended)
    2) TCP
Protocol [1]: 1
```

Choose `1` or hit return. Then:

```txt
What port should OpenVPN listen to?
Port [1194]: #####
```

Enter the UDP port number you chose earlier. Then:

```txt
Select a DNS server for the clients:
    1) Current system resolvers
    2) Google
    3) 1.1.1.1
    4) OpenDNS
    5) Quad9
    6) AdGuard
DNS server [1]: 1
```

Choose `1` or hit return. Then:

```txt
Enter a name for the first client:
Name [client]: pihole
```

The Pi-hole will be the client. Name it as you like then `Press any key to continue...`

OpenVPN will set itself up. Confirm that `tun0` has the interface address `10.8.0.1/24` with the following command:

```sh
ip addr show tun0
```

This ensures that the Pi-hole will be set up properly. Now, about that:

## Install and configure Pi-hole

On your Lightsail instance, install Pi-hole.

```sh
# Download and install Pi-hole
curl -sSL https://install.pi-hole.net | bash
```

This runs the Pi-hole automated installer. You'll see some prompts which you can answer using the enter key, arrow keys, tab, and space bar for selecting an option.

The important things:

1. When you see **Choose An Interface**, ensure you pick `tun0`. It isn't the default selection.
2. You'll need to set the **IPv4 address** to the interface address you viewed previously using the `ip addr` command: `10.8.0.1/24`. This ensures the Pi-hole uses the VPN.

> *At time of writing,* the second item above wasn't presented as an option in the automated installer. After the Pi-hole installer finishes, manually change the IP address by editing the configuration file:
>
> `> sudo vim /etc/pihole/setupVars.conf`
>
> Change the `IPV4_ADDRESS` to `10.8.0.1/24` and save the file. Restart the Pi-hole with: `pihole restartdns`.

If you mess up, you can redo the configuration with `pihole reconfigure`.

Finally, you'll configure the VPN to use the Pi-hole.

## Configure OpenVPN

Confirm the address of the `tun0` interface with:

```sh
ip a | grep -C 1 'tun0'
```

You should see: `inet 10.8.0.1/24` in there.

Edit the OpenVPN config file with:

```sh
sudo vim /etc/openvpn/server/server.conf
```

Change the line that starts with `push "dhcp-option`... to use the Pi-hole's IP address that you confirmed above:

```vim
push "dhcp-option DNS 10.8.0.1"
```

If any other lines start with `push "dhcp-option`..., comment those out.

If you want to log OpenVPN traffic, add these lines to the end of the file:

```vim
log /var/log/openvpn.log
verb 3
```

Save the config. If you forgot to open Vim with `sudo`, use the `tee` trick: `:w !sudo tee %`, then `O`, then `:q!`.

Restart OpenVPN with `sudo systemctl restart openvpn-server@server`.

### Configure firewall

Run the following to control traffic to the server [as described here](https://docs.pi-hole.net/guides/vpn/openvpn/firewall/).

```sh
sudo iptables -I INPUT -i tun0 -j ACCEPT
sudo iptables -A INPUT -i tun0 -p tcp --destination-port 53 -j ACCEPT
sudo iptables -A INPUT -i tun0 -p udp --destination-port 53 -j ACCEPT
sudo iptables -A INPUT -i tun0 -p tcp --destination-port 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --destination-port 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --destination-port 1194 -j ACCEPT
sudo iptables -A INPUT -p udp --destination-port 1194 -j ACCEPT
sudo iptables -I INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
sudo iptables -I INPUT -i lo -j ACCEPT
sudo iptables -P INPUT DROP

# Optionally, also block HTTPS advertisements while you're here.
sudo iptables -A INPUT -p udp --dport 80 -j REJECT --reject-with icmp-port-unreachable
sudo iptables -A INPUT -p tcp --dport 443 -j REJECT --reject-with tcp-reset
sudo iptables -A INPUT -p udp --dport 443 -j REJECT --reject-with icmp-port-unreachable
```

You can review the results with `sudo iptables -L --line-numbers`.

**These are only stored in memory** before you save them, so test out your set up on your client now to see if it all works as expected.

### Test your client connection

To test your configuration, try adding a client (the phone or computer that will connect to the VPN).

1. Run the OpenVPN script again: `sudo ./openvpn-install.sh` and choose **1) Add a new client**. Give it a name; you may find it helps to name it by the device, e.g. "phone". This creates a file that ends in `.ovpn`. You need to place this file on your client to use it.
2. Install the appropriate [OpenVPN app](https://duckduckgo.com/?q=OpenVPN+App) for your device.
3. Transfer the `.ovpn` file you just obtained to the device if you haven't already. (See [future tasks](#future-tasks) for a way to copy the file to your host machine.) Follow instructions in your app (try under **FAQ**) for importing the `.ovpn` file and activating the VPN.
4. Ensure it seems to connect properly. If you [go to DuckDuckGo.com and search for "What's my IP"](https://duckduckgo.com/?t=ffab&q=what's+my+ip), you should see the location of your Lightsail instance. For a more in-depth test, [check for DNS leaks at BrowserLeaks.com](https://browserleaks.com/ip).

Try browsing for a while. You can also view the Pi-hole dashboard by visiting `http://pi.hole/admin/` on this device.

If everything seems all right, go on to saving the configuration on your instance.

### Save `iptables`

Save the `iptables` you created earlier using the `tee` command to achieve the second permission.

```sh
sudo iptables-save | sudo tee /etc/pihole/rules.v4
```

You're finished with configuration on your Lightsail instance. If you wish to disconnect now, you can just type `exit`.

## Future tasks

You're done with the set up! You now have your very own personal VPN with a Pi-hole keeping you safe from nasty trackers. Here are some references for operations you might like to come back to in the future:

- Reconnect to your Lightsail instance with SSH:
  - `ssh -i /path/to/private-key.pem ubuntu@public-ip-address`
- Set a password for the web interface dashboard:
  - `pihole -a -p`
- Access the web interface dashboard:
  - Connect to the VPN, then visit `http://pi.hole/admin/`
- Update the Pi-hole:
  - `pihole -up`
- Add a new client ([for iOS, Linux, or Windows](https://docs.pi-hole.net/guides/vpn/openvpn/clients/), or [for Android](https://docs.pi-hole.net/guides/vpn/openvpn/android-client/))
- Copy the `.ovpn` file for a client to your host machine (run on the host machine):
  - `ssh -i /path/to/private-key.pem ubuntu@public-ip-address 'sudo cat /path/on/lightsail/client.ovpn' > /path/on/host/client.ovpn`
- Beef up that block list! Here's my favorite resource for updating your Pi-hole [adlist table](https://docs.pi-hole.net/database/gravity/#adlist-table-adlist): [The Big Blocklist Collection](https://firebog.net/)

Enjoy your new, more secure and peaceful Internet! If you found this guide helpful, please share it with someone else.
