---
title: "There are better options for a privacy-respecting phone"
date: 2021-08-11T11:37:35Z

aliases:
    - /blog/the-what-phone-should-i-get-post/
description: Meet the new, better Apple. Here's how to choose your phone and set it up.
series:
tags:
    - privacy
    - linux
    - open-source
    - hardware
image: cover.png
noToc: true
draft: false
---

Whether you think the news of Apple scanning your private devices was a big deal, run-of-the-mill, or something we all should have seen coming, you might be wondering, "What now?" We know full well that Google is looking at the stuff on your phone too (and Gmail, and... well, everywhere else) so it’s not like there are other options after Apple... right?

If a move towards privacy is what we’re after, we know a new off-the-shelf Google phone isn't a better answer -- but there are more options.

If you don't want the details, jump straight to [The TL;DR](#the-tldr) at the end.

## Linux phones (sort of)

Unless you’re a rather tolerant tech-savvy tinkerer, a Linux phone isn’t one of these options... yet. I’ve personally been very excited about the bevy of emerging options in this space, from freedom-oriented hardware to fully open source, crowd-developed operating systems.

The current state of these efforts is that this magical mashup just isn’t ready yet. Most Linux phone OS such as Ubuntu Touch, Mobian, Pure OS, etc, are in a "mostly working" state, with the missing features ranging from "lack of reliable push notifications" to "intermittent Bluetooth connectivity" to "camera."

If all you need is text messaging and a web browser, yes, you can probably go this route. For most users however, this isn’t going to make daily-driver status.

