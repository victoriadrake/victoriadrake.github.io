---
title: How to do twice as much with half the keystrokes using `.bashrc`
date: 2019-08-21T09:17:02-04:00

aliases:
    - /verbose/how-to-do-twice-as-much-with-half-the-keystrokes-using-.bashrc/
description: An overview of time-saving aliases, functions, and creating a useful Bash prompt.
tags:
    - linux
    - terminal
    - git
image: file.jpg
noToc: true
draft: false
categories: ["article"]
---

In my [recent post about setting up Ubuntu with Bash scripts](/blog/how-to-set-up-a-fresh-ubuntu-desktop-using-only-dotfiles-and-bash-scripts/), I briefly alluded to the magic of `.bashrc`. This didn't really do it justice, so here's a quick post that offers a bit more detail about what the Bash configuration file can do.

My current configuration hugely improves my workflow, and saves me well over 50% of the keystrokes I would have to employ without it! Let's look at some examples of aliases, functions, and prompt configurations that can improve our workflow by helping us be more efficient with fewer key presses.

## Bash aliases

A smartly written `.bashrc` can save a whole lot of keystrokes. You can take advantage of this in the literal sense by using [bash aliases](https://www.gnu.org/software/bash/manual/html_node/Aliases.html), or strings that expand to larger commands. For an indicative example, here is a Bash alias for copying files in the terminal:

```bash
# Always copy contents of directories (r)ecursively and explain (v) what was done
alias cp='cp -rv'
```

The `alias` command defines the string you'll type, followed by what that string will expand to. You can override existing commands like `cp` above. On its own, the `cp` command will only copy files, not directories, and succeeds silently. With this alias, you need not remember to pass those two flags, nor `cd` or `ls` the location of our copied file to confirm that it's there! Now, just those two key presses (for `c` and `d`) will do all of that for us.

Here are a few more `.bashrc` aliases for passing flags with common functions.

```bash
# List contents with colors for file types, (A)lmost all hidden files (without . and ..), in (C)olumns, with class indicators (F)
alias ls='ls --color=auto -ACF'
# List contents with colors for file types, (a)ll hidden entries (including . and ..), use (l)ong listing format, with class indicators (F)
alias ll='ls --color=auto -alF'

# Explain (v) what was done when moving a file
alias mv='mv -v'
# Create any non-existent (p)arent directories and explain (v) what was done
alias mkdir='mkdir -pv'
# Always try to (c)ontinue getting a partially-downloaded file
alias wget='wget -c'
```

Aliases come in handy when you want to avoid typing long commands, too. Here are a few I use when working with Python environments:

```bash
alias pym='python3 manage.py'
alias mkenv='python3 -m venv env'
alias startenv='source env/bin/activate && which python3'
alias stopenv='deactivate'
```

For further inspiration on ways Bash aliases can save time, I highly recommend [the examples in this article](https://www.digitalocean.com/community/tutorials/an-introduction-to-useful-bash-aliases-and-functions).

## Bash functions

One downside of the aliases above is that they're rather static - they'll always expand to exactly the text declared. For a Bash alias that takes arguments, you'll need to create a function. You can do this like so:

```bash
# Show contents of the directory after changing to it
function cd () {
    builtin cd "$1"
    ls -ACF
}
```

I can't begin to tally how many times I've typed `cd` and then `ls` immediately after to see the contents of the directory I'm now in. With this function set up, it all happens with just those two letters! The function takes the first argument, `$1`, as the location to change directory to, then prints the contents of that directory in nicely formatted columns with file type indicators. The `builtin` part is necessary to get Bash to allow us to override this default command.

Bash functions are very useful when it comes to downloading or upgrading software, too.

### Bash function for downloading extended Hugo

Thanks to the static site generator Hugo's excellent ship frequency, I previously spent at least a few minutes every couple weeks [downloading the new extended version](https://github.com/gohugoio/hugo/releases). With a Bash function, I only need to pass in the version number, and the upgrade happens in a few seconds.

```bash
# Hugo install or upgrade
function gethugo () {
    wget -q -P tmp/ https://github.com/gohugoio/hugo/releases/download/v"$@"/hugo_extended_"$@"_Linux-64bit.tar.gz
    tar xf tmp/hugo_extended_"$@"_Linux-64bit.tar.gz -C tmp/
    sudo mv -f tmp/hugo /usr/local/bin/
    rm -rf tmp/
    hugo version
}
```

The `$@` notation simply takes all the arguments given, replacing its spot in the function. To run the above function and download Hugo version 0.57.2, you use the command `gethugo 0.57.2`.

### Bash function for downloading a specific Go version

I've got one for [Golang](https://golang.org/), too:

```bash
function getgolang () {
    sudo rm -rf /usr/local/go
    wget -q -P tmp/ https://dl.google.com/go/go"$@".linux-amd64.tar.gz
    sudo tar -C /usr/local -xzf tmp/go"$@".linux-amd64.tar.gz
    rm -rf tmp/
    go version
}
```

### Bash function for adding a GitLab remote

Or how about a function that adds a remote origin URL for GitLab to the current repository?

```bash
function glab () {
    git remote set-url origin --add git@gitlab.com:"$@"/"${PWD##*/}".git
    git remote -v
}
```

With `glab username`, you can create a new `origin` URL for the current Git repository with our `username` on GitLab.com. Pushing to a new remote URL [automatically creates a new private GitLab repository](/blog/how-to-write-bash-one-liners-for-cloning-and-managing-github-and-gitlab-repositories/#a-bash-one-liner-to-create-and-push-many-repositories-on-gitlab), so this is a useful shortcut for creating backups!

Bash functions are really only limited by the possibilities of scripting, of which there are, practically, few limits. If there's anything you do on a frequent basis that requires typing a few lines into a terminal, you can probably create a Bash function for it!

## Bash prompt

Besides directory contents, it's also useful to see the full path of the directory we're in. The Bash prompt can show us this path, along with other useful information like our current Git branch. To make it more readable, you can define colours for each part of the prompt. Here's how you can set up our prompt in `.bashrc` to accomplish this:

```bash
# Colour codes are cumbersome, so let's name them
txtcyn='\[\e[0;96m\]' # Cyan
txtpur='\[\e[0;35m\]' # Purple
txtwht='\[\e[0;37m\]' # White
txtrst='\[\e[0m\]'    # Text Reset

# Which (C)olour for what part of the prompt?
pathC="${txtcyn}"
gitC="${txtpur}"
pointerC="${txtwht}"
normalC="${txtrst}"

# Get the name of our branch and put parenthesis around it
gitBranch() {
    git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'
}

# Build the prompt
export PS1="${pathC}\w ${gitC}\$(gitBranch) ${pointerC}\$${normalC} "
```

Result:

```bash
~/github/myrepo (master) $
```

Naming the colours helps to easily identify where one colour starts and stops, and where the next one begins. The prompt that you see in our terminal is defined by the string following `export PS1`, with each component of the prompt set with an [escape sequence](https://www.tldp.org/HOWTO/Bash-Prompt-HOWTO/bash-prompt-escape-sequences.html). Let's break that down:

* `\w` displays the current working directory,
* `\$(gitBranch)` calls the `gitBranch` function defined above, which displays the current Git branch,
* `\$` will display a "$" if you are a normal user or in normal user mode, and a "#" if you are root.

The [full list of Bash escape sequences](https://www.gnu.org/software/bash/manual/html_node/Controlling-the-Prompt.html) can help us display many more bits of information, including even the time and date! Bash prompts are highly customizable and individual, so feel free to set it up any way you please.

Here are a few options that put information front and centre and can help us to work more efficiently.

### For the procrastination-averse

Username and current time with seconds, in 24-hour HH:MM:SS format:

```bash
export PS1="${userC}\u ${normalC}at \t >"
```

```bash
user at 09:35:55 >
```

### For those who always like to know where they stand

Full file path on a separate line, and username:

```bash
export PS1="${pathC}\w${normalC}\n\u:"
```

```bash
~/github/myrepo
user:
```

### For the minimalist

```bash
export PS1=">"
```

```bash
>
```

We can build many practical prompts with just the basic escape sequences; once you start to integrate functions with prompts, as in the Git branch example, things can get really complicated. Whether this amount of complication is an addition or a detriment to your productivity, only you can know for sure!

Many fancy Bash prompts are possible with programs readily available with a quick search. I've intentionally not provided samples here because, well, if you can tend to get as excited about this stuff as I can, it might be a couple hours before you get back to what you were doing before you started reading this post, and I just can't have that on my conscience. 🥺

We've hopefully struck a nice balance now between time invested and usefulness gained from our Bash configuration file! I hope you use your newly-recovered keystroke capacity for good.
