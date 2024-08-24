---
title: Look mom, I'm a GitHub Action Hero
date: 2020-06-27T09:06:33-04:00

aliases:
description: The GitHub blog interviews me for their GitHub Action Hero series.
tags:
    - ci/cd
    - open-source
    - cybersecurity
    - life
    - coding
    - terminal
    - api
image: cover.PNG
noToc: true
draft: false
categories: ["article"]
---

GitHub recently interviewed me for their blog editorial entitled [GitHub Action Hero: Victoria Drake](https://github.blog/2020-06-26-github-action-hero-victoria-drake/). Here's a behind-the-scenes peek at the original interview questions and my answers.

## What is the name of your Action? Please include a link too.

Among the several Actions I've built, I have two current favorites. One is [hugo-remote](https://github.com/victoriadrake/hugo-remote), which lets you continuously deploy a Hugo static site from a private source repository to a public GitHub Pages repository. This keeps the contents of the source repository private, such as your unreleased drafts, while still allowing you to have a public open source site using GitHub Pages.

The second is [django-security-check](https://github.com/victoriadrake/django-security-check). It's an effortless way to continuously check that your production Django application is free from a variety of security misconfigurations. You can think of it as your little CI/CD helper for busy projects -- a security linter!

## Tell us a little bit more about yourself—how did you get started in software tools?

When I was a kid, I spent several summer vacations coding a huge medieval fantasy world MUD (Multi-User Dungeon, like a multiplayer role-playing game) written in LPC, with friends. It was entirely text-based, and built and played via Telnet. I fell in love with the terminal and learned a lot about object-oriented programming and prototype-based programming early on.

I became a freelance developer and had the privilege of working on a wide variety of client projects. Realizing the difficulty that companies have with hiring experienced developers, I built [ApplyByAPI.com](https://ApplyByAPI.com) to help. As you might imagine, it allows candidates to apply for jobs via API, instead of emailing a resume. It's based on the Django framework, so in the process, I learned even more about building reusable units of software.

When I became a co-author and a core maintainer for the [Open Web Application Security Project (OWASP) Web Security Testing Guide (WSTG)](https://github.com/OWASP/wstg), I gained an even broader appreciation for how a prototype-based, repeatable approach can help build secure web applications. Organizations worldwide consider the WSTG the foremost open source resource for testing the security of web applications. We've applied this thinking via the use of GitHub Actions in our repository -- I'll tell you more about that later.

Whether I'm creating an open source tool or leading a development team, my childhood experience still informs how I think about programming today. I strive to create repeatable units of software like GitHub Actions -- only now, I make them for large enterprises in the real world!

## What is the story behind your built GitHub Action? (Why did you build this?)

Developers take on a lot of responsibility when it comes to building secure applications these days. I'm a full-time senior software developer at a cybersecurity company. I've found that I'm maximally productive when I create systems and processes that help myself and my team make desired outcomes inevitable. So I spend my free time building tools that make it easy for other developers to build secure software as well. My Actions help to automate contained, repeatable units of work that can make a big difference in a developer's day.

## Do you have future plans for this or other Actions?

Yes! I'm always finding ways for tools like GitHub Actions to boost the velocity of technical teams, whether at work or in my open source projects. Remember the Open Web Application Security Project? In the work I've lead with OWASP, I've championed the effort to increase automation using GitHub Actions to maintain quality, securely deploy new versions to the web, and even build PDFs of the WSTG. We're constantly looking into new ways that GitHub Actions can make our lives easier and our readers' projects more secure.

## What has been your favorite feature of GitHub Actions?

I like that I can build an Action using familiar and portable technologies, like Docker. Actions are easy for collaborators to work on too, since in the case of a Dockerized Action, you can use any language your team is comfortable with. This is especially useful in large organizations with polyglot teams and environments. There aren't any complicated dependencies for running these portable tasks, and you don't need to learn any special frameworks to get started.

One of my first blog posts about GitHub Actions even describes how I used an Action to run a Makefile! This is especially useful for large legacy applications that want to modernize their pipeline by using GitHub Actions.

## What are the biggest challenges you’ve faced while building your GitHub Action?

The largest challenge of GitHub Actions isn't really in GitHub Actions, but in the transition of legacy software and company culture.

Migrating legacy software is always challenging, particularly with large legacy applications. Moving to modern CI/CD processes requires changes at the software level, team level, and even a shift in thinking when it comes to individual developers. It can help to have a tool like GitHub Actions, which is at once seamlessly modern and familiar, when transitioning legacy code to a modern pipeline.

## Anything else you would like to share about your experience? Any stories or lessons learned through building your Action?

I'm happiest when I'm solving a challenge that makes developing secure software less challenging in the future, both for myself and for the technology organization I'm leading. With tools like GitHub Actions, a lot of mental overhead can be offloaded to automatic processes -- like getting a whole other brain, for free! This can massively help organizations that are ready to scale up their development output.

In the realm of cybersecurity, not only does creating portable and reusable software make developers' lives easier, it helps to make whole workflows repeatable, which in turn makes software development processes more secure. With smart processes in place, technical teams are happier. As an inevitable result, they'll build better software for customers, too.
