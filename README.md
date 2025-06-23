# What's All This?

Welcome to [victoria.dev](https://victoria.dev), a personal website wholly created and owned by me, Victoria Drake. I've produced everything you see on the site—from research and writing to illustrations, design, code, and deployment.

The site is [open source](https://github.com/victoriadrake/victoriadrake.github.io), so feel free to explore how it works!

## Technical Features

- **Static Site Generation**: Built with [Hugo](https://gohugo.io/) for speed and flexibility.
- **Search Functionality**: Implemented using `lunrjs`. [Learn how here](https://victoria.dev/posts/add-search-to-hugo-static-sites-with-lunr/).
- **Illustrations**: I create all the illustrations and comics in my articles on my iPad.
- **IndieWeb Integration**: I've implemented [microformats2](https://microformats.org/wiki/Main_Page) markup, making the site compatible with social readers and other IndieWeb sites.

## Continuous Deployment

The site is automatically deployed with each update using GitHub Pages and GitHub Actions.

## Development Tools

- **Link Checking**: I created [link-snitch](https://github.com/victoriadrake/link-snitch), a custom GitHub Action, to regularly check for broken links across the site. It's powered by [Hydra](https://github.com/victoriadrake/hydra-link-checker), a multithreaded Python site-crawling link checker built with the standard library.
- **Code Quality**: I use the [pre-commit framework](https://pre-commit.com/) with [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2) to maintain content quality.
- **Self-Documenting Makefile**: A [self-documenting Makefile](https://victoria.dev/posts/how-to-create-a-self-documenting-makefile/) helps streamline development workflows without having to remember command-line flags.

## Contributions

If you find a mistake or bug, please open an issue so it can be fixed!

I don't accept guest blog posts or requests for placing links in posts.

## License

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />
This work is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

---

<sub>There may or may not be secret pages and easter eggs on the site.</sub>
