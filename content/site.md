---
title: "About this site"
layout: page
---

Victoria.dev is wholly created and owned by me, Victoria Drake. I research, write, illustrate, design, code, and ship everything you’ll see here.

## Static site generator

I use a static site generator, [Hugo](https://gohugo.io/), to build the site, and GitHub Actions to continually deploy to GitHub Pages.

It's all [open source](https://github.com/victoriadrake/victoriadrake.github.io), so feel free to see for yourself!

## Theme

The theme based on my [Hugo theme, Quint](https://github.com/victoriadrake/hugo-theme-quint).

## Illustrations

I draw the all the illustrations and comics you'll find in my articles using my iPad.

## Searching

I use [Lunr](https://lunrjs.com/) to implement the search feature you see on my [blog page](/blog). [Here's how](/blog/add-search-to-hugo-static-sites-with-lunr/).

## My development tools

I run a GitHub Action I wrote, [link-snitch](https://github.com/victoriadrake/link-snitch), to ensure all the links on my {{< pages >}} pages are working. It uses [Hydra](https://github.com/victoriadrake/hydra-link-checker), my multithreaded Python site-crawling link checker.

Besides creating new posts, a static site like this one is low-maintenance. Most of my development needs are met with a [self-documenting Makefile](/blog/how-to-create-a-self-documenting-makefile/).

<sub>There may or may not be secret pages and easter eggs.</sub>
