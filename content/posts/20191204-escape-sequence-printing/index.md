---
title: The surprisingly difficult task of printing newlines in a terminal
date: 2019-12-04T09:17:35-05:00

aliases:
    - /blog/how-to-print-newlines-in-command-line-output/
description: Your guide to string interpolation quirks that confound the best of us.
tags:
    - terminal
    - cybersecurity
image: cover.png
noToc: true
draft: false
categories: ["article"]
---

Surprisingly, getting computers to give humans readable output is no easy feat. With the introduction of [standard streams](https://en.wikipedia.org/wiki/Standard_streams) and specifically standard output, programs gained a way to talk to each other using plain text streams; humanizing and displaying stdout is another matter. Technology throughout the computing age has tried to solve this problem, from the use of [ASCII characters in video computer displays](https://en.wikipedia.org/wiki/Computer_terminal#Early_VDUs) to modern shell commands like `echo` and `printf`.

These advancements have not been seamless. The job of printing output to a terminal is fraught with quirks for programmers to navigate, as exemplified by the deceptively nontrivial task of expanding an [escape sequence](https://en.wikipedia.org/wiki/Escape_sequence) to print newlines. The expansion of the placeholder `\n` can be accomplished in a multitude of ways, each with its own unique history and complications.

## Using `echo`

From its appearance in [Multics](https://en.wikipedia.org/wiki/Multics) to its modern-day Unix-like system ubiquity, `echo` remains a familiar tool for getting your terminal to say "Hello world!" Unfortunately, inconsistent implementations across operating systems make its usage tricky. Where `echo` on some systems will automatically expand escape sequences, others require the `-e` option to do the same:

```sh
echo "the study of European nerves is \neurology"
# the study of European nerves is \neurology

echo -e "the study of European nerves is \neurology"
# the study of European nerves is
# eurology
```

Because of these inconsistencies in implementations, `echo` is considered non-portable. Additionally, its usage in conjunction with user input is relatively easy to corrupt through [shell injection attack](https://en.wikipedia.org/wiki/Code_injection#Shell_injection) using command substitutions.

In modern systems, it is retained only to provide compatibility with the many programs that still use it. The [POSIX specification recommends](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/echo.html#tag_20_37_16) the use of `printf` in new programs.

## Using `printf`

Since 4th [Edition](https://en.wikipedia.org/wiki/Research_Unix#Versions) Unix, the portable [`printf` command](https://en.wikipedia.org/wiki/Printf_(Unix)) has essentially been the new and better `echo`. It allows you to use [format specifiers](https://en.wikipedia.org/wiki/Printf_format_string#Format_placeholder_specification) to humanize input. To interpret backslash escape sequences, use `%b`. The character sequence `\n` ensures the output ends with a newline:

```sh
printf "%b\n" "Many females in Oble are \noblewomen"
# Many females in Oble are
# oblewomen
```

Though `printf` has further options that make it a far more powerful replacement of `echo`, this utility is not foolproof and can be vulnerable to an [uncontrolled format string](https://en.wikipedia.org/wiki/Uncontrolled_format_string) attack. It's important for programmers to ensure they [carefully handle user input](/blog/sql-injection-and-xss-what-white-hat-hackers-know-about-trusting-user-input/).

## Putting newlines in variables

In an effort to improve portability amongst compilers, the [ANSI C Standard](https://en.wikipedia.org/wiki/ANSI_C) was established in 1983. With [ANSI-C quoting](https://www.gnu.org/software/bash/manual/html_node/ANSI_002dC-Quoting.html#ANSI_002dC-Quoting) using `$'...'`, [escape sequences](https://en.wikipedia.org/wiki/Escape_sequences_in_C#Table_of_escape_sequences) are replaced in output according to the standard.

This allows us to store strings with newlines in variables that are printed with the newlines interpreted. You can do this by setting the variable, then calling it with `printf` using `$`:

```sh
puns=$'\number\narrow\nether\nice'

printf "%b\n" "These words started with n but don't make $puns"

# These words started with n but don't make
# umber
# arrow
# ether
# ice
```

The expanded variable is single-quoted, which is passed literally to `printf`. As always, it is important to properly handle the input.

## Bonus round: shell parameter expansion

In my article explaining [Bash and braces](/blog/bash-and-shell-expansions-lazy-list-making/), I covered the magic of [shell parameter expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html). We can use one expansion, `${parameter@operator}`, to interpret escape sequences, too. We use `printf`'s `%s` specifier to print as a string, and the `E` operator will properly expand the escape sequences in our variable:

```sh
printf "%s\n" ${puns@E}

# umber
# arrow
# ether
# ice
```

## The ongoing challenge of humanizing output

[String interpolation](https://en.wikipedia.org/wiki/String_interpolation) continues to be a chewy problem for programmers. Besides getting languages and shells to agree on what certain placeholders mean, properly using the correct escape sequences requires an eye for detail.

Poor string interpolation can lead to silly-looking output, as well as introduce security vulnerabilities, such as from [injection attacks](https://en.wikipedia.org/wiki/Code_injection). Until the next evolution of the terminal has us talking in emojis, we'd best pay attention when printing output for humans.
