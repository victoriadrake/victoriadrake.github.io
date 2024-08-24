# Content source repository

As a submodule for [victoriadrake/victoriadrake.github.io](https://github.com/victoriadrake/victoriadrake.github.io).

## Shortcodes

Display a data file dynamically (on rebuild):

```md
{{< readfile file=".pre-commit-config.yaml" >}}
```

Caption an image:

```md
{{< figure src="picture.png" class="screenshot" alt="A great picture I drew" caption="A funny caption" >}}
```

## Content management

All long-form blog posts go in the `blog/` section.

Easily create a new post with `make draft`.

* Posts with media have their own folders.
    * The markdown file is at `/date-post-dir-name/index.md`.
    * The URL is built from the post's `:title`.
    * Image files go in the post's root directory (`/date-post-dir-name/`).
    * Image code in the markdown file needs no directory path: `![Alt](picture.png)`
* File naming convention, leading characters:
    * `D` are unfinished drafts.
    * `Q` are queued to be published.
    * Date string, eg `20190408-` have been or will be published on that date.

All short-form posts (micro-blogs) go in `neofeed`.

Easily create a new post with `make a NEW=`... and supply the category.
