---
title: How to replace a string with sed in current and recursive subdirectories
date: 2017-05-06T20:04:53+08:00
lastmod: 2020-11-22T20:04:53+08:00
aliases:
    - /blog/how-to-replace-a-string-with-sed-in-current-and-recursive-subdirectories/
    - /posts/how-to-replace-a-string-in-a-dozen-old-blog-posts-with-one-sed-terminal-command/
    - /archive/how-to-replace-a-string-in-a-dozen-old-blog-posts-with-one-sed-terminal-command/
    - /verbose/replace-string-sed-command
    - /verbose/when-stackoverflow-sed-saves-30mins
    - /verbose/how-to-replace-a-string-in-a-dozen-old-blog-posts-with-one-sed-terminal-command
description: The power to update multiple files with a single command in your terminal.
tags:
    - terminal
image: cover_sed.png
noToc: true
draft: false
categories: ["article"]

wasfeatured:
    - where : url

---

Meet your new friend `sed`. This amazingly powerful terminal tool is here to be totally underused for things like finding and replacing strings in files.

## Update a string in multiple files with `sed`

You've got two levels of intensity to choose from:

- **Non-recursive:** Just the files in my current directory.
- **Recursive:** This directory and all the subdirectories it contains, with *maximum prejudice.*

Here's how!

## Current directory, non-recursive

*Non-recursive* means sed won't change files in any subdirectories of the current folder.

```text
.
├── index.html        # Change this file
└── blog
    ├── list.html     # Don't change
    └── single.html   # these files
```

Run this command to search all the files in your current directory and replace a given string. For example, to replace all occurrences of "foo" with "bar":

```sh
sed -i -- 's/foo/bar/g' *
```

Here's what each component of the command does:

- `-i` will change the original, and stands for "in-place."
- `s` is for substitute, so we can find and replace.
- `foo` is the string we'll be taking away,
- `bar` is the string we'll use instead today.
- `g` as in "global" means "all occurrences, please."
- `*` denotes all file types. (No more rhymes. What a tease.)

You can limit the operation to one file type, such as `txt`, by using a matching pattern:

```sh
sed -i -- 's/foo/bar/g' *.txt
```

## Current directory and subdirectories, recursive

You can supplement `sed` with `find` to expand your scope to all of the current folder's subdirectories. This will include any hidden files.

```sh
find . -type f -exec sed -i 's/foo/bar/g' {} +
```

To ignore hidden files (such as `.git`) you can pass the negation modifier `-not -path '*/\.*'`, like this:

```sh
find . -type f -not -path '*/\.*' -exec sed -i 's/foo/bar/g' {} +
```

This will exclude any file that has the string `/.` in its path.

You can also limit this operation to file names that end in a certain extension, like Markdown:

```sh
find . -type f -name "*.md" -exec sed -i 's/foo/bar/g' {} +
```

## Replacing URLs: change the separator

If you want to update a URL, the `/` separator in your strings will need escaping. It ends up looking like this...

```sh
find . -type f -exec sed -i \
's/https:\/\/www.oldurl.com\/blog/https:\/\/www.newurl.com\/blog/g' {} +
```

You can avoid confusion and mistakes by changing the separator to any non-conflicting character. The character that follows the `s` will be treated as the separator. In this case, using a `,` or `_` would do. This doesn't require escaping and is much more readable:

```sh
find . -type f -exec sed -i \
's_https://www.oldurl.com/blog_https://www.newurl.com/blog_g' {} +
```

I write about time-saving terminal tricks and how to improve productivity as a software developer. You can get these tips right in your inbox by signing up below!

<div class="form-container centered" id="subscribe">
<iframe src="https://victoriadrake.substack.com/embed" width="100%" height="320" style="border:none;border-radius:10px;margin:0 auto;background:transparent !important;" frameborder="0" scrolling="no"></iframe>
</div>
