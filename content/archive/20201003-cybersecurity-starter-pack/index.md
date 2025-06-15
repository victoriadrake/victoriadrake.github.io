---
title: "Your cybersecurity starter pack"
date: 2020-10-04T04:30:12-04:00

aliases:
    - /blog/personal-cybersecurity-posture-for-when-youre-just-this-guy-you-know/
    - /archive/personal-cybersecurity-posture-for-when-youre-just-this-guy-you-know/
description: Basic security best practices to share with your non-technical friend.
tags:
    - security
image: cover.png
 
draft: false
categories: ["article"]
---

Readers of my blog typically know more about technology and cybersecurity than most people. This article is for most people. If someone you know could benefit from a simple and straightforward introduction to cybersecurity tools, please share this article with them -- it benefits everyone!

If you've ever said to yourself:

_"There's no one targeting lil ol' me."_\
_"I have nothing to hide, anyway."_\
_"I'm too busy to learn all this stuff. Why can't someone just give me a simple summary of best practices that I can skim in approximately seven minutes?"_

First of all, you might want to stop talking to yourself in public. Secondly, here is a simple summary of best practices that you can skim in approximately seven minutes.

## Introducing your three-step starter pack

While there are many different degrees of security, privacy, and anonymity, these three basics are accessible to all:

1. Use a VPN
2. Use multifactor authentication
3. Develop a healthy sense of skepticism

I'll discuss each of these and help you get started with your security upgrade. But first...

## Why is cybersecurity important?

Would you let just anyone walk into your house, or even look through your open doorway from across the street? If not, you might appreciate that the cybersecurity practices we'll discuss today are not that different from locking your front door.

Cybersecurity isn't about finding some magic spell that completely secures your online activities -- that would be nice, but it's unrealistic. Good security practices are about employing some thoughtful habits that make your online activities more secure than the next guy, in much the same way as you learned to lock your front door.

Security breaches and incidents happen every day. Most of them occur because an automated scanner cast a wide net and found a person or company with lax security that a hacker could then exploit. Don't be that guy.

## 1. Use a VPN

Let's say you send a lot of mail, but never bother to put your letters in envelopes or even fold them in half. Anyone who bothers to look can read all your dirty secrets (not that you have any).

When you use a Virtual Private Network, or VPN, especially if you often connect to public WiFi, it's like putting your letters into cryptographically-sealed envelopes and sending them via a special invisible courier service. No one but the intended recipient can read your letters, and no one but you and the courier know to whom the letters are sent.

{{< figure src="vpnmail.png" alt="An illustration of a locked envelope" caption="Encrypted mail still won't stop you from the accidental _reply all_, unfortunately." >}}

VPNs prevent others from reading your communications. This may include opportunistic attackers who scan open WiFi, and even your own internet service provider (ISP) who may sell your usage data for advertising dollars.

### Choosing a VPN

A few important differentiating factors can help you choose a VPN provider.

1. **Is it free?** VPNs cost money to operate; if one is offered for free, consider what they might be doing in order to cover their costs. Generally, I recommend avoiding free VPN apps and services; they'll typically cost you much more than you'll know. Expect to pay between $5-$10 USD monthly for the service.

2. **Where is it based?** Understand where your VPN provider is based, and what that country's laws allow them to do with your data.

3. **Do they keep logs?** Part of the philosophy of using a VPN is that no one has any business getting into your business when it comes to online activities. When a VPN provider keeps logs of your usage, that defeats the purpose. Instead of your ISP knowing just what you're up to online, that knowledge is simply transferred to the logging VPN. Look for VPN providers with a strict no-logging policy, or if you're up for it, [roll your own](/blog/set-up-a-pi-hole-vpn-on-an-aws-lightsail-instance/).

## 2. Use multifactor authentication

