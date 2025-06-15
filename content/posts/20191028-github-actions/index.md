---
title: A lightweight, tool-agnostic CI/CD flow with GitHub Actions
date: 2019-10-28T08:28:52-04:00

aliases:
    - /archive/a-lightweight-tool-agnostic-ci/cd-flow-with-github-actions/
description: How to take advantage of a simple GitHub Actions workflow without sacrificing agnostic tooling.
tags:
    - development
    
image: cover.png
 
draft: false
categories: ["article"]
---

Agnostic tooling is the clever notion that you should be able to run your code in various environments. With many continuous integration and continuous development (CI/CD) apps available, agnostic tooling gives developers a big advantage: portability.

Of course, having your CI/CD work *everywhere* is a tall order. Popular [CI apps for GitHub repositories](https://github.com/marketplace/category/continuous-integration) alone use a multitude of configuration languages spanning [Groovy](https://groovy-lang.org/syntax.html), [YAML](https://yaml.org/), [TOML](https://github.com/toml-lang/toml), [JSON](https://json.org/), and more... all with differing syntax, of course. Porting workflows from one tool to another is more than a one-cup-of-coffee process.

The introduction of [GitHub Actions](https://github.com/features/actions) has the potential to add yet another tool to the mix; or, for the right set up, greatly simplify a CI/CD workflow.

Prior to this article, I accomplished my CD flow with several lashed-together apps. I used AWS Lambda to trigger site builds on a schedule. I had Netlify build on push triggers, as well as run image optimization, and then push my site to the public Pages repository. I used Travis CI in the public repository to test the HTML. All this worked in conjunction with GitHub Pages, which actually hosts the site.

I'm now using the GitHub Actions beta to accomplish all the same tasks, with one [portable Makefile](/posts/a-portable-makefile-for-continuous-delivery-with-hugo-and-github-pages/) of build instructions, and without any other CI/CD apps.

## Appreciating the shell

What do most CI/CD tools have in common? They run your workflow instructions in a shell environment! This is wonderful, because that means that most CI/CD tools can do anything that you can do in a terminal... and you can do pretty much *anything* in a terminal.

Especially for a contained use case like building my static site with a generator like Hugo, running it all in a shell is a no-brainer. To tell the magic box what to do, we just need to write instructions.

While a shell script is certainly the most portable option, I use the still-very-portable [Make](https://en.wikipedia.org/wiki/Make_(software)) to write my process instructions. This provides me with some advantages over simple shell scripting, like the use of variables and [macros](https://en.wikipedia.org/wiki/Make_(software)#Macros), and the modularity of [rules](https://en.wikipedia.org/wiki/Makefile#Rules).

I got into the [nitty-gritty of my Makefile in my last post](/posts/a-portable-makefile-for-continuous-delivery-with-hugo-and-github-pages/). Let's look at how to get GitHub Actions to run it.

## Using a Makefile with GitHub Actions

To our point on portability, my magic Makefile is stored right in the repository root. Since it's included with the code, I can run the Makefile locally on any system where I can clone the repository, provided I set the environment variables. Using GitHub Actions as my CI/CD tool is as straightforward as making Make go worky-worky.

I found the [GitHub Actions workflow syntax guide](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions) to be pretty straightforward, though also lengthy on options. Here's the necessary set up for getting the Makefile to run.

The workflow file at `.github/workflows/make-master.yml` contains the following:

```yml
name: make-master

on:
  push:
    branches:
      - master
  schedule:
    - cron: '20 13 * * *'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
        with:
          fetch-depth: 1
      - name: Run Makefile
        env:
          TOKEN: ${{ secrets.TOKEN }}
        run: make all
```

I'll explain the components that make this work.

## Triggering the workflow

Actions support multiple [triggers for a workflow](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows). Using the `on` syntax, I've defined two triggers for mine: a [push event](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushbranchestagsbranches-ignoretags-ignore) to the `master` branch only, and a [scheduled](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule) `cron` job.

Once the `make-master.yml` file is in your repository, either of your triggers will cause Actions to run your Makefile. To see how the last run went, you can also [add a fun badge](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge) to the README.

### One hacky thing

Because the Makefile runs on every push to `master`, I sometimes would get errors when the site build had no changes. When Git, via [my Makefile](/posts/a-portable-makefile-for-continuous-delivery-with-hugo-and-github-pages/), attempted to commit to the Pages repository, no changes were detected and the commit would fail annoyingly:

```txt
nothing to commit, working tree clean
On branch master
Your branch is up to date with 'origin/master'.

nothing to commit, working tree clean
Makefile:62: recipe for target 'deploy' failed
make: *** [deploy] Error 1
##[error]Process completed with exit code 2.
```

I came across some solutions that proposed using `diff` to check if a commit should be made, but this may not work for [reasons](https://github.com/benmatselby/hugo-deploy-gh-pages/issues/4). As a workaround, I simply added the [current UTC time](https://gohugo.io/methods/time/utc/) to my index page so that every build would contain a change to be committed.

## Environment and variables

You can define the [virtual environment](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#supported-runners-and-hardware-resources) for your workflow to run in using the `runs-on` syntax. The ~~obvious best choice~~ one I chose is Ubuntu. Using `ubuntu-latest` gets me the most updated version, whatever that happens to be when you're reading this.

GitHub sets some [default environment variables](https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables) for workflows. The [`actions/checkout` action](https://github.com/actions/checkout) with `fetch-depth: 1` creates a copy of just the most recent commit your repository in the `GITHUB_WORKSPACE` variable. This allows the workflow to access the Makefile at `GITHUB_WORKSPACE/Makefile`. Without using the checkout action, the Makefile won't be found, and I get an error that looks like this:

```txt
make: *** No rule to make target 'all'.  Stop.
Running Makefile
##[error]Process completed with exit code 2.
```

While there is a [default `GITHUB_TOKEN` secret](https://docs.github.com/en/actions/security-guides/automatic-token-authentication), this is not the one I used. The default is only locally scoped to the current repository. To be able to push to my separate GitHub Pages repository, I created a [personal access token](https://github.com/settings/tokens) scoped to `public_repo` and pass it in as the `secrets.TOKEN` encrypted variable. For a step-by-step, see [Creating and using encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

## Portable tooling

The nice thing about using a simple Makefile to define the bulk of my CI/CD process is that it's completely portable. I can run a Makefile anywhere I have access to an environment, which is most CI/CD apps, virtual instances, and, of course, on my local machine.

One of the reasons I like GitHub Actions is that getting my Makefile to run was pretty straightforward. I think the syntax is well done - easy to read, and intuitive when it comes to finding an option you're looking for. For someone already using GitHub Pages, Actions provides a pretty seamless CD experience; and if that should ever change, I can run my Makefile elsewhere. ¯\\\_(ツ)\_/¯
