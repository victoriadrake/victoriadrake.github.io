---
title: "Bash and shell expansions: lazy list-making"
date: 2019-11-18T07:07:24-05:00

aliases:
description: A tour of brace expansion, shell parameter expansions, and playing with substrings in Bash.
tags:
    - terminal
    - linux
image: cover.png
draft: false
categories: ["article"]
---

It's that time of year again! When stores start putting up colourful sparkly lit-up plastic bits, we all begin to feel a little festive, and by festive I mean let's go shopping. Specifically, holiday gift shopping! (Gifts for yourself are still gifts, technically.)

Just so this doesn't all go completely madcap, you ought to make some gift lists. Bash can help.

## Brace expansion

These are not braces: `()`

Neither are these: `[]`

_These_ are braces: `{}`

Braces tell Bash to do something with the arbitrary string or strings it finds between them. Multiple strings are comma-separated: `{a,b,c}`. You can also add an optional preamble and postscript to be attached to each expanded result. Mostly, this can save some typing, such as with common file paths and extensions.

Let's make some lists for each person we want to give stuff to. The following commands are equivalent:

```sh
touch /home/me/gift-lists/Amy.txt /home/me/gift-lists/Bryan.txt /home/me/gift-lists/Charlie.txt
```

```sh
touch /home/me/gift-lists/{Amy,Bryan,Charlie}.txt
```

```sh
tree gift-lists

/home/me/gift-lists
├── Amy.txt
├── Bryan.txt
└── Charlie.txt
```

Oh darn, "Bryan" spells his name with an "i." I can fix that.

```sh
mv /home/me/gift-lists/{Bryan,Brian}.txt

renamed '/home/me/gift-lists/Bryan.txt' -> '/home/me/gift-lists/Brian.txt'
```

## Shell parameter expansions

[Shell parameter expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html) allows us to make all sorts of changes to parameters enclosed in braces, like manipulate and substitute text.

There are a few stocking stuffers that all our giftees deserve. Let's make that a variable:

```sh
STUFF=$'socks\nlump of coal\nwhite chocolate'

echo "$STUFF"
socks
lump of coal
white chocolate
```

Now to add these items to each of our lists with some help from [the `tee` command](https://en.wikipedia.org/wiki/Tee_(command)) to get `echo` and expansions to play nice.

```sh
echo "$STUFF" | tee {Amy,Brian,Charlie}.txt

cat {Amy,Brian,Charlie}.txt

socks
lump of coal
white chocolate
socks
lump of coal
white chocolate
socks
lump of coal
white chocolate
```

### Pattern match substitution

On second thought, maybe the lump of coal isn't such a nice gift. You can replace it with something better using a pattern match substitution in the form of `${parameter/pattern/string}`:

```sh
echo "${STUFF/lump of coal/candy cane}" | tee {Amy,Brian,Charlie}.txt

cat {Amy,Brian,Charlie}.txt

socks
candy cane
white chocolate
socks
candy cane
white chocolate
socks
candy cane
white chocolate
```

This replaces the first instance of "lump of coal" with "candy cane." To replace all instances (if there were multiple), use `${parameter//pattern/string}`. This doesn't change our `$STUFF` variable, so we can still reuse the original list for someone naughty later.

### Substrings

While we're improving things, our giftees may not all like white chocolate. We'd better add some regular chocolate to our lists just in case. Since I'm super lazy, I'm just going to hit the up arrow and modify a previous Bash command. Luckily, the last word in the `$STUFF` variable is  "chocolate," which is nine characters long, so I'll tell Bash to keep just that part using `${parameter:offset}`. I'll use `tee`'s `-a` flag to `a`ppend to my existing lists:

```sh
echo "${STUFF: -9}" | tee -a {Amy,Brian,Charlie}.txt

cat {Amy,Brian,Charlie}.txt

socks
candy cane
white chocolate
chocolate
socks
candy cane
white chocolate
chocolate
socks
candy cane
white chocolate
chocolate
```

You can also:

| Do this                                          | With this          |
| ------------------------------------------------ | ------------------ |
| Get substring from _n_ characters onwards        | `${parameter:n}`   |
| Get substring for _x_ characters starting at _n_ | `${parameter:n:x}` |

There! Now our base lists are finished. Let's have some eggnog.

### Testing variables

You know, it may be the eggnog, but I think I started a list for Amy yesterday and stored it in a variable that I might have called `amy`. Let's see if I did. I'll use the `${parameter:?word}` expansion. It'll write `word` to standard error and exit if there's no `amy` parameter.

```sh
echo "${amy:?no such}"

bash: amy: no such
```

I guess not. Maybe it was Brian instead?

```sh
echo "${brian:?no such}"

Lederhosen
```

You can also:

| Do this                                                      | With this            |
| ------------------------------------------------------------ | -------------------- |
| Substitute `word` if `parameter` is unset or null            | `${parameter:-word}` |
| Substitute `word` if `parameter` is not unset or null        | `${parameter:+word}` |
| Assign `word` to `parameter` if `parameter` is unset or null | `${parameter:=word}` |

### Changing case

That's right! Brian said he wanted some lederhosen and so I made myself a note. This is pretty important, so I'll add it to Brian's list in capital letters with the `${parameter^^pattern}` expansion. The `pattern` part is optional. We're only writing to Brian's list, so I'll just use `>>` instead of `tee -a`.

```sh
echo "${brian^^}" >> Brian.txt

cat Brian.txt

socks
candy cane
white chocolate
chocolate
LEDERHOSEN
```

You can also:

| Do this                     | With this               |
| --------------------------- | ----------------------- |
| Capitalize the first letter | `${parameter^pattern}`  |
| Lowercase the first letter  | `${parameter,pattern}`  |
| Lowercase all letters       | `${parameter,,pattern}` |

### Expanding arrays

You know what, all this gift-listing business is a lot of work. I'm just going to make [an array](https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#Arrays) of things I saw at the store:

```sh
gifts=(sweater gameboy wagon pillows chestnuts hairbrush)
```

I can use substring expansion in the form of `${parameter:offset:length}` to make this simple. I'll add the first two to Amy's list, the middle two to Brian's, and the last two to Charlie's. I'll  use `printf` to help with newlines.

```sh
printf '%s\n' "${gifts[@]:0:2}" >> Amy.txt
printf '%s\n' "${gifts[@]:2:2}" >> Brian.txt
printf '%s\n' "${gifts[@]: -2}" >> Charlie.txt
```

```sh
cat Amy.txt

socks
candy cane
white chocolate
chocolate
sweater
gameboy

cat Brian.txt

socks
candy cane
white chocolate
chocolate
LEDERHOSEN
wagon
pillows

cat Charlie.txt

socks
candy cane
white chocolate
chocolate
chestnuts
hairbrush
```

There! Now we've got a comprehensive set of super personalized gift lists. Thanks Bash! Too bad it can't do the shopping for us, too.
