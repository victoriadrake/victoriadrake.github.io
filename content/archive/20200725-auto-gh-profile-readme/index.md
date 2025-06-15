---
title: Go automate your GitHub profile README
date: 2020-07-25T10:51:15-04:00
aliases:
    - /archive/go-automate-your-github-profile-readme/
description: Create a dynamic Markdown file with Go and GitHub Actions
tags:
    - development
    - go
image: cover.png
draft: false
categories: ["article"]
---

GitHub's new profile page README feature is having the wonderful effect of bringing some personality to the Myspace pages of the developer Internet. Though Markdown lends itself best to standard static text content, that's not stopping creative folks from working to create a next-level README. You can include GIFs and images to add some motion and pizazz (they're covered in [GitHub Flavor Markdown](https://github.github.com/gfm/)), but I'm thinking of something a little more dynamic.

At front-and-center on your GitHub profile, your README is a great opportunity to let folks know what you're about, what you find important, and to showcase some highlights of your work. You might like to show off your latest repositories, tweet, or blog post. Keeping it up to date doesn't have to be a pain either, thanks to continuous delivery tools like GitHub Actions.

My current README refreshes itself daily with a link to my latest blog post. Here's how I'm creating a self-updating `README.md` with Go and GitHub actions.

## Reading and writing files with Go

I've been writing a lot of Python lately, but for some things I really like using Go. You could say it's my go-to language for just-for-`func` projects. Sorry. Couldn't stop myself.

To create my README.md, I'm going to get some static content from an existing file, mash it together with some new dynamic content that we'll generate with Go, then bake the whole thing at 400 degrees until something awesome comes out.

Here's how we read in a file called `static.md` and put it in `string` form:

```go
// Unwrap Markdown content
content, err := ioutil.ReadFile("static.md")
if err != nil {
    log.Fatalf("cannot read file: %v", err)
    return err
}

// Make it a string
stringyContent := string(content)
```

The possibilities for your dynamic content are only limited by your imagination! Here, I'll use the [`github.com/mmcdole/gofeed` package](https://github.com/mmcdole/gofeed) to read the RSS feed from my blog and get the newest post.

```go
fp := gofeed.NewParser()
feed, err := fp.ParseURL("https://victoria.dev/index.xml")
if err != nil {
    log.Fatalf("error getting feed: %v", err)
}
// Get the freshest item
rssItem := feed.Items[0]
```

To join these bits together and produce stringy goodness, we use [`fmt.Sprintf()`](https://golang.org/pkg/fmt/#Sprintf) to create a formatted string.

```go
// Whisk together static and dynamic content until stiff peaks form
blog := "Read my latest blog post: **[" + rssItem.Title + "](" + rssItem.Link + ")**"
data := fmt.Sprintf("%s\n%s\n", stringyContent, blog)
```

Then to create a new file from this mix, we use [`os.Create()`](https://golang.org/pkg/os/#Create). There are [more things to know about deferring `file.Close()`](https://www.joeshaw.org/dont-defer-close-on-writable-files/), but we don't need to get into those details here. We'll add `file.Sync()` to ensure our README gets written.

```go
// Prepare file with a light coating of os
file, err := os.Create("README.md")
if err != nil {
    return err
}
defer file.Close()

// Bake at n bytes per second until golden brown
_, err = io.WriteString(file, data)
if err != nil {
    return err
}
return file.Sync()
```

View the full code [here in my README repository](https://github.com/victoriadrake/victoriadrake/blob/535da81efd291e40374307609a9fa66e08f4985c/update/main.go).

Mmmm, doesn't that smell good? 🍪 Let's make this happen on the daily with a GitHub Action.

## Running your Go program on a schedule with Actions

You can create a GitHub Action workflow that [triggers](https://docs.github.com/en/actions/reference/events-that-trigger-workflows) both on a push to your `master` branch as well as on a daily schedule. Here's a slice of the `.github/workflows/update.yaml` that defines this:

```yaml
on:
  push:
    branches:
      - master
  schedule:
    - cron: '0 11 * * *'
```

To run the Go program that rebuilds our README, we first need a copy of our files. We use `actions/checkout` for that:

```yaml
steps:
    - name: 🍽️ Get working copy
      uses: actions/checkout@master
      with:
        fetch-depth: 1
```

This step runs our Go program:

```yaml
- name: 🍳 Shake & bake README
  run: |
    cd ${GITHUB_WORKSPACE}/update/
    go run main.go
```

Finally, we push the updated files back to our repository. Learn more about the variables shown at [Using variables and secrets in a workflow](https://docs.github.com/en/actions/configuring-and-managing-workflows/using-variables-and-secrets-in-a-workflow).

```yaml
- name: 🚀 Deploy
  run: |
    git config user.name "${GITHUB_ACTOR}"
    git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
    git add .
    git commit -am "Update dynamic content"
    git push --all -f https://${{ secrets.GITHUB_TOKEN }}@github.com/${GITHUB_REPOSITORY}.git
```

View the full code for this Action workflow [here in my README repository](https://github.com/victoriadrake/victoriadrake/blob/535da81efd291e40374307609a9fa66e08f4985c/.github/workflows/update.yaml).

## Go forth and auto-update your README

Congratulations and welcome to the cool kids' club! You now know how to build an auto-updating GitHub profile README. You may now go forth and add all sorts of neat dynamic elements to your page -- just go easy on the GIFs, okay?
