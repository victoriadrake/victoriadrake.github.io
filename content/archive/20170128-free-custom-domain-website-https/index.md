---
title: How I ditched WordPress and set up my custom domain HTTPS site for (almost) free
date: 2017-01-28T13:16:17+07:00

aliases:
    - /verbose/how-i-ditched-wordpress-and-set-up-my-custom-domain-https-site-for-almost-free/
    - /verbose/free-custom-domain-website-https
    - /verbose/how-i-ditched-wordpress-and-set-up-my-custom-domain-https-site-for-almost-free/
    - /blog/how-i-ditched-wordpress-and-set-up-my-custom-domain-https-site-for-almost-free/
description: A guide (for the minimally tech-savvy) to setting up a website with HTTPS using Hugo, Cloudflare and GitHub Pages.
tags:
    
draft: false
categories: ["article"]

wasfeatured:
    - where : url

---

I got annoyed with WordPress.com. While using the service has its pros (like https and a mobile responsive website, and being very visual and beginner-friendly) it's limiting. For someone who's comfortable enough to be tweaking CSS but who's not interested in creating their own theme (or paying upwards of $50 for one), I felt I wasn't really the type of consumer WordPress.com was suited to.

To start with, if you want to remove WordPress advertising and use a custom domain name, it's a minimum of $3 per month. If, like me, the free themes provided aren't just what you're looking for, you're stuck with two choices: buy a theme for $50+, or pay $8.25 per month to do _some_ css customization. I don't know about you, but I feel like there should be a hack for this.

## How I ditched WordPress and got everything I wanted for free

Okay, _almost_ free. You still have to pay [at least $0.99](https://www.tkqlhce.com/click-100268310-14326263) for a domain name.

For those of you technical enough to skip reading a long post, the recipe is this:

1. Buy a {{< namecheap text="custom domain via this Namecheap affiliate link" >}} (Thanks for your support! 😊)
2. Install [Hugo](https://www.gohugo.io/), my favorite static site generator
3. Host with [GitHub Pages](https://pages.github.com/)
4. Put your [custom domain to work with GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-alias-or-aname-record-with-your-dns-provider)
5. ~~Use Cloudflare's free plan~~ [Enforce HTTPS for GitHub Pages](#5-enforce-https-for-github-pages)

Let's do the nitty gritty:

### 1\. Buy a custom domain

This one's pretty simple. Head on over to {{< namecheap text="Namecheap" >}}, [Gandi](https://www.gandi.net), or if you're rolling in dough, [GoDaddy](https://www.godaddy.com/). Find your perfect web address and buy it up.

If it's a personal domain like _yourname.com,_ it's a pretty good idea to pay upfront for five years or even ten years, if you've got the cash. It'll save you the trouble of remembering to renew, allow you to build your personal brand, and prevent someone else from buying up your URL.

If you're just trying out an idea, you can go with a one-year [$0.99 experiment](https://www.tkqlhce.com/click-100268310-14326263). Namecheap also gives you WhoisGuard (domain registration privacy) free for one year.

### 2\. Install Hugo

I'm a big fan of [Hugo](https://www.gohugo.io/) so far. Admittedly, those who feel more comfortable with a visual, WYSIWYG editor may feel like a fish out of water at first. As long as you're not afraid of using command line, though, using Hugo is pretty straightforward. The fact that I have access to all my code is my favorite part. It's only as simple or complicated as I want it to be.

Hugo is open source and free. They've got great documentation, and following their [Quickstart guide](https://gohugo.io/overview/quickstart/) line-by-line will get you set up with your new site in minutes.

If you're not used to the idea of your site existing as files and folders, the basic premise is this: Hugo, along with the themes available, helps you to create all the pages and files that your site needs to run.

Blog posts can be written in Markdown and saved in your `/content/blog/` folder; preferences for your site and theme can be set in the `config.toml` file. After that, generating all your site's pages is as quick and easy as typing the command `hugo --theme=<your theme>`. You'll be able to see a live version of your site in your browser as you're editing it (go to `http://localhost:1313/` in your browser, as described in Step 5) so you're not flying blind.

### 3\. Host with GitHub Pages

If you read to Step 12 of Hugo's Quickstart Guide, you'll see that they even provided instructions for hosting your files on GitHub pages. If you're new to Git, you'll first need to [sign up at GitHub](https://github.com/) and then [set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git). GitHub is a very friendly resource, and you can find a multitude of code examples and guides in connection with it. The [Hello World Guide](https://docs.github.com/en/get-started/quickstart/hello-world) will take you through all you need to know to use GitHub.com.

Once you're comfortable with the way GitHub works generally, setting up a site by following [the guide on GitHub Pages](https://pages.github.com/) is no big deal. If you followed the Hugo Quickstart Guide up to Step 11, you'll want to jump to Step 12 after creating the repository on GitHub.

In case it's not clear, once you set up your new repository on GitHub called _yourusername_.github.io, grab the HTTPS link at the top. From there it's just a few simple commands to create the git repository for your site and push it to your new web address:

```sh
## from yoursite/public folder:
$ git init
$ git remote add origin <paste that https url here!>
$ git add --all
$ git commit -m "Initial commit."
$ git push origin master
```

Have a little celebration - your site is already up at `https://yourusername.github.io`! Now for the pizza-de-resilience: the custom domain.

### 4\. Point your custom domain to GitHub Pages

To set up your site at apex (meaning `yourname.com` will replace `yourusername.github.io`), there's just four steps:

1. [Add your domain to your GitHub Pages site repository](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
2. In your domain registrar's DNS settings, [create A records pointing to GitHub's IP addresses](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)
3. In your domain registrar's DNS settings, create a CNAME record pointing to `yourusername.github.io`
4. Make sure there's a CNAME file in the root directory of your GitHub repository containing `yourname.com` (your custom domain)

### 5\. Enforce HTTPS for GitHub Pages

[GitHub Pages supports HTTPS](https://blog.github.com/2018-05-01-github-pages-custom-domains-https/) through a partnership with [Let's Encrypt](https://letsencrypt.org/)! This greatly simplifies the process of serving your site securely. Just look for this clever checkbox in the Settings of your site's GitHub repository.

![Enforce HTTPS checkbox](custom-domain-https.png#screenshot)

_Why do I need HTTPS anyway?_ For one, it'll [give your site a little boost on Google](http://searchengineland.com/google-starts-giving-ranking-boost-secure-httpsssl-sites-199446/). More importantly, it's fundamental to your website security. You can [learn more about HTTPS and TLS in this post](/blog/what-is-tls-transport-layer-security-encryption-explained-in-plain-english/).

That's pretty much it! If you don't see changes right away, give all your services a lunch hour or so to propogate. Soon your site will be up and running at `https://yourname.com`.

Thanks for reading! If you found this post helpful, there's a lot more where this came from. You can subscribe below to see new posts first.

{{< subscribe >}}
