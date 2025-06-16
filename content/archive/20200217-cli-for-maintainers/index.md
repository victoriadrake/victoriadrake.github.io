---
title: Command line tricks for managing your messy open source repository
date: 2020-02-17T08:05:06-05:00

aliases:
description: A handy toolbox for the terminal to help open source maintainers make their projects sparkle.
tags:
    
    
    - open-source
image: cover.png
 
draft: false
categories: ["article"]
---

Effective collaboration, especially in open source software development, starts with effective organization. To make sure that nothing gets missed, the general rule, "one issue, one pull request" is a nice rule of thumb.

Instead of opening an issue with a large scope like, "Fix all the broken links in the documentation," open source projects will have more luck attracting contributors with several smaller and more manageable issues. In the preceding example, you might scope broken links by section or by page. This allows more contributors to jump in and dedicate small windows of their time, rather than waiting for one person to take on a larger and more tedious contribution effort.

Smaller scoped issues also help project maintainers see where work has been completed and where it hasn't. This reduces the chances that some part of the issue is missed, assumed to be completed, and later leads to bugs or security vulnerabilities.

That's all well and good; but what if you've already opened several massively-scoped issues, some PRs have already been submitted or merged, and you currently have no idea where the work started or stopped?

It's going to take a little sorting out to get the state of your project back under control. Thankfully, there are a number of command line tools to help you scan, sort, and make sense of a messy repository. Here's a small selection of ones I use.

Jump to:

- [Interactive search-and-replace with `vim`](#interactive-search-and-replace-with-vim)
- [Find dead links in Markdown files with a node module](#find-dead-links-in-markdown-files-with-a-node-module)
- [List subdirectories with or without a git repository with `find`](#list-subdirectories-with-or-without-a-git-repository-with-find)
- [Pull multiple git repositories from a list with `xargs`](#pull-multiple-git-repositories-from-a-list-with-xargs)
- [List issues by number with `jot`](#list-issues-by-number-with-jot)
- [CLI-powered open source organization](#cli-powered-open-source-organization)

## Interactive search-and-replace with `vim`

You can open a file in Vim, then interactively search and replace with:

```vim
:%s/\<word\>/newword/gc
```

The `%` indicates to look in all lines of the current file; `s` is for substitute; `\<word\>` matches the whole word; and the `g` for "global" is for every occurrence. The `c` at the end will let you view and confirm each change before it's made. You can run it automatically, and much faster, without `c`; however, you put yourself at risk of complicating things if you've made a pattern-matching error.

## Find dead links in Markdown files with a node module

The [markdown-link-check](https://github.com/tcort/markdown-link-check) node module has a great [CLI buddy](https://github.com/tcort/markdown-link-check#command-line-tool).

I use this so often I turned it into a [Bash alias function](/blog/how-to-do-twice-as-much-with-half-the-keystrokes-using-.bashrc/#bash-functions). To do the same, add this to your `.bashrc`:

```sh
# Markdown link check in a folder, recursive
function mlc () {
    find $1 -name \*.md -exec markdown-link-check -p {} \;
}
```

Then run with `mlc <filename>`.

## List subdirectories with or without a git repository with `find`

Print all subdirectories that are git repositories, or in other words, have a `.git` in them:

```sh
find . -maxdepth 1 -type d -exec test -e '{}/.git' ';' -printf "is git repo: %p\n"
```

To print all subdirectories that are not git repositories, negate the test with `!`:

```sh
find . -maxdepth 1 -type d -exec test '!' -e '{}/.git' ';' -printf "not git repo: %p\n"
```

## Pull multiple git repositories from a list with `xargs`

I initially used this as part of [automatically re-creating my laptop with Bash scripts](/blog/how-to-set-up-a-fresh-ubuntu-desktop-using-only-dotfiles-and-bash-scripts/), but it's pretty handy when you're working with cloud instances or Dockerfiles.

Given a file, `repos.txt` with a repository’s SSH link on each line (and your SSH keys set up), run:

```sh
xargs -n1 git clone < repos.txt
```

If you want to pull and push many repositories, I previously wrote about [how to use a Bash one-liner to manage your repositories](/posts/how-to-write-bash-one-liners-for-cloning-and-managing-github-and-gitlab-repositories/).

## List issues by number with `jot`

I'm a co-author and maintainer for the [OWASP Web Security Testing Guide](https://github.com/OWASP/wstg/) repository where I recently took one large issue (yup, it was "Fix all the broken links in the documentation" - how'd you guess?) and broke it up into several smaller, more manageable issues. A whole thirty-seven smaller, more manageable issues.

I wanted to enumerate all the issues that the original one became, but the idea of typing out thirty-seven issue numbers (#275 through #312) seemed awfully tedious and time-consuming. So, in natural programmer fashion, I spent the same amount of time I would have used to type out all those numbers and crafted a way to automate it instead.

The `jot` utility (`apt install athena-jot`) is a tiny tool that's a big help when you want to print out some numbers. Just tell it how many you want, and where to start and stop.

```sh
# jot [ reps [ begin [ end ] ] ]
jot 37 275 312
```

This prints each number, inclusively, from 275 to 312 on a new line. To make these into issue number notations that GitHub and many other platforms automatically recognize and turn into links, you can pipe the output to `awk`.

```sh
jot 37 275 312 | awk '{printf "#"$0", "}'

#275, #276, #277, #278, #279, #280, #281, #282, #283, #284, #285, #286, #287, #288, #289, #290, #291, #292, #293, #295, #296, #297, #298, #299, #300, #301, #302, #303, #304, #305, #306, #307, #308, #309, #310, #311, #312
```

You can also use `jot` to generate random or redundant data, mainly for development or testing purposes.

## CLI-powered open source organization

A well-organized open source repository is a well-maintained open source project. Save this post for handy reference, and use your newfound CLI superpowers for good! 🚀
