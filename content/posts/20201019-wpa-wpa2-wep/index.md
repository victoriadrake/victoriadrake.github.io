---
title: "WPA Key, WPA2, WPA3, and WEP Key: Wi-Fi security explained"
date: 2020-10-19T04:02:27-04:00

aliases:
    - /archive/wpa-key-wpa2-wpa3-and-wep-key-wi-fi-security-explained/
description: Which one should you be using? Why Wi-Fi security matters.
series:
    - security-for-developers
tags:
    - computing
    - algorithms
    - protocols
    - cybersecurity
image: cover.png
noToc: true
draft: false
categories: ["article"]
---

Setting up new Wi-Fi? Picking the type of password you need can seem like an arbitrary choice. After all, WEP, WPA, WPA2, and WPA3 all have mostly the same letters in them. A password is a password, so what's the difference?

About 60 seconds to billions of years, as it turns out.

All Wi-Fi encryption is not created equal. Let's explore what makes these four acronyms so different, and how you can best protect your home and organization Wi-Fi.

## Wired Equivalent Privacy (WEP)

In the beginning, there was WEP.

{{% figure src="wep.png" alt="cartoon of WEP letters" caption="Not to be confused with the name of a certain rap song." %}}

[Wired Equivalent Privacy](https://en.wikipedia.org/wiki/Wired_Equivalent_Privacy) is a deprecated security algorithm from 1997 that was intended to provide equivalent security to a wired connection. "Deprecated" means, "Let's not do that anymore."

Even when it was first introduced, it was known not to be as strong as it could have been, for two reasons: one, its underlying encryption mechanism; and two, World War II.

During World War II, the impact of code breaking (or cryptanalysis) was [huge](https://en.wikipedia.org/wiki/History_of_cryptography#World_War_II_cryptography). Governments reacted by attempting to keep their best secret-sauce recipes at home. Around the time of WEP, [U.S. Government restrictions on the export of cryptographic technology](https://en.wikipedia.org/wiki/Export_of_cryptography_from_the_United_States) caused access point manufacturers to limit their devices to 64-bit encryption. Though this was later lifted to 128-bit, even this form of encryption offered a very limited possible [key size](https://en.wikipedia.org/wiki/Key_size).

This proved problematic for WEP. The small key size resulted in being easier to [brute-force](https://en.wikipedia.org/wiki/Brute-force_attack), especially when that key doesn't often change.

WEP's underlying encryption mechanism is the [RC4 stream cipher](https://en.wikipedia.org/wiki/RC4). This cipher gained popularity due to its speed and simplicity, but that came at a cost. It's not the most robust algorithm. WEP employs a single shared key among its users that must be manually entered on an access point device. (When's the last time you changed your Wi-Fi password? Right.) WEP didn't help matters either by simply concatenating the key with the initialization vector -- which is to say, it sort of mashed its secret-sauce bits together and hoped for the best.

> [Initialization Vector (IV)](https://en.wikipedia.org/wiki/Initialization_vector): fixed-size input to a [low-level cryptographic algorithm](https://en.wikipedia.org/wiki/Cryptographic_primitive), usually random.

Combined with the use of RC4, this left WEP particularly susceptible to [related-key attack](https://en.wikipedia.org/wiki/Related-key_attack). In the case of 128-bit WEP, your Wi-Fi password can be cracked by publicly-available tools in a matter of around [60 seconds](https://eprint.iacr.org/2007/120) to [three minutes](https://www.networkcomputing.com/wireless-infrastructure/fbi-teaches-lesson-how-break-wi-fi-networks).

While some devices came to offer 152-bit or 256-bit WEP variants, this failed to solve the fundamental problems of WEP's underlying encryption mechanism.

So, yeah. Let's not do that anymore.

## Wi-Fi Protected Access (WPA)

![WPA illustration](wpa.png)

A new, interim standard sought to temporarily "patch" the problem of WEP's (lack of) security. The name [Wi-Fi Protected Access (WPA)](https://en.wikipedia.org/wiki/Wi-Fi_Protected_Access) certainly _sounds_ more secure, so that's a good start; however, WPA first started out with another, more descriptive name.

Ratified in a [2004 IEEE standard](https://en.wikipedia.org/wiki/IEEE_802.11i-2004), [Temporal Key Integrity Protocol (TKIP)](https://en.wikipedia.org/wiki/Temporal_Key_Integrity_Protocol#Beck-Tews_attack) uses a dynamically-generated, per-packet key. Each packet sent has a unique temporal 128-bit key, (See? Descriptive!) that solves the susceptibility to related-key attacks brought on by WEP's shared key mashing.

TKIP also implements other measures, such as a [message authentication code (MAC)](https://en.wikipedia.org/wiki/Message_authentication_code). Sometimes known as a checksum, a MAC provides a cryptographic way to verify that messages haven't been changed. In TKIP, an invalid MAC can also trigger rekeying of the session key. If the access point receives an invalid MAC twice within a minute, the attempted intrusion can be countered by changing the key an attacker is trying to crack.

Unfortunately, in order to preserve compatibility with the existing hardware that WPA was meant to "patch," TKIP retained the use of the same underlying encryption mechanism as WEP -- the RC4 stream cipher. While it certainly improved on the weaknesses of WEP, TKIP eventually proved vulnerable to new attacks that [extended previous attacks on WEP](https://en.wikipedia.org/wiki/Temporal_Key_Integrity_Protocol#Security). These attacks take a little longer to execute by comparison: for example, [twelve minutes](http://dl.aircrack-ng.org/breakingwepandwpa.pdf) in the case of one, and [52 hours](https://www.rc4nomore.com/) in another. This is more than sufficient, however, to deem TKIP no longer secure.

WPA, or TKIP, has since been deprecated as well. So let's also not do that anymore.

Which brings us to...

## Wi-Fi Protected Access II (WPA2)

![WPA2 illustration](wpa2.png)

Rather than spend the effort to come up with an entirely new name, the improved [Wi-Fi Protected Access II (WPA2)](https://en.wikipedia.org/wiki/Wi-Fi_Protected_Access#WPA2) standard instead focuses on using a new underlying cipher. Instead of the RC4 stream cipher, WPA2 employs a block cipher called [Advanced Encryption Standard (AES)](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) to form the basis of its encryption protocol. The protocol itself, abbreviated [CCMP](https://en.wikipedia.org/wiki/CCMP_(cryptography)), draws most of its security from the length of its rather long name (I'm kidding): Counter Mode Cipher Block Chaining Message Authentication Code Protocol, which shortens to Counter Mode CBC-MAC Protocol, or CCM mode Protocol, or CCMP. 🤷

[CCM mode](https://en.wikipedia.org/wiki/CCM_mode) is essentially a combination of a few good ideas. It provides data confidentiality through [CTR mode, or counter mode](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Counter_.28CTR.29). To vastly oversimplify, this adds complexity to plaintext data by encrypting the successive values of a count sequence that does not repeat. CCM also integrates [CBC-MAC](https://en.wikipedia.org/wiki/CBC-MAC), a block cipher method for constructing a MAC.

AES itself is on good footing. The AES specification was established in 2001 by the U.S. National Institute of Standards and Technology (NIST) after a five-year competitive selection process during which fifteen proposals for algorithm designs were evaluated. As a result of this process, a family of ciphers called Rijndael (Dutch) was selected, and a subset of these became AES. For the better part of two decades, AES has been used to protect every-day Internet traffic as well as [certain levels of classified information in the U.S. Government](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard#Security).

While [possible attacks on AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard#Known_attacks) have been described, none have yet been proven to be practical in real-world use. The fastest [attack on AES](https://web.archive.org/web/20141230025103/http://research.microsoft.com/en-us/projects/cryptanalysis/aesbc.pdf) in public knowledge is a [key-recovery attack](https://en.wikipedia.org/wiki/Key-recovery_attack) that improved on brute-forcing AES by a factor of about four. How long would it take? Some [billions of years](https://web.archive.org/web/20150108165723/https://blog.agilebits.com/2011/08/18/aes-encryption-isnt-cracked/).

## Wi-Fi Protected Access III (WPA3)

![WPA3 illustration](wpa3.png)

The next installment of the WPA trilogy has been required for new devices since July 1, 2020. Expected to further enhance the security of WPA2, the [WPA3 standard](https://www.wi-fi.org/news-events/newsroom/wi-fi-alliance-introduces-wi-fi-certified-wpa3-security) seeks to improve password security by being more resilient to word list or [dictionary attacks](https://en.wikipedia.org/wiki/Dictionary_attack).

Unlike its predecessors, WPA3 will also offer [forward secrecy](https://en.wikipedia.org/wiki/Forward_secrecy). This adds the considerable benefit of protecting previously exchanged information even if a long-term secret key is compromised. Forward secrecy is already provided by protocols like TLS by using asymmetric keys to establish shared keys. You can learn [more about TLS in this post](/blog/what-is-tls-transport-layer-security-encryption-explained-in-plain-english/).

As WPA2 has not been deprecated, both WPA2 and WPA3 remain your top choices for Wi-Fi security.

## If the other ones suck, why are they still around?

You may be wondering why your access point even allows you to choose an option other than WPA2 or WPA3. The likely reason is that you're using legacy hardware, which is what tech people call your mom's router.

Since the deprecation of WEP and WPA occurred (in old-people terms) rather recently, it's possible in large organizations as well as your parent's house to find older hardware that still uses these protocols. Even newer hardware may have a business need to support these older protocols.

While I may be able to convince you to invest in a shiny new top-of-the-line Wi-Fi appliance, most organizations are a different story. Unfortunately, many just aren't yet cognizant of the important role cybersecurity plays in meeting customer needs and boosting that bottom line. Additionally, switching to newer protocols may require new internal hardware or firmware upgrades. Especially on complex systems in large organizations, upgrading devices can be financially or strategically difficult.

## Boost your Wi-Fi security

If it's an option, choose WPA2 or WPA3. Cybersecurity is a field that evolves by the day, and getting stuck in the past can have dire consequences.

If you can't use WPA2 or WPA3, do the best you can to take additional security measures. The best bang for your buck is to use a Virtual Private Network (VPN). Using a VPN is a good idea no matter which type of Wi-Fi encryption you have. On open Wi-Fi (coffee shops) and using WEP, it's plain irresponsible to go without a VPN. Kind of like shouting out your bank details as you order your second cappuccino.

{{% figure src="cafewifi.png" alt="A cartoon of shouting out your bank details at a coffeeshop." %}}

When possible, ensure you only connect to known networks that you or your organization control. Many cybersecurity attacks are executed when victims connect to an imitation public Wi-Fi access point, also called an evil twin attack, or Wi-Fi phishing. These fake hotspots are easily created using publicly accessible programs and tools. A reputable VPN can help mitigate damage from these attacks as well, but it's always better not to take the risk. If you travel often, consider purchasing a portable hotspot that uses a cellular data plan, or using data SIM cards for all your devices.

## Much more than just acronyms

WEP, WPA, WPA2, and WPA3 mean a lot more than a bunch of similar letters -- in some cases, it's a difference of billions of years minus about 60 seconds.

On more of a now-ish timescale, I hope I've taught you something new about the security of your Wi-Fi and how you can improve it!
