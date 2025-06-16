---
title: How to set up a fresh Ubuntu desktop using only dotfiles and bash scripts
date: 2019-08-19T07:58:18-04:00

aliases:
    - /verbose/how-to-set-up-a-fresh-ubuntu-desktop-using-only-dotfiles-and-bash-scripts/
    - /blog/how-to-set-up-a-fresh-ubuntu-desktop-using-only-dotfiles-and-bash-scripts/
description: Configure settings, install programs, and customize your desktop environment with a single bash command.
tags:
draft: false
categories: ["article"]
---

One of my most favorite things about open source files on GitHub is the ability to see how others do (what some people might call) mundane things, like set up their `.bashrc` and other dotfiles. While I'm not as enthusiastic about ricing as I was when I first came to the Linux side, I still get pretty excited when I find a config setting that makes things prettier and faster, and thus, better.

I recently came across a few such things, particularly in [Tom Hudson's](https://github.com/tomnomnom) dotfiles. Tom seems to like to script things, and some of those things include automatically setting up symlinks, and installing Ubuntu repository applications and other programs. This got me thinking. Could I automate the set up of a new machine to replicate my current one?

Being someone generally inclined to take things apart in order to see how they work, I know I've messed up my laptop on occasion. (Usually when I'm away from home, and my backup hard drive isn't.) On those rare but really inconvenient situations when my computer becomes a shell of its former self, (ba-dum-ching) it'd be quite nice to have a fast, simple way of putting Humpty Dumpty back together again, just the way I like.

In contrast to creating a [disk image and restoring it later](https://askubuntu.com/questions/19901/how-to-make-a-disk-image-and-restore-from-it-later), a collection of bash scripts is easier to create, maintain, and move around. They require no special utilities, only an external transportation method. It's like passing along the recipe, instead of the whole bundt cake. (Mmm, cake.)

Additionally, functionality like this would be super useful when setting up a virtual machine, or VM, or even just a virtual private server, or VPS. (Both of which, now that I write this, would probably make more forgiving targets for my more destructive experiments... live and learn!)

Well, after some grepping and Googling and digging around, I now have a suite of scripts that can do this:

<video controls="controls" poster="cover.jpg">
    <source src="setup.mp4" type="video/mp4" />
</video>

This is the tail end of a test run of the set up scripts on a fresh Ubuntu desktop, loaded off a bootable USB. It had all my programs and settings restored in under three minutes!

This post will cover how to achieve the automatic set up of a computer running Ubuntu Desktop using bash scripts. This exact process was last used on Ubuntu 19.10; see my [dotfiles master branch](https://github.com/victoriadrake/dotfiles) for the latest configuration. The majority of the information covered is applicable to all the Linux desktop flavours, though some syntax may differ. The bash scripts cover three main areas: linking dotfiles, installing software from Ubuntu and elsewhere, and setting up the desktop environment. We'll cover each of these areas and go over the important bits so that you can begin to craft your own scripts.

## Dotfiles

Dotfiles are what most Linux enthusiasts call configuration files. They typically live in the user's home directory (denoted in bash scripts with the [builtin](https://www.tldp.org/LDP/abs/html/internal.html#BUILTINREF) variable `$HOME`) and control the appearance and behavior of all kinds of programs. The file names begin with `.`, which denotes hidden files in Linux (hence "dot" files). Here are some common dotfiles and ways in which they're useful.

### `.bashrc`

The `.bashrc` file is a list of commands executed at startup by interactive, non-login shells. [Interactive vs non-interactive shells](https://www.tldp.org/LDP/abs/html/intandnonint.html) can be a little confusing, but aren't necessary for us to worry about here. For our purposes, any time you open a new terminal, see a prompt, and can type commands into it, your `.bashrc` was executed.

Lines in this file can help improve your workflow by creating aliases that reduce keystrokes, or by displaying a helpful prompt with useful information. It can even run user-created programs, like [Eddie](https://github.com/victoriadrake/eddie-terminal). For more ideas, you can have a look at [my `.bashrc` file on GitHub](https://github.com/victoriadrake/dotfiles/blob/ubuntu-19.10/.bashrc).

### `.vimrc`

The `.vimrc` dotfile configures the champion of all text editors, [Vim](https://www.vim.org/about.php). (If you haven't yet wielded the powers of the keyboard shortcuts, I highly recommend [a fun game to learn Vim with](https://vim-adventures.com/).)

In `.vimrc`, we can set editor preferences such as display settings, colours, and custom keyboard shortcuts. You can take a look at [my `.vimrc` on GitHub](https://github.com/victoriadrake/dotfiles/blob/ubuntu-19.10/.vimrc).

Other dotfiles may be useful depending on the programs you use, such as `.gitconfig` or `.tmux.conf`. Exploring dotfiles on GitHub is a great way to get a sense of what's available and useful to you!

## Linking dotfiles

We can use a script to create symbolic links, or [symlinks](https://en.wikipedia.org/wiki/Symbolic_link#POSIX_and_Unix-like_operating_systems) for all our dotfiles. This allows us to keep all the files in a central repository, where they can easily be managed, while also providing a sort of placeholder in the spot that our programs expect the configuration file to be found. This is typically, but not always, the user home directory. For example, since I store my dotfiles on GitHub, I keep them in a directory with a path like `~/github/dotfiles/` while the files themselves are symlinked, resulting in a path like `~/.vimrc`.

To programmatically check for and handle any existing files and symlinks, then create new ones, we can use [this elegant shell script](https://github.com/victoriadrake/dotfiles/blob/ubuntu-19.10/scripts/symlink.sh). I compliment it only because I blatantly stole the core of it from [Tom's setup script](https://github.com/tomnomnom/dotfiles/blob/master/setup.sh), so I can't take the credit for how lovely it is.

The `symlink.sh` script works by attempting to create symlinks for each dotfile in our `$HOME`. It first checks to see if a symlink already exists, or if a regular file or directory with the same name exists. In the former case, the symlink is removed and remade; in the latter, the file or directory is renamed, then the symlink is made.

## Installing software

One of the beautiful things about exploring shell scripts is discovering how much can be achieved using only the command line. As someone whose first exposure to computers was through a graphical operating system, I find working in the terminal to be refreshingly fast.

With Ubuntu, most programs we likely require are available through the default Ubuntu software repositories. We typically search for these with the command `apt search <program>` and install them with `sudo apt install <program>`. Some software we'd like may not be in the default repositories, or may not be offered there in the most current version. In these cases, we can still install these programs in Ubuntu using a [PPA, or Personal Package Archive](https://en.wikipedia.org/wiki/Ubuntu#Package_Archives). We'll just have to be careful that the PPAs we choose are from the official sources.

If a program we'd like doesn't appear in the default repositories or doesn't seem to have a PPA, we may still be able to install it via command line. A quick search for "<program> installation command line" should get some answers.

Since bash scripts are just a collection of commands that we could run individually in the terminal, creating a script to install all our desired programs is as straightforward as putting all the commands into a script file. I chose to organize my installation scripts between the default repositories, which are installed by [my `aptinstall.sh` script](https://github.com/victoriadrake/dotfiles/blob/ubuntu-19.10/scripts/aptinstall.sh), and programs that involve external sources, handled with [my `programs.sh` script](https://github.com/victoriadrake/dotfiles/blob/ubuntu-19.10/scripts/programs.sh).

## Setting up the desktop environment

On the recent occasions when I've gotten a fresh desktop (intentionally or otherwise) I always seem to forget how long it takes to remember, find, and then change all the desktop environment settings. Keyboard shortcuts, workspaces, sound settings, night mode... it adds up!

Thankfully, all these settings have to be stored somewhere in a non-graphical format, which means that if we can discover how that's done, we can likely find a way to easily manipulate the settings with a bash script. Lo and behold the terminal command, `gsettings list-recursively`.

There are a heck of a lot of settings for GNOME desktop environment. We can make the list easier to scroll through (if, like me, you're sometimes the type of person to say "Just let me look at everything and figure out what I want!") by piping to `less`: `gsettings list-recursively | less`. Alternatively, if we have an inkling as to what we might be looking for, we can use `grep`: `gsettings list-recursively | grep 'keyboard'`.

We can manipulate our settings with the `gsettings set` command. It can sometimes be difficult to find the syntax for the setting we want, so when we're first building our script, I recommend using the GUI to make the changes, then finding the `gsettings` line we changed and recording its value.

For some inspiration, you can view [my `desktop.sh` settings script on GitHub](https://github.com/victoriadrake/dotfiles/blob/ubuntu-19.10/scripts/desktop.sh).

## Putting it all together

Having modular scripts (one for symlinks, two for installing programs, another for desktop settings) is useful for both keeping things organized and for being able to run some but not all of the automated set up. For instance, if I were to set up a VPS in which I only use the command line, I wouldn't need to bother with installing graphical programs or desktop settings.

In cases where I do want to run all the scripts, however, doing so one-by-one is a little tedious. Thankfully, since bash scripts can themselves be run by terminal commands, we can simply write another master script to run them all!

Here's my master script to handle the set up of a new Ubuntu desktop machine:

```bash
#!/bin/bash

./symlink.sh
./aptinstall.sh
./programs.sh
./desktop.sh

## Get all upgrades
sudo apt upgrade -y

## See our bash changes
source ~/.bashrc

## Fun hello
figlet "... and we're back!" | lolcat
```

I threw in the upgrade line for good measure. It will make sure that the programs installed on our fresh desktop have the latest updates. Now a simple, single bash command will take care of everything!

You may have noticed that, while our desktop now looks and runs familiarly, these scripts don't cover one very important area: our files. Hopefully, you have a back up method for those that involves some form of reliable external hardware. If not, and if you tend to put your work in external repository hosts like GitHub or GitLab, I do have a way to [automatically clone and back up your GitHub repositories with bash one-liners](/posts/how-to-write-bash-one-liners-for-cloning-and-managing-github-and-gitlab-repositories/).

Relying on external repository hosts doesn't offer 100% coverage, however. Files that you wouldn't put in an externally hosted repository (private or otherwise) consequently can't be pulled. Git ignored objects that can't be generated from included files, like private keys and secrets, will not be recreated. Those files, however, are likely small enough that you could fit a whole bunch on a couple encrypted USB flash drives (and if you don't have private key backups, maybe you ought to do that first?).

That said, I hope this post has given you at least some inspiration as to how dotfiles and bash scripts can help to automate setting up a fresh desktop. If you come up with some settings you find useful, please help others discover them by sharing your dotfiles, too!
