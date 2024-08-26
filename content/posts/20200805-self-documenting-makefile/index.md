---
title: "How to create a self-documenting Makefile"
date: 2020-08-05T08:55:19-04:00

aliases:
    - /blog/self-documenting-devops-make-it-better/
    - /archive/how-to-create-a-self-documenting-makefile/
description: Accelerate your workflow and DevOps with command-line aliases you can check in
tags:
    - coding
    - ci/cd
    - docs
    - leadership
image: cover.png
noToc: true
draft: false
categories: ["article"]
featured: true
---

My new favorite way to completely underuse a Makefile? Creating personalized, per-project repository workflow command aliases that you can check in.

Can a Makefile improve your DevOps and keep developers happy? How awesome would it be if a new developer working on your project didn't start out by copying and pasting commands from your README? What if instead of:

```sh
pip3 install pipenv
pipenv shell --python 3.8
pipenv install --dev
npm install
pre-commit install --install-hooks
# look up how to install Framework X...
# copy and paste from README...
npm run serve
```

... you could just type:

```sh
make start
```

...and then start working?

## Making a difference

I use `make` every day to take the tedium out of common development activities like updating programs, installing dependencies, and testing. To do all this with a Makefile (GNU make), we use [Makefile rules](https://www.gnu.org/software/make/manual/make.html#Rules) and [recipes](https://www.gnu.org/software/make/manual/make.html#Recipes). Similar parallels exist for POSIX flavor make, like [Target Rules](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/make.html#tag_20_76_13_04); here's a [great article](https://nullprogram.com/blog/2017/08/20/) on POSIX-compatible Makefiles.

Here's some examples of things we can `make` easier (sorry):

```Makefile
update: ## Do apt upgrade and autoremove
    sudo apt update && sudo apt upgrade -y
    sudo apt autoremove -y

env:
    pip3 install pipenv
    pipenv shell --python 3.8

install: ## Install or update dependencies
    pipenv install --dev
    npm install
    pre-commit install --install-hooks

serve: ## Run the local development server
    hugo serve --enableGitInfo --disableFastRender --environment development

initial: update env install serve ## Install tools and start development server
```

Now we have some command-line aliases that you can check in! Great idea! If you're wondering what's up with that weird `##` comment syntax, it gets better.

## A self-documenting Makefile

Aliases are great, if you remember what they all are and what they do without constantly typing `cat Makefile`. Naturally, you need a `help` command:

```Makefile
.PHONY: help
help: ## Show this help
    @egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
```

With a little command-line magic, this `egrep` command takes the output of `MAKEFILE_LIST`, sorts it, and uses `awk` to find strings that follow the `##` pattern. It then prints a helpful formatted version of the comments.

We'll put it at the top of the file so it's the default target. Now to see all our handy shortcuts and what they do, we just run `make`, or `make help`:

```text
help                 Show this help
initial              Install tools and start development server
install              Install or update dependencies
serve                Run the local development server
update               Do apt upgrade and autoremove
```

Now we have our very own personalized and project-specific CLI tool!

The possibilities for improving your DevOps flow with a self-documenting Makefile are almost endless. You can use one to simplify any workflow and produce some very happy developers.

Please enjoy the (live!) Makefile I use to manage and develop this Hugo site. I hope it inspires you!

<details>
<summary>My Hugo site Makefile</summary>

```Makefile
{{% md %}}
{{< readfile file="Makefile" >}}
{{% /md %}}
```

</details>
