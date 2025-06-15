---
title: The care and feeding of an IoT device
date: 2019-11-27T08:59:35-05:00

aliases:
description: Why IoT devices are, basically, puppies, and whether or not you should give somebody one for Christmas.
series:
    - security-for-developers
tags:
    - security
    - privacy
    
image: cover.png
 
draft: false
categories: ["article"]
---

Giving someone a puppy for Christmas might work really well in a movie, but in real life often comes hitched to a multitude of responsibilities that the giftee may not be fully prepared to take on. The same is true for Internet of Things (IoT) devices, including Amazon's Alexa-enabled devices, Google Home, and other Internet-connected appliances like cameras, lightbulbs, and toasters. Yes, they have those now.

Like puppies, IoT devices are still young. Many contain [known vulnerabilities](https://threatpost.com/iot-devices-vulnerable-takeover/144167/) that remote attackers can use to gain access to device owners' networks. These attacks are sometimes as laughably simple as using a default username and password that the [device owner cannot change](https://gdpr.report/news/2019/06/12/research-reveals-the-most-vulnerable-iot-devices/).

Does all this mean you shouldn't give Grandma Mabel a new app-enabled coffee maker or Ring doorbell for Christmas? Probably, although not necessarily. Like puppies, properly-maintained IoT devices are capable of warming your heart without causing _too_ much havoc; but they take a lot of work to care for. Here are a few responsibilities to keep in mind for the care and feeding of an IoT device.

## Immature security

Many manufacturers of IoT devices have not made security a priority. There aren't yet any enforced [security requirements](https://blog.rapid7.com/2019/03/27/the-iot-cybersecurity-improvement-act-of-2019/) for this industry, which leaves the protection of your device and the network it's connected to in the hands of the manufacturer.

It's not just obscure no-name toasters, either; malicious third-party apps have snuck onto Amazon's and Google's more reputable devices and enabled attackers to [eavesdrop](https://www.cnet.com/news/alexa-and-google-voice-assistants-app-exploits-left-it-vulnerable-to-eavesdropping/) on unsuspecting owners.

Until security regulations are put in place and enforced, it's buyer beware for both devices and third-party applications. To the extent possible, potential owners must do ample research to weed out vulnerable devices and untrustworthy apps.

## Protecting your network

If you think hackers aren't likely to find your device in the vast expanse of the Internet, you might be wrong. These days, obscurity doesn't provide security. It's no longer left up to a potential attacker's fallible human eyes to find your insecure front door camera in a cacophony of wireless traffic; [IoT search engines](https://money.cnn.com/2013/04/08/technology/security/shodan/index.html) like [Shodan](https://www.shodan.io/) will do that for them. Thankfully, these search engines are also used for good, enabling white hat hackers and penetration testers to find and fix insecure devices.

Just like locking your own front door, IoT owners are responsible for locking down access to their devices. This may mean searching through device settings to make sure default credentials are changed, or checking to make sure that a device used on your private home network doesn't by default have public Internet access.

Where the options are available, HTTPS and multifactor authentication should be enabled. The use of a VPN can also keep your devices from being found.

## Keeping them patched

Unlike puppies, many IoT devices are "headless" and have no inherent way of interfacing with a human. An app-controlled lightbulb, for example, may be all but useless without the software that makes it shine. As convenient as it may be to have your 1500K mood lighting come on automatically at dusk, it also means automatically ceding control of the device to its software developers.

When vulnerabilities in your phone's operating system are discovered and patched, it's likely that automatic updates are pushed and installed overnight, possibly without you even knowing. Your IoT device, on the other hand, may have no such support. In those cases, it's completely up to the user to discover that an update is needed, find and download the patch, then correctly update their device. Even for owners with some technical expertise, this process takes significant effort. Many [device owners aren't even aware](https://www.machinedesign.com/industrial-automation/software-updates-are-new-hurdle-iot-security) that their software is dangerously outdated.

In practical terms, this means that users without the time, knowledge, or willingness to keep their devices updated should reconsider owning them. Alternatively, some research can help prospective owners choose devices that receive automatic push updates from their (hopefully responsible) manufacturers over WiFi.

## Being responsible

Raising a healthy and happy IoT device is no small task, especially for potential owners with little time or willingness to put in the required effort. With the proper attention and maintenance, your Internet-connected appliance can bring joy and convenience to your life; but without, it introduces a potential security risk and a whole lot of trouble.

Before getting or giving IoT, be sure the potential owner is up to the task of caring for it.

You can learn more about basic cybersecurity for IoT (as a user or maker) by reading [NIST's draft guidelines publication](https://csrc.nist.gov/publications/detail/nistir/8259/draft).