If a Linux phone would suit you, I recommend getting your hands on a [PinePhone](https://www.pine64.org/pinephone/) and running Arch Linux ARM ([releases on GitHub](https://github.com/dreemurrs-embedded/Pine64-Arch/releases)) with [Plasma Mobile](https://www.plasma-mobile.org/get/).

## De-googled Android

For a daily-driver, "de-googled" Android is your best bet. Android itself (specifically, the Android Open Source Project source code) is based on a modified Linux kernel and is free and open source software. When we typically think of "Android phones," we refer to Android devices with Google's proprietary software added to the mix, including Google Play Services. A "de-googled" Android phone is essentially the Android OS without Google's ~~spyware~~ services included by default.

Keep in mind that this route still involves some DIY. You'll need to install an OS on a device yourself. Don't worry, there are step-by-step guides available -- the most technical thing you'll likely have to do is copy and paste some commands into your terminal.

Free and open source Android OS comes in multiple flavors, and the choice isn't arbitrary. Your selection of a "de-googled" phone is going to be determined by a couple factors: the hardware device you have or that you want to use, and the apps (software) you want to run on it.

### Hardware

The phone you may already have (or the one you’re willing to purchase) will influence your choice of operating system (OS).

#### LineageOS

At the time I’m writing this, if you have an older Pixel or another model of Android phone, your best bet for a hassle-free OS with A-class support will be Lineage. Here’s a link to the [LineageOS list of supported devices](https://wiki.lineageos.org/devices/). Clicking on your device here will get you to some installation instructions for your phone.

#### GrapheneOS

If you have a newer Pixel (generation 3 up to the newer 5) then GrapheneOS could be the way to go. [Here are the devices officially supported by GrapheneOS](https://grapheneos.org/faq#supported-devices). They also have [easy-to-follow installation instructions](https://grapheneos.org/install/) and help via chat. It is possible to run GrapheneOS on other phones, but not without substantial DIY for which technical knowledge would help.

Generally speaking, GrapheneOS is intended to be a security-hardened operating system targeted at individuals who won't be miffed if there are tradeoffs for mitigating vulnerabilities. If you don't have those requirements or intend to use Google Apps on your phone (see Software), then LineageOS will likely suit you better.

#### New phone, who dis?

If you're looking to purchase a new phone, you have some flexibility. My general recommendation is to pick up last-season's version of the model you want. Not only will this likely be cheaper (and often a great deal if you buy refurbished) but the open source community that develops these operating systems will have had more time to work with the device itself, which could help ensure better compatibility and a smoother set up.

Consider buying a refurbished phone (sometimes called "renewed") locally when you can. This can help fund the small businesses that offer them.

### Software

What do you *need* to do on your phone? Privacy and convenience are typically at odds (a far larger topic I won’t dig into right now) so it can help to narrow down the functionality you need. If your needs look something like:

- Calls and texts
- Web browser
- Web-based email via browser

Then you're good to go, right out of the box, with either LineageOS or GrapheneOS. They'll both include free and open source apps that let you do all these things.

If you want a particular application that doesn't come pre-installed, here's where we get into some nuance. Your choices depend on the level of privacy you'd like to maintain. Here are your avenues for installing apps, listed in order of preference.

#### 1. Official APKs

Some particularly privacy-focused applications offer an Android Package Kit (APK) that you can download directly in order to install the app. You should only download these when you've navigated directly to a domain that the organization owns. Here are my favorites:

- [Signal](https://signal.org/android/apk/)
- [ProtonMail](https://protonapps.com/protonmail-android)

You can download and install APKs whether you choose LineageOS or GrapheneOS.

#### 2. Use F-Droid

If you can't find an APK for something you want, search for it on F-Droid.

The [F-Droid](https://f-droid.org/) software repository allows you to download and install apps in much the same way that the Google Play store does, with a couple notable differences. All the apps here are free and open source, and no account or profile is required to download them. The F-Droid APK itself can be downloaded and installed from f-droid.org directly on either LineageOS or GrapheneOS.

Just like any open source software, it's up to the user (you) to ensure that you're downloading and installing software you trust. If you want help or advice, F-Droid has a healthy community that you can interact with in lots of ways, including [via IRC, Matrix, and the Fediverse](https://f-droid.org/en/about/).

You can find an app for pretty much anything here: from your general-store type functions such as to-do lists, music players, and maps; to specific niche security applications, and even a tea timer. Here are some well-known choices I can easily recommend:

- [Standard Notes](https://f-droid.org/en/packages/com.standardnotes/) (https://standardnotes.org/)
- [Element for Matrix](https://f-droid.org/en/packages/im.vector.app/) (https://element.io/)
- [Tutanota](https://f-droid.org/en/packages/de.tutao.tutanota/) (https://tutanota.com)

#### 3. Aurora Store

If you need an app that isn't available on F-Droid, your next stop is the Aurora Store. This is an unofficial client for the Google Play Store that lets you download free applications anonymously, without signing into a Google account. Most applications found in the larger stores can be downloaded this way, without requiring Google's proprietary stuff on your phone.

When loading Aurora Store for the first time, be sure to choose the "Anonymous" option instead of signing in.

The Aurora Store itself can be [installed via F-Droid](https://f-droid.org/en/packages/com.aurora.store/) or [auroraoss.com](https://auroraoss.com/downloads/AuroraStore/). It works on either LineageOS or GrapheneOS -- however, apps that require less private permissions or access will probably work better on LineageOS.

Keep in mind that your phone OS in no way supports these apps directly, or knows what's in them, or what sort of tracking and information exchange they may be up to. It's a slight privacy downgrade, but still better than a fully Google-ified OS.

#### 4. If you need Google Apps

If this will be your only phone and you simply must have Google Apps on it (think Google Play Store, Gmail, Calendar, Photos, etc) then go with LineageOS. You can choose to try emulating Google Play Services using [LineageOS for microG](https://lineage.microg.org/), or [install the Google Apps add-on](https://wiki.lineageos.org/gapps) when you install LineageOS.

## The TL;DR

Here's the "Internet personality quiz" version of everything above. You are...

1. **Knowledgeable about Linux;** mostly use a phone for text, calls, and web browser; and potentially want to help develop Linux phone software.
   - Try a Linux phone such as the PinePhone, but consider one of the other options as a back up for when you just need stuff to work.
2. **Security or privacy inclined,** happy to use FOSS apps, or do most things via web browser anyway.
   - Get your hands on a Pixel 3{XL, a, a XL}, Pixel 4{XL, a, a 5G}, or Pixel 5, and use GrapheneOS. [Installation instructions here](https://grapheneos.org/install/).
   - Optionally, download the [F-Droid](https://f-droid.org/) or [Aurora Store](https://f-droid.org/en/packages/com.aurora.store/) APKs for apps.
3. **Someone who needs Google Apps to work,** or you want a phone that isn't a Pixel, or you're setting up a device for someone who's fine using Android but needs it to look familiar.
   - Use LineageOS with any of [its supported devices](https://wiki.lineageos.org/devices/). Click on the device name for installation instructions.
   - If you must have Google Apps and need Google Play Services to work, [install the add-on](https://wiki.lineageos.org/gapps) at the same time you install LineageOS.
   - Optionally, download the [F-Droid](https://f-droid.org/) or [Aurora Store](https://f-droid.org/en/packages/com.aurora.store/) for installing apps.

Whichever route you choose, my advice is to treat this like a learning experiment. You're sort of building your own phone, after all, and gaining all the technological independence that comes with that knowledge. If possible, don't ditch your current phone until you try out one (two?) of these paths. The one you end up liking most could surprise you! It's great to have options.