Passwords are dead. Computationally, they are a solved problem. Cracking your password is just [a matter of time](https://howsecureismypassword.net/).

Unfortunately, many people still help to speed up the process by using the same [compromised passwords](https://haveibeenpwned.com/Passwords) for multiple accounts, putting themselves at further risk.

The answer, at least for now, is [multifactor authentication](https://en.wikipedia.org/wiki/Multi-factor_authentication) (MFA). MFA is made up of three kinds of authentication factors:

1. Something you know, like a pass phrase;
2. Something you have, like a chip pin card or phone; and
3. Something that you are, like your face or fingerprint.

{{< figure src="mfa.png" alt="An illustration of the letters MFA" caption="Also the name of my next beatboxing team." >}}

Two or more of these factors are infinitely better than a password alone, especially if [your password is on this list](https://en.wikipedia.org/wiki/List_of_the_most_common_passwords).

Multiple authentication factors are now widely supported by account providers and social media sites. If you have the choice, avoid using text messages, or SMS, as a way of receiving authentication codes. SMS authentication leaves you vulnerable to the [SIM swap attack](https://en.wikipedia.org/wiki/SIM_swap_scam) - please direct further questions to [Jack Dorsey](https://www.nytimes.com/2019/09/05/technology/sim-swap-jack-dorsey-hack.html).

Instead, use a One Time Password (OTP) app such as [Authy](https://authy.com/) to generate codes on your device. This ensures that you alone, using that particular device, will have the correct authentication code.

You can also use hardware authentication keys such as the [YubiKey](https://www.yubico.com/), but these aren't yet as widely supported as OTP apps.

## 3. Develop a healthy sense of skepticism

Social engineering, sometimes SE, is the use of psychological persuasion to get an unwitting target to give up access or information. This can take the form of phishing emails, letters, or phone calls (vishing) as well as far more sophisticated spear-phishing attacks of high-value targets, like company executives.

While some attacks are easier to spot, others [use cognitive biases very effectively](https://www.youtube.com/watch?v=8bAuA1isCz0) and are difficult even for security professionals to avoid. No human is immune.

Ultimately, the weakest link in your cybersecurity defense is you. All the VPNs and MFA on the Internet won't protect you if a scam can trick you into opening the front gates. Always look a Trojan gift horse in the mouth.

{{< figure src="horse.png" alt="An illustration of a Trojan horse" caption="Yes, I know it's a very nice looking wooden horse. Also free. Did you order it? No? Then it can stay outside." >}}

Develop the habit of second-guessing things delivered to your virtual doorstep. Email, phone, and messaging scams range in sophistication. Even security professionals can fall for a good scam.

One way to protect yourself is to practice a healthy sense of skepticism. Question communications that ask you to click on links or visit a website, even if they come from someone you know or a company you use.

If you're not certain that your bank or mother sent this email, pick up the phone and call them. Even if you think you are certain, pick up the phone and double check. You don't call your mother enough, anyway.

Oh, and if the person on the phone is from your local tax office or the IRS or the CRA and they're about to freeze your accounts because a case of mistaken identity has resulted in you being criminally charged for not repaying a loan on a 600-foot yacht in Malibu, just hang up. You know better than that. Tax agencies don't have phones.

## A safer Internet

Congratulations! You now have three tools to make your personal cybersecurity better than the next guy's. If enough people do that, the whole neighborhood (or in this case, the Internet) will benefit as a result.

If this article piqued your interest, you can go further and [outsource your security with a password manager and temporary virtual credit cards](/blog/outsourcing-security-with-1password-authy-and-privacy.com/).

### Cheat sheets and other resources

I'll leave you with a few resources that I've enjoyed:

- The Electronic Frontier Foundation website [Surveillance Self Defense](https://ssd.eff.org/) offers many great guides and how-to's, such as setting up the encrypted messaging app [Signal](https://www.signal.org/) on your mobile device, and protecting yourself on social media.
- The Cybersecurity and Infrastructure Security Agency (CISA) offers many [shareable starter resources](https://www.cisa.gov/resources-tools/all-resources-tools).
- Working from home? The National Security Agency Central Security Service has [Telework and Mobile Security Guides](https://www.nsa.gov/Press-Room/Telework-and-Mobile-Security-Guidance/) that discuss best practices for an unprecedented era of remote work.
