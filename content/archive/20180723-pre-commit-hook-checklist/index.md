---
title: An automatic interactive pre-commit checklist, in the style of infomercials
date: 2018-07-23T09:38:09-04:00

aliases:
    - /verbose/interactive-pre-commit-hook-checklist
    - /verbose/an-automatic-interactive-pre-commit-checklist-in-the-style-of-infomercials/
description: How to set up an interactive checklist using a Git pre-commit hook script.
tags:
    - git
    - coding
    - terminal
image: precommit-infomercial.png
 
draft: false
categories: ["article"]

wasfeatured:
    - The 7 Most Popular DEV Posts from the Past Week : https://dev.to/devteam/the-7-most-popular-dev-posts-from-the-past-week-3li6
---

What's that, you say? You've become tired of regular old boring _paper checklists?_ Well, my friend, today is your lucky day! You, yes, _you,_ can become the proud owner of a brand-spanking-new _automatic interactive pre-commit hook checklist!_ You're gonna love this! Your life will be so much easier! Just wait until your friends see you.

## What's a pre-commit hook

Did you know that nearly _1 out of 5 coders_ are too embarrassed to ask this question? Don't worry, it's perfectly normal. In the next 60 seconds we'll tell you all you need to know to pre-commit with confidence.

A [Git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) is a feature of Git that triggers custom scripts at useful moments. They can be used for all kinds of reasons to help you automate your work, and best of all, you already have them! In every repository that you initialize with `git init`, you'll have a set of example scripts living in `.git/hooks`. They all end with `.sample` and activating them is as easy as renaming the file to remove the `.sample` part.

Git hooks are not copied when a repository is cloned, so you can make them as personal as you like.

The useful moment in particular that we'll talk about today is the _pre-commit_. This hook is run after you do `git commit`, and before you write a commit message. Exiting this hook with a non-zero status will abort the commit, which makes it extremely useful for last-minute quality checks. Or, a bit of fun. Why not both!

## How do I get a pre-commit checklist

I only want the best for my family and my commits, and that's why I choose an interactive pre-commit checklist. Not only is it fun to use, it helps to keep my projects safe from unexpected off-spec mistakes!

It's so easy! I just write a bash script that can read user input, and plop it into `.git/hooks` as a file named `pre-commit`. Then I do `chmod +x .git/hooks/pre-commit` to make it executable, and I'm done!

Oh look, here comes an example bash script now!

```sh
#!/bin/sh

echo "Would you like to play a game?"

# Read user input, assign stdin to keyboard
exec < /dev/tty

while read -p "Have you double checked that only relevant files were added? (Y/n) " yn; do
    case $yn in
        [Yy] ) break;;
        [Nn] ) echo "Please ensure the right files were added!"; exit 1;;
        * ) echo "Please answer y (yes) or n (no):" && continue;
    esac
done
while read -p "Has the documentation been updated? (Y/n) " yn; do
    case $yn in
        [Yy] ) break;;
        [Nn] ) echo "Please add or update the docs!"; exit 1;;
        * ) echo "Please answer y (yes) or n (no):" && continue;
    esac
done
while read -p "Do you know which issue or PR numbers to reference? (Y/n) " yn; do
    case $yn in
        [Yy] ) break;;
        [Nn] ) echo "Better go check those tracking numbers!"; exit 1;;
        * ) echo "Please answer y (yes) or n (no):" && continue;
    esac
done

exec <&-
```

## Take my money

Don't delay! Take advantage _right now_ of this generous _one-time offer!_ An interactive pre-commit hook checklist can be yours, today, for the low, low price of... free? Wait, who wrote this script?
