# [Victoria.dev](https://victoria.dev)

Oh, hello there! You're behind-the-scenes at [victoria.dev](https://victoria.dev).

## How this works

For more details on how I built the site, see [About this site](https://victoria.dev/site/).

A GitHub Action handles continuous deployment. It runs on a regular schedule and on each push to my `master` branch. It installs the latest version of [Hugo](https://gohugo.io/) in the workflow environment, builds the site, and [publishes](https://github.com/peaceiris/actions-gh-pages) it to GitHub Pages. The site content and theme [are provided](https://github.com/actions/checkout#Checkout-multiple-repos-private) as [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

I wrote another GitHub Action, [link-snitch](https://github.com/victoriadrake/link-snitch), to regularly check my site for broken links. It uses the [Hydra project](https://github.com/victoriadrake/hydra-link-checker), a standard-library-only Python program that crawls a site for broken links.

I use the [pre-commit framework](https://pre-commit.com/) to run [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2) to keep my content tidy.

A [self-documenting Makefile](https://victoria.dev/blog/how-to-create-a-self-documenting-makefile/) helps me work efficiently without having to remember a bunch of command-line flags.

## IndieWeb

See [Make your own independent website](https://victoria.dev/blog/make-your-own-independent-website/).

[Webmentions](https://www.w3.org/TR/2017/REC-webmention-20170112/) are enabled and I've implemented [microformats2](https://microformats.org/wiki/Main_Page) markup. This makes my site compatible with social readers and other IndieWeb sites!

## Contributions

If you find a mistake or bug, I'd love to know so I can fix it! It would be very helpful if you open an issue, or [send me an email](mailto:hello@victoria.dev).

Please note that I do not accept guest blog posts or requests for placing links in posts.

## License

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
