---
title: Batch renaming images, including image resolution, with awk
date: 2017-11-20T13:59:30-05:00

aliases:
    - /verbose/renaming-images
    - /verbose/batch-renaming-images-including-image-resolution-with-awk
description: How to batch rename images with custom values using file, awk, and rename - in rainbow colors!
tags:
    - terminal
    - linux
    - ci/cd
image: renaming-rainbow.png
 
draft: false
categories: ["article"]

wasfeatured:
    - where : url
---

The most recent item on my list of "Geeky things I did that made me feel pretty awesome" is an hour's adventure that culminated in this code:

```bash
$ file IMG* | awk 'BEGIN{a=0} {print substr($1, 1, length($1)-5),a++"_"substr($8,1, length($8)-1)}' | while read fn fr; do echo $(rename -v "s/$fn/img_$fr/g" *); done
IMG_20170808_172653_425.jpg renamed as img_0_4032x3024.jpg
IMG_20170808_173020_267.jpg renamed as img_1_3024x3506.jpg
IMG_20170808_173130_616.jpg renamed as img_2_3024x3779.jpg
IMG_20170808_173221_425.jpg renamed as img_3_3024x3780.jpg
IMG_20170808_173417_059.jpg renamed as img_4_2956x2980.jpg
IMG_20170808_173450_971.jpg renamed as img_5_3024x3024.jpg
IMG_20170808_173536_034.jpg renamed as img_6_4032x3024.jpg
IMG_20170808_173602_732.jpg renamed as img_7_1617x1617.jpg
IMG_20170808_173645_339.jpg renamed as img_8_3024x3780.jpg
IMG_20170909_170146_585.jpg renamed as img_9_3036x3036.jpg
IMG_20170911_211522_543.jpg renamed as img_10_3036x3036.jpg
IMG_20170913_071608_288.jpg renamed as img_11_2760x2760.jpg
IMG_20170913_073205_522.jpg renamed as img_12_2738x2738.jpg
// ... etc etc
```

The last item on the aforementioned list is "TODO: come up with a shorter title for this list."

I previously wrote about the power of command line tools like [sed](/posts/how-to-replace-a-string-in-a-dozen-old-blog-posts-with-one-sed-terminal-command/). This post expands on how to string all this magical functionality into one big, long, rainbow-coloured, viscous stream of awesome.

## Rename files

The tool that actually handles the renaming of our files is, appropriately enough, `rename`. The syntax is: `rename -n "s/original_filename/new_filename/g" *` where `-n` does a dry-run, and substituting `-v` would rename the files. The `s` indicates our substitution string, and `g` for "global" finds all occurrences of the string. The `*` matches zero or more occurrences of our search-and-replace parameters.

We'll come back to this later.

## Get file information

When I run `$ file IMG_20170808_172653_425.jpg` in the image directory, I get this output:

```bash
IMG_20170808_172653_425.jpg: JPEG image data, baseline, precision 8, 4032x3024, frames 3
```

Since we can get the image resolution ("4032x3024" above), we know that we'll be able to use it in our new filename.

## Isolate the information we want

I love `awk` for its simplicity. It takes lines of text and makes individual bits of information available to us with built in variables that we can then refer to as column numbers denoted by `$1`, `$2`, etc. By default, `awk` splits up columns on whitespace. To take the example above:

```text
|              1               |   2  |   3   |   4   |     5     |     6     | 7  |      8     |   9    | 10 |
-------------------------------------------------------------------------------------------------------------
| IMG_20170808_172653_425.jpg: | JPEG | image | data, | baseline, | precision | 8, | 4032x3024, | frames | 3  |
```

We can denote different values to use as a splitter with, for example, `-F','` if we wanted to use commas as the column divisions. For our current project, spaces are fine.

There are a couple issues we need to solve before we can plug the information into our new filenames. Column `$1` has the original filename we want, but there's an extra ":" character on the end. We don't need the ".jpg" either. Column `$8` has an extra "," that we don't want as well. To get just to information we need, we'll take a substring of the column with `substr()`:

`substr($1, 1, length($1)-5)` - This gives us the file name from the beginning of the string to the end of the string, minus 5 characters ("length minus 5").
`substr($8,1, length($8)-1)` - This gives us the image size, without the extra comma ("length minus 1").

## Avoid duplicate file names

To ensure that two images with the same resolutions don't create identical, competing file names, we'll append a unique incrementing number to the filename.

`BEGIN{a=0}` - Using `BEGIN` tells `awk` to run the following code only once, at the (drumroll) beginning. Here, we're declaring the variable `a` to be `0`.
`a++` - Later in our code, at the appropriate spot for our file name, we call `a` and increment it.

When `awk` prints a string, it concatenates everything that isn't separated by a comma. `{print a b c}` would create "abc" and `{print a,b,c}` would create "a b c", for example.

We can add additional characters to our file name, such as an underscore, by inserting it in quotations: `"_"`.

## String it all together

To feed the output of one command into another command, we use "pipe," written as `|`.

If we only used pipe in this instance, all our data from `file` and `awk` would get fed into `rename` all at once, making for one very, very long and probably non-compiling file name. To run the `rename` command line by line, we can use `while` and `read`. Similarly to `awk`, `read` takes input and splits it into variables we can assign and use. In our code, it takes the first bit of output from `awk` (the original file name) and assigns that the variable name `$fn`. It takes the second output (our incrementing number and the image resolution) and assigns that to `$fr`. The variable names are arbitrary; you can call them whatever you want.

To run our `rename` commands as if we'd manually entered them in the terminal one by one, we can use `echo $(some command)`. Finally, `done` ends our `while` loop.

## Bonus round: rainbow output

I wasn't kidding with that ["rainbow-coloured" bit...](https://github.com/tehmaze/lolcat)

```bash
p install lolcat
```

Here's our full code:

```bash
le IMG* | awk 'BEGIN{a=0} {print substr($1, 1, length($1)-5),a++"_"substr($8,1, length($8)-1)}' | while read fn fs; do echo $(rename -v "s/$fn/img_$fs/g" *); done | lolcat
```

Enjoy!
