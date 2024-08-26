---
title: "Digital resilience: redundancy for websites and communications"
date: 2021-02-22T04:00:43-05:00

aliases:
    - /archive/digital-resilience-redundancy-for-websites-and-communications/
description: How you can make your digital life more resilient when using services you don't own.
tags:
    - privacy
    - cybersecurity
    - data
    - life
    - websites
noToc: true
draft: false
categories: ["article"]
---

When what seems like half the planet noped out of WhatsApp after its terms of service update, applications like [Signal](https://signal.org/download/) (which I highly recommend) saw an unprecedented increase in user traffic. Signal had so many new users sign up that it overwhelmed their existing infrastructure and lead to a 24-hour-ish outage.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Signal is experiencing technical difficulties. We are working hard to restore service as quickly as possible.</p>&mdash; Signal (@signalapp) <a href="https://twitter.com/signalapp/status/1350118809860886528?ref_src=twsrc%5Etfw">January 15, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The small team responded impressively quickly, especially given that a [4,200% spike](https://www.businessinsider.com/whatsapp-facebook-data-signal-download-telegram-encrypted-messaging-2021-1) in new users was utterly implausible before it occurred.

The downside of so many people moving onto this fantastic application is that it caused a brief outage. If you rely solely on a certain application for your communications, brief outages can be debilitating. Even when it seems implausible that your favorite chat, email, or website service could just -- *poof* -- vanish overnight, recent events have proved it isn't impossible.

Have a backup plan. Have several. Here's how you can improve your digital resiliency for things like websites, messaging, and email.

## Messaging

I recommend Signal because it is open source, end-to-end encrypted, cross-platform, and offers text, voice, video, and group chat. It's usually very reliable; however, strange things can happen.

It's important to set up a backup plan ahead of any service outages with the people you communicate with the most. Have an agreement for a secondary method of messaging -- ideally another end-to-end encrypted service. Avoid falling back on insecure communications like SMS and social media messaging. Here's a short list for you to explore:

- [Signal](https://signal.org/)
- [Wire](https://wire.com/)
- [Session](https://getsession.org/)

If you're particularly technically inclined, you can [set up your own self-hosted chat service with Matrix](/blog/create-a-self-hosted-chat-service-with-your-own-matrix-server/).

Having a go-to plan B can help bring peace of mind and ensure you're still able to communicate when strange things happen.

## Cloud contacts

Do you know the phone numbers of your closest contacts? While memorizing them might not be practical, storing them solely online is an unnecessary risk. Most services allow you to export your contacts to vCard or CSV format.

I recommend keeping your contacts locally on your device whenever you can. This ensures you still know how to contact people if your cloud provider is unavailable, or if you don't have Internet access.

Full analog redundancy is also possible here. Remember that paper stuff? Write down the phone numbers of your most important contacts so you can access them if your devices run out of battery or otherwise can't turn on (drop your phone much?).

## Local email synchronization

If your email service exists solely online, there's a big email-shaped hole in your life. If you can't log in to your email for any reason -- an outage on their end, a billing error, or your Internet is down -- you'll have no way to access your messages for however long your exile lasts. If you think about all the things you do via email in a day, I think the appropriate reaction to not having local copies is 🤦.

Download an open source email client like [Thunderbird](https://www.thunderbird.net/). Follow [instructions to install Thunderbird](https://support.mozilla.org/en-US/products/thunderbird/download-install-and-migration) and set it up with your existing online email service. Your online service provider may have a help document that shows you how to set up Thunderbird.

You can maximize your privacy by [turning off Thunderbird's telemetry](https://support.mozilla.org/kb/thunderbird-telemetry).

To ensure that Thunderbird downloads your email messages and stores them locally on your machine:

1. Click the "hamburger" overflow menu and go to **Account Settings**
2. Choose **Synchronization & Storage** in the sidebar
3. Ensure that under **Message Synchronizing,** the checkbox for **Keep messages in all folders for this account on this computer** is checked.

You may need to visit each of your folders in order to trigger the initial download.

Some other settings you may want to update:

1. Choose **Composition & Addressing** and uncheck the box next to **Compose messages in HTML format** to send plaintext emails instead.
2. Under **Return Receipts** choose **Global Preferences.** Select the radio button for **Never send a return receipt.**

You don't need to start using Thunderbird for all your email tasks. Just make sure you open it up regularly so that your messages sync and download to your machine.

## Websites

I strongly believe you should have [your own independent website](/posts/make-your-own-independent-website/) for reasons that go beyond redundancy. To truly make your site resilient, it's important to have your own domain.

If you know that my website is at the address `victoria.dev`, for example, it doesn't matter whether I'm hosting it on GitHub Pages, AWS, Wordpress, or from a server in my basement. If my hosting provider becomes unavailable, my website won't go down with it. Getting back up and running would be as simple as updating my DNS configuration to point to a new host.

Price is hardly an excuse, either. You can buy a domain for {{< extlink href="https://www.jdoqocy.com/click-100268310-14326263" text="less than a cup of coffee" >}} with my Namecheap affiliate link (thanks!). Namecheap also handles [your DNS settings](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/), so it's a one-stop shop.

With your own domain, you can build resiliency for your email address as well. Learn how to set up your custom domain with your email provider. If you need to switch providers in the future, your email address ports to the new service with you. Here are a few quick links for providers I'd recommend:

- [ProtonMail: How to use a custom domain with Proton Mail](https://proton.me/support/custom-domain)
- [Tutanota: Adding of custom email domains](https://tutanota.com/howto/#custom-domain)
- [Fastmail: Custom Domains with Fastmail](https://www.fastmail.help/hc/en-us/articles/360058753394-Custom-Domains-with-Fastmail)

## Build your digital resiliency

I hope you've found this article useful on your path to building digital resiliency. If you're interested in more privacy topics, you might like to learn about great [apps for outsourcing security](/blog/outsourcing-security-with-1password-authy-and-privacy.com/).

If your threat model includes anonymity or censorship, building digital resiliency is just a first step. The rest is outside the scope of my blog, but here are a few great resources I've come across:

- [Tor Browser](https://www.torproject.org/)
- [IntelTechniques](https://inteltechniques.com/index.html)
- [Can't Cancel Me](https://cantcancel.me/)
- [Tails portable OS](https://tails.boum.org/)
