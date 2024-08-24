---
title: How to quickly batch resize, compress, and convert images with a Bash one-liner
date: 2019-10-14T08:27:49-04:00

aliases:
description: A fast command line interface solution for batch image processing.
tags:
    - terminal
    - ci/cd
image: cover.png
noToc: true
draft: false
categories: ["article"]
---

Part of my Hugo site continuous deployment workflow is the processing of 210 images, at time of writing.

Here's my one-liner:

```sh
find public/ -not -path "*/static/*" \( -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' \) -print0 | xargs -0 -P8 -n2 mogrify -strip -thumbnail '1000>' -format jpg
```

I use `find` to target only certain image file formats in certain directories. With [`mogrify`, part of ImageMagick](https://www.imagemagick.org/script/mogrify.php), I resize only the images that are larger than a certain dimension, compress them, and strip the metadata. I tack on the `format` flag to create jpg copies of the images.

Here's the one-liner again (broken up for better reading):

```sh
# Look in the public/ directory
find public/ \
# Ignore directories called "static" regardless of location
-not -path "*/static/*" \
# Print the file paths of all files ending with any of these extensions
\( -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' \) -print0 \
# Pipe the file paths to xargs and use 8 parallel workers to process 2 arguments
| xargs -0 -P8 -n2 \
# Tell mogrify to strip metadata, and...
mogrify -strip \
# ...compress and resize any images larger than the target size (1000px in either dimension)
-thumbnail '1000>' \
# Convert the files to jpg format
-format jpg
```

That's it. That's the post.
