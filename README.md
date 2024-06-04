# [Victoria.dev](https://victoria.dev)

Oh, hello there! You're behind-the-scenes at [victoria.dev](https://victoria.dev).

## How this works

For more details on how I built the site, see [About this site](https://victoria.dev/site/).

### Continuous Deployment

A GitHub Action manages continuous deployment by triggering a Netlify build. The site content and theme are [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

### Link Checking

I created another GitHub Action, [link-snitch](https://github.com/victoriadrake/link-snitch), to regularly check my site for broken links. It uses my [Hydra project](https://github.com/victoriadrake/hydra-link-checker), a standard-library-only Python program that crawls a site for broken links.

### Code Quality

I use the [pre-commit framework](https://pre-commit.com/) to run [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2) to keep my content tidy.

### Self-Documenting Makefile

A [self-documenting Makefile](https://victoria.dev/blog/how-to-create-a-self-documenting-makefile/) helps me work efficiently without having to remember a bunch of command-line flags.

## IndieWeb

Learn how to [Make your own independent website](https://victoria.dev/blog/make-your-own-independent-website/).

- **Webmentions**: [Webmentions](https://www.w3.org/TR/2017/REC-webmention-20170112/) are enabled.
- **Microformats2**: I've implemented [microformats2](https://microformats.org/wiki/Main_Page) markup, making my site compatible with social readers and other IndieWeb sites!

## Contributions

If you find a mistake or bug, I'd love to know so I can fix it! Please open an issue.

**Note**: I do not accept guest blog posts or requests for placing links in posts.

## License

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />
This work is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).
