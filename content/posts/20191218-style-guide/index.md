---
title: Word bugs in software documentation and how to fix them
date: 2019-12-18T09:01:23-04:00

aliases:
description: A collection of mistakes that make documentation less awesome than it could be.
tags:
    - docs
    - open source
image: cover.png
noToc: true
draft: false
categories: ["article"]
---

I've been an editor longer than I've been a developer, so this topic for me is a real root issue. 🥁 When I see a great project with poorly-written docs, it hits close to `/home`. Okay, okay, I'm done.

I help the [Open Web Application Security Project (OWASP)](https://github.com/OWASP) with their [Web Security Testing Guide (WSTG)](https://github.com/OWASP/wstg). I was recently tasked with writing a [style guide](https://github.com/OWASP/wstg/blob/master/style_guide.md) and article template that show how to write technical instruction for testing software applications.

I thought parts of the guide would benefit more people than just OWASP's contributors, so I'm sharing some here.

Many of the projects I participate in are open source. This is a wonderful way for people to share solutions and to build on each others' ideas. Unfortunately, it's also a great way for misused and non-existent words to catch on. Here's an excerpt of the guide with some mistakes I've noticed and how you can fix them in your technical documents.

---

## Use Correct Words

The following are frequently misused words and how to correct them.

### _and/or_

While sometimes used in legal documents, _and/or_ leads to ambiguity and confusion in technical writing. Instead, use _or_, which in the English language includes _and_. For example:

> Bad: "The code will output an error number and/or description."
> Good: "The code will output an error number or description."

The latter sentence does not exclude the possibility of having both an error number and description.

If you need to specify all possible outcomes, use a list:

> "The code will output an error number, or a description, or both."

### _frontend, backend_

While it's true that the English language evolves over time, these are not yet words.

When referring to nouns, use _front end_ and _back end_. For example:

> Security is equally important on the front end as it is on the back end.

As a descriptive adverb, use the hyphenated _front-end_ and _back-end_.

> Both front-end developers and back-end developers are responsible for application security.

### _whitebox_, _blackbox_, _greybox_

These are not words.

As nouns, use _white box_, _black box_, and _grey box_. These nouns rarely appear in connection with cybersecurity.

> My cat enjoys jumping into that grey box.

As adverbs, use the hyphenated _white-box_, _black-box_, and _grey-box_. Do not use capitalization unless the words are in a title.

> While white-box testing involves knowledge of source code, black-box testing does not. A grey-box test is somewhere in-between.

### _ie_, _eg_

These are letters.

The abbreviation _i.e._ refers to the Latin _id est_, which means "in other words." The abbreviation _e.g._ is for _exempli gratia_, translating to "for example." To use these in a sentence:

> Write using proper English, i.e. correct spelling and grammar. Use common words over uncommon ones, e.g. "learn" instead of "glean."

### _etc_

These are also letters.

The Latin phrase _et cetera_ translates to "and the rest." It is abbreviated _etc._ and typically placed at the end of a list that seems redundant to complete:

> WSTG authors like rainbow colors, such as red, yellow, green, etc.

In technical writing, the use of _etc._ is problematic. It assumes the reader knows what you're talking about, and they may not. Violet is one of the colors of the rainbow, but the example above does not explicitly tell you if violet is a color that WSTG authors like.

It is better to be explicit and thorough than to make assumptions of the reader. Only use _etc._ to avoid completing a list that was given in full earlier in the document.

### _..._ (ellipsis)

The ellipsis punctuation mark can indicate that words have been left out of a quote:

> Linus Torvalds once said, "Once you realize that documentation should be laughed at... THEN, and only then, have you reached the level where you can safely read it and try to use it to actually implement a driver."

As long as the omission does not change the meaning of the quote, this is acceptable usage of ellipsis in the WSTG.

All other uses of ellipsis, such as to indicate an unfinished thought, are not.

### _ex_

While this is a word, it is likely not the word you are looking for. The word _ex_ has particular meaning in the fields of finance and commerce, and may refer to a person if you are discussing your past relationships. None of these topics should appear in the WSTG.

The abbreviation _ex._ may be used to mean "example" by lazy writers. Please don't be lazy, and write _example_ instead.

---

## Go forth and write docs

If these reminders are helpful, please share them freely and use them when writing your own READMEs and documentation! If there's some I've missed, I'd love to know.

And if you're here for the comments...

![Change my mind meme](crowder-change-my-mind.png#center)

There are none on my blog. You can still [@ me](/contact).

If you'd like to help contribute to the OWASP WSTG, please read [the contribution guide](https://github.com/OWASP/wstg/blob/master/CONTRIBUTING.md). See the [full style guide here](https://github.com/OWASP/wstg/blob/master/style_guide.md).
