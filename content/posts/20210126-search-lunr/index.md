---
title: Add search to Hugo static sites with Lunr
date: 2021-01-26T09:25:17-05:00

aliases:
    - /blog/add-search-to-hugo-with-lunr
    - /archive/add-search-to-hugo-static-sites-with-lunr/
description: Make your static site searchable with a client-side search index.
tags:
    - websites
    - coding
    - data
    - javascript
noToc: true
draft: false
categories: ["article"]
---

Yes, you _can_ have an interactive search feature on your static site! No need for servers or paid subscriptions here. Thanks to the open source [Lunr](https://lunrjs.com/) and the power of [Hugo static site generator](https://gohugo.io/), you can create a client-side search index with just a template and some JavaScript.

A number of my readers have been kind enough to tell me that you find my blog useful, but there's something that you don't know. Up until I recently implemented a search feature on [victoria.dev](/), I had been my own unhappiest user.

My blog exists for all to read, but it's also my own personal Internet brain. I frequently pull up a post I've written when trying to re-discover some bit of knowledge that I may have had the foresight to record. Without a search, finding it again took a few clicks and more than a few guesses. Now, all my previous discoveries are conveniently at my fingertips, ready to be rolled into even more future work.

If you'd like to make your own personal Internet brain more useful, here's how you can implement your own search feature on your static Hugo site.

## Get Lunr

While you can [install lunr.js](https://lunrjs.com/guides/getting_started.html) via npm or include it from a CDN, I chose to vendorize it to minimize network impact. This means I host it from my own site files by placing the library in Hugo's `static` directory.

You can save your visitors some bandwidth by minifying `lunr.js`, which I did just by [downloading lunr.js from source](https://github.com/olivernn/lunr.js) and using the [JS & CSS Minifier Visual Studio Code extension](https://github.com/olback/es6-css-minify) on the file. That brought the size down roughly 60% from 97.5 KB to 39.35 KB.

Save this as `static/js/lunr.min.js`.

## Create a search form partial

To easily place your search form wherever you like on your site, create the form as a partial template at `layouts/partials/search-form.html`

```html
<form id="search"
    action='{{ with .GetPage "/search" }}{{.Permalink}}{{end}}' method="get">
    <label hidden for="search-input">Search site</label>
    <input type="text" id="search-input" name="query"
    placeholder="Type here to search">
    <input type="submit" value="search">
</form>
```

Include your search form in other templates with:

```text
{{ partial "search-form.html" . }}
```

## Create a search page

For your search to be useful, you'll need a way to trigger one. You can create a (static!) `/search` page that responds to a GET request, runs your search, and displays results.

Here's how to create a Hugo template file for a search page and get it to render.

Create `layouts/search/list.html` with the following minimum markup, assuming you're [inheriting from a base template](https://gohugo.io/templates/base):

```html
{{ define "main" }}
{{ partial "search-form.html" . }}

<ul id="results">
    <li>
        Enter a keyword above to search this site.
    </li>
</ul>
{{ end }}
```

In order to get Hugo to render the template, a matching content file must be available. Create `content/search/_index.md` to satisfy this requirement. The file just needs minimal [front matter](https://gohugo.io/content-management/front-matter) to render:

```md
---
title: Search me!
---
```

You can run `hugo serve` and navigate to `/search` to see if everything builds as expected.

A few libraries exist to help you build a search index and implement Lunr. You can find them [here on the Hugo site](https://gohugo.io/tools/search/). If you want to fully understand the process, however, you'll find it's not complicated do this without additional dependencies, thanks to the power of Hugo's static site processing.

## Build your search index

Here's how to build an index for Lunr to search using Hugo's template rendering power. Use `range` to loop over the pages you want to make searchable, and capture your desired parameters in an array of documents. One way to do this is to create `layouts/partials/search-index.html` with:

```html
<script>
window.store = {
    // You can specify your blog section only:
    {{ range where .Site.Pages "Section" "posts" }}
    // For all pages in your site, use "range .Site.Pages"
    // You can use any unique identifier here
    "{{ .Permalink }}": {
        // You can customize your searchable fields using any .Page parameters
        "title": "{{ .Title  }}",
        "tags": [{{ range .Params.Tags }}"{{ . }}",{{ end }}],
        "content": {{ .Content | plainify }}, // Strip out HTML tags
        "url": "{{ .Permalink }}"
    },
    {{ end }}
}
</script>
<!-- Include Lunr and code for your search function,
which you'll write in the next section -->
<script src="/js/lunr.min.js"></script>
<script src="/js/search.js"></script>
```

When Hugo renders your site, it will build your search index in much the same way as [a List page](https://gohugo.io/templates/lists#what-is-a-list-page-template) is built, creating a document for each page with its parameters.

The last piece of the puzzle is the code to handle the search process: taking the search query, getting Lunr to perform the search, and displaying the results.

## Perform the search and show results

Create `static/js/search.js` to hold the JavaScript that ties it all together. This file has three main tasks: get the search query, perform the search with Lunr, and display the results.

### Get query parameters with JavaScript

This part's straightforward thanks to [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams):

```js
const params = new URLSearchParams(window.location.search)
const query = params.get('q')
```

### Search for the query with Lunr

Define and configure an [index for Lunr](https://lunrjs.com/guides/getting_started.html#creating-an-index). This tells Lunr what you'd like to search with, and you can optionally `boost` elements that are more important.

```js
const idx = lunr(function () {
    // Search these fields
    this.ref('id')
    this.field('title', {
        boost: 15
    })
    this.field('tags')
    this.field('content', {
        boost: 10
    })

    // Add the documents from your search index to
    // provide the data to idx
    for (const key in window.store) {
        this.add({
        id: key,
        title: window.store[key].title,
        tags: window.store[key].category,
        content: window.store[key].content
        })
    }
})
```

You can then execute the search and store results with:

```js
const results = idx.search(query)
```

### Display results

You'll need a function that builds a list of results and displays them on your search page. Recall the `id` you gave your `ul` element in `layouts/search/list.html` and store it as a variable:

```js
const searchResults = document.getElementById('results')
```

If a search results in some results (🥁), you can iterate over them and build a `<li>` element for each one.

```js
if (results.length) { // Length greater than 0 is truthy
    let resultList = ''
    for (const n in results) {
      // Use the unique ref from the results list to get the full item
      // so you can build its <li>
      const item = store[results[n].ref]
      resultList += '<li><p><a href="' + item.url + '">' + item.title + '</a></p>'
      // Add a short clip of the content
      resultList += '<p>' + item.content.substring(0, 150) + '...</p></li>'
    }
    searchResults.innerHTML = resultList
}
```

For each of your results, this produces a list item similar to:

```html
<li>
    <p>
        <a href=".../blog/add-search-to-hugo-with-lunr/">
        Add search to Hugo static sites with Lunr
        </a>
    </p>
    <p>Yes, you can have an interactive search feature on your static site!...</p>
</li>
```

If there are no results, ham-handedly insert a message instead.

```js
else {
    searchResults.innerHTML = 'No results found.'
}
```

### Full code for search.js

Here's what `static/js/search.js` could look like in full.

<details>
<summary>search.js full code</summary>

```js
{{% md %}}
{{< readfile file="blog/20210126-search-lunr/search-example.js" >}}
{{% /md %}}
```

</details>

## Make it go

You now have Lunr, the search index, and the code that displays results. Since these are all included in `layouts/partials/search-index.html`, add this partial on all pages with a search form. In your page footer, place:

```text
{{ partial "search-index.html" . }}
```

You can see what this looks like when it's all put together by trying it out [on my blog](/blog).

## Make it go faster

Since your site is static, it's possible to [pre-build your search index](https://lunrjs.com/guides/index_prebuilding.html) as a JSON data file for Lunr to load. This is where those [aforementioned libraries](https://gohugo.io/tools/search/) may be helpful, since a JSON-formatted search index would need to be built outside of running `hugo` to generate your site.

You can maximize your search speed by minifying assets, and minimizing computationally expensive or blocking JavaScript in your code.

## Static sites get search, too!

I hope this helps you make your Internet brain more useful for yourself and others, too! Don't worry if you haven't got the time to implement a search feature today -- you can find this tutorial again when you visit [victoria.dev](/blog) and search for this post! 🥁
