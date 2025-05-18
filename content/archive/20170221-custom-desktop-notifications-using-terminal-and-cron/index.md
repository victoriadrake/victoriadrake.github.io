---
title: How I created custom desktop notifications using terminal and cron
date: 2017-02-21T10:48:38+07:00

slug: how-i-created-custom-desktop-notifications-using-terminal-and-cron
aliases:
    - /verbose/create-desktop-notifications-cron
    - /verbose/how-i-created-custom-desktop-notifications-using-terminal-and-cron
description: How you can use tools your Linux system already has to create custom desktop notifications.
tags:
    - terminal
    - linux
image: dunstnotif.png
 
draft: false
categories: ["article"]

wasfeatured:
    - where : url

---

In my last post I talked about moving from Windows 10 to running i3 on Linux, built up from Debian Base System. Among other things, this change has taught me about the benefits of using basic tools and running a minimal, lightweight system. You can achieve a lot of functionality with just command line tools and simple utilities. One example I'd like to illustrate in this post is setting up desktop notifications.

I use [dunst](https://dunst-project.org/) for desktop notifications. It's a simple, lightweight tool that is easy to configure, doesn't have many dependencies, and can be used across various distributions.

## Battery status/low battery notification

I was looking for a simple, versatile set up to create notifications for my battery status without having to rely on separate, standalone GUI apps or services. In my search I came across a simple one-line cron task that seemed to be the perfect fit. I adapted it to my purpose and it looks like this:

```conf
# m h  dom mon dow   command
*/5 * * * * acpi --battery | awk -F, '/Discharging/ { if (int($2) < 20) print }' | xargs -ri env DISPLAY=:0 notify-send -u critical -i "/usr/share/icons/Paper/16x16/status/xfce-battery-critical.png" -t 3000 "{}\nBattery low!"
```

>*Psst... [here's a great tool](https://crontab.guru/) for formatting your crontab times.*

There's a lot going on here, so let's break it down:
`*/5 * * * *`
Every five minutes, do the following.

`acpi --battery`
Execute `acpi` and show battery information, which on its own returns something akin to:
`Battery 0: Discharging, 65%, 03:01:27 remaining`

Pretty straightforward so far. At any point you could input `acpi --battery` in a terminal and receive the status output. Today's post, however, is about receiving this information passively in a desktop notification. So, moving on:

`| awk -F, '/Discharging/ { if (int($2) < 20) print }'`
Pipe (`|`) the result of the previous command to `awk`. (If you don't know what pipe does, here's [an answer from superuser.com](http://superuser.com/questions/756158/what-does-the-linux-pipe-symbol-do) that explains it pretty well, I think.) `awk` can do a lot of things, but in this case, we're using it to examine the status of our battery. Let's zoom in on the `awk` command:

`awk -F, '/Discharging/ { if (int($2) < 20) print }'`
Basically, we're saying, "Hey, awk, look at that input you just got and try to find the word "discharging," then look to see if the number after the first comma is less than 20. If so, print the whole input."

`| xargs -ri`
Pipe the result of the previous command to `xargs`, which takes it as its input and does more stuff with it. `-ri` is equivalent to `-r` (run the next command only if it receives arguments) and `-i` (look for "{}" and replace it with the input). So in this example, xargs serves as our gatekeeper and messenger for the next command.

`env DISPLAY=:0`
Run the following utility in the specified display, in this case, the first display of the local machine.

`notify-send -u critical -i "/usr/share/icons/Paper/16x16/status/xfce-battery-critical.png" -t 3000 "{}\nLow battery!"`
Shows a desktop notification with `-u critical` (critical urgency), `-i` (the specified icon), `-t 3000` (display time/expires after 3000 milliseconds), and finally `{}` (the output of awk, replaced by xargs).

Not bad for a one-liner! I made a few modifications for different states of my battery. Here they all are in my crontab:

```conf
# m h  dom mon dow   command
*/5 * * * * acpi --battery | awk -F, '/Discharging/ { if ( (int($2) < 30) && (int($2) > 15) ) print }' | xargs -ri env DISPLAY=:0 notify-send -a "Battery status" -u normal -i "/usr/share/icons/Paper/16x16/status/xfce-battery-low.png" -t 3000 "{}\nBattery low!"
*/5 * * * * acpi --battery | awk -F, '/Discharging/ { if (int($2) < 15) print }' | xargs -ri env DISPLAY=:0 notify-send -a "Battery status" -u critical -i "/usr/share/icons/Paper/16x16/status/xfce-battery-critical.png" -t 3000 "{}\nSeriously, plug me in."
*/60 * * * * acpi --battery | awk -F, '/Discharging/ { if (int($2) > 30) print }' | xargs -ri env DISPLAY=:0 notify-send -a "Battery status" -u normal -i "/usr/share/icons/Paper/16x16/status/xfce-battery-ok.png" "{}"
*/60 * * * * acpi --battery | awk -F, '/Charging/ { print }' | xargs -ri env DISPLAY=:0 notify-send -a "Battery status" -u normal -i "/usr/share/icons/Paper/16x16/status/xfce-battery-ok-charging.png" "{}"
*/60 * * * * acpi --battery | awk -F, '/Charging/ { if (int($2) == 100) print }' | xargs -ri env DISPLAY=:0 notify-send -a "Battery status" -u normal -i "/usr/share/icons/Paper/16x16/status/xfce-battery-full-charging.png" "Fully charged."
```

By the way, you can open your crontab in the editor of your choice by accessing it as root from the `/var/spool/cron/crontabs/` directory. It's generally best practice however to make changes to your crontab with the command `crontab -e`.

You can see that each notification makes use of the `{}` placeholder that tells xargs to put its input there - except for the last one. This is interesting because in this case, we're only using `xargs -ri` as a kind of switch to present the notification. The actual information that was the input for xargs is not needed in the output in order to create a notification.

## Additional notifications with command line tools

With cron and just a few combinations of simple command line tools, you can create interesting and useful notifications. Consider the following:

### Periodically check your dhcp address

```sh
*/60 * * * * journalctl | awk -F: '/dhcp/ && /address/ { print $5 }' | tail -1 | xargs -ri env DISPLAY=:0 notify-send -a "dhcp address" -u normal "{}"
```

Which does the following:
`*/60 * * * *`
Every 60 minutes.

`journalctl`
Take the contents of your system log.

`| tail -1'/dhcp/ && /address/ { print $5 }'`
Find logs containing both "dhcp" and "address" and output the 5th portion as separated by ":" (the time field counts).

`| tail -1`
Take the last line of the output.

`| xargs -ri env DISPLAY=:0 notify-send -a "dhcp address" -u normal "{}"`
Create the desktop notification including the output.

### Periodically display the time and date

```sh
*/60 * * * * timedatectl status | awk -F\n '/Local time/ { print }' | xargs -ri env DISPLAY=:0 notify-send -a "Current Time" -u normal "{}"
```

### System log activity

You can also search your system logs (try `journalctl`) for any number of things using awk, enabling you to get periodic notifications of virtually any logged events.

## Experiment

As with all things, you are only limited by your imagination! I hope this post has given you some idea about the endless possibilities of these simple utilities. Thanks for reading!
