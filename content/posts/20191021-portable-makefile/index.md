---
title: A portable Makefile for continuous delivery with Hugo and GitHub Pages
date: 2019-10-21T09:09:06-04:00

aliases:
description: My Makefile for building this site, optimizing images, and running my CI/CD GitHub Actions flow.
tags:
    - ci/cd
    - linux
    - terminal
    - websites
image: cover.png
noToc: true
draft: false
categories: ["article"]
---

Fun fact: I first launched this GitHub Pages site 1,018 days ago.

Since then, we've grown together. From early cringe-worthy commit messages, through eighty-six versions of [Hugo](https://gohugo.io/), and up until last week, a less-than-streamlined multi-app continuous integration and deployment (CI/CD) workflow.

If you know me at all, you know I love to automate things. I've been using a combination of AWS Lambda, Netlify, and Travis CI to automatically build and publish this site. My workflow for the task includes:

* Build with [Hugo](https://gohugo.io/) on push to master, and on a schedule (Netlify and Lambda);
* Optimize and resize images (Netlify);
* Test with [HTMLProofer](https://github.com/gjtorikian/html-proofer) (Travis CI); and
* Deploy to my [separate, public, GitHub Pages repository](/blog/two-ways-to-deploy-a-public-github-pages-site-from-a-private-hugo-repository/) (Netlify).

Thanks to the introduction of GitHub Actions, I'm able to do all the above with just one portable [Makefile](https://en.wikipedia.org/wiki/Makefile).

Next week I'll cover my Actions set up; today, I'll take you through the nitty-gritty of my Makefile so you can write your own.

## Makefile portability

[POSIX-standard-flavour Make](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/make.html) runs on every Unix-like system out there. [Make derivatives](https://en.wikipedia.org/wiki/Make_(software)#Derivatives), such as [GNU Make](https://www.gnu.org/software/make/) and several flavours of BSD Make also run on Unix-like systems, though their particular use requires installing the respective program. To write a truly portable Makefile, mine follows the POSIX standard. (For a more thorough summation of POSIX-compatible Makefiles, I found this article helpful: [A Tutorial on Portable Makefiles](https://nullprogram.com/blog/2017/08/20/).) I run Ubuntu, so I've tested the portability aspect using the BSD Make programs `bmake`, `pmake`, and `fmake`. Compatibility with non-Unix-like systems is a little more complicated, since shell commands differ. With derivatives such as Nmake, it's better to write a separate Makefile with appropriate Windows commands.

While much of my particular use case could be achieved with shell scripting, I find Make offers some worthwhile advantages. I enjoy the ease of using variables and [macros](https://en.wikipedia.org/wiki/Make_(software)#Macros), and the modularity of [rules](https://en.wikipedia.org/wiki/Makefile#Rules) when it comes to organizing my steps.

The writing of rules mostly comes down to shell commands, which is the main reason Makefiles are as portable as they are. The best part is that you can do pretty much *anything* in a terminal, and certainly handle all the workflow steps listed above.

## My continuous deployment Makefile

Here's the portable Makefile that handles my workflow. Yes, I put emojis in there. I'm a monster.

```Makefile
.POSIX:
DESTDIR=public
HUGO_VERSION=0.58.3

OPTIMIZE = find $(DESTDIR) -not -path "*/static/*" \( -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' \) -print0 | \
xargs -0 -P8 -n2 mogrify -strip -thumbnail '1000>'

.PHONY: all
all: get_repository clean get build test deploy

.PHONY: get_repository
get_repository:
 @echo "🛎 Getting Pages repository"
 git clone https://github.com/victoriadrake/victoriadrake.github.io.git $(DESTDIR)

.PHONY: clean
clean:
 @echo "🧹 Cleaning old build"
 cd $(DESTDIR) && rm -rf *

.PHONY: get
get:
 @echo "❓ Checking for hugo"
 @if ! [ -x "$$(command -v hugo)" ]; then\
  echo "🤵 Getting Hugo";\
     wget -q -P tmp/ https://github.com/gohugoio/hugo/releases/download/v$(HUGO_VERSION)/hugo_extended_$(HUGO_VERSION)_Linux-64bit.tar.gz;\
  tar xf tmp/hugo_extended_$(HUGO_VERSION)_Linux-64bit.tar.gz -C tmp/;\
  sudo mv -f tmp/hugo /usr/bin/;\
  rm -rf tmp/;\
  hugo version;\
 fi

.PHONY: build
build:
 @echo "🍳 Generating site"
 hugo --gc --minify -d $(DESTDIR)

 @echo "🧂 Optimizing images"
 $(OPTIMIZE)

.PHONY: test
test:
 @echo "🍜 Testing HTML"
 docker run -v $(GITHUB_WORKSPACE)/$(DESTDIR)/:/mnt 18fgsa/html-proofer mnt --disable-external

.PHONY: deploy
deploy:
 @echo "🎁 Preparing commit"
 @cd $(DESTDIR) \
 && git config user.email "hello@victoria.dev" \
 && git config user.name "Victoria via GitHub Actions" \
 && git add . \
 && git status \
 && git commit -m "🤖 CD bot is helping" \
 && git push -f -q https://$(TOKEN)@github.com/victoriadrake/victoriadrake.github.io.git master
 @echo "🚀 Site is deployed!"
```

Sequentially, this workflow:

1. Clones the public Pages repository;
2. Cleans (deletes) the previous build files;
3. Downloads and installs the specified version of Hugo, if Hugo is not already present;
4. Builds the site;
5. Optimizes images;
6. Tests the built site with HTMLProofer, and
7. Prepares a new commit and pushes to the public Pages repository.

If you're familiar with command line, most of this may look familiar. Here are a couple bits that might warrant a little explanation.

### Checking if a program is already installed

I think this bit is pretty tidy:

```sh
if ! [ -x "$$(command -v hugo)" ]; then\
...
fi
```

I use a negated `if` conditional in conjunction with `command -v` to check if an executable (`-x`) called `hugo` exists. If one is not present, the script gets the specified version of Hugo and installs it. [This Stack Overflow answer](https://stackoverflow.com/a/677212) has a nice summation of why `command -v` is a more portable choice than `which`.

### Image optimization

My Makefile uses `mogrify` to batch resize and compress images in particular folders. It finds them automatically using the file extension, and only modifies images that are larger than the target size of 1000px in any dimension. I wrote more about the [batch-processing one-liner in this post](/blog/how-to-quickly-batch-resize-compress-and-convert-images-with-a-bash-one-liner/).

There are a few different ways to achieve this same task, one of which, theoretically, is to take advantage of Make's [suffix rules](https://en.wikipedia.org/wiki/Make_(software)#Suffix_rules) to run commands only on image files. I find the shell script to be more readable.

### Using Dockerized HTMLProofer

HTMLProofer is installed with `gem`, and uses Ruby and [Nokogiri](https://nokogiri.org/tutorials/ensuring_well_formed_markup.html), which adds up to a lot of installation time for a CI workflow. Thankfully, [18F](https://github.com/18F) has a [Dockerized version](https://github.com/18F/html-proofer-docker) that is much faster to implement. Its usage requires starting the container with the built site directory [mounted as a data volume](https://docs.docker.com/storage/volumes/#start-a-container-with-a-volume), which is easily achieved by appending to the `docker run` command.

```sh
docker run -v /absolute/path/to/site/:/mounted-site 18fgsa/html-proofer /mounted-site
```

In my Makefile, I specify the absolute site path using the [default environment variable](https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables) `GITHUB_WORKSPACE`. I'll dive into this and other GitHub Actions features in the next post.

In the meantime, happy Making!
