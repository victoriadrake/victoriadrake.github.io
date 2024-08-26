---
title: How to get hired as a software developer
date: 2021-01-12T05:50:53-05:00

aliases:
description: What to know before applying for a software developer job.
tags:
    - life
    - coding
    - open-source
noToc: true
draft: false
categories: ["article"]
---

I'm asked this question a lot, so let me be the first to give you the good news: there's no one right answer. As general tech-literacy increases, the culture of the coding industry is steadily, thankfully, moving away from a checklist approach. Instead of degrees and pre-requisites when it comes to deciding whether you're qualified to be hired as a software developer, companies (including my own) are far more concerned with just one question. **What can you do?**

There are some general best practices that will make you a far more attractive hire than the majority of applicants, and I'll discuss those in this post. For the most part, however, demonstrating what you're capable of is the best way to increase your chances of getting to the interview and beyond. Here's how to get hired as a software developer.

## First, build projects

Companies who are primarily focused on getting products built want to see that you've built products. They don't need to be flashy or for-profit, but they do need to work. I'm far more likely to consider a candidate with a colorful bouquet of working code in their GitHub or GitLab or CodePen portfolio. Here are some basic ideas to get you started:

- Command line utilities that help with tedious tasks, like [renaming image files](/blog/batch-renaming-images-including-image-resolution-with-awk/)
- [Themes](/blog/hugo-vs-jekyll-an-epic-battle-of-static-site-generator-themes/) for static site generators like Hugo or Jekyll
- Automation tools, such as for [GitHub Actions](/posts/go-automate-your-github-profile-readme/)

The best projects you could showcase are ones directly related to the specialty you want to apply for. Show that you have competency with the fundamentals. For instance, if you see yourself focusing on front end, demonstrate that you can build interactive web pages with no fancier tools than HTML, CSS, and vanilla JS. For back end focused developers, show that you know how to create a fundamental tool like an API for a service on a local server. Want to be well-rounded? Create an API with a web page UI.

Spend some time creating a good README. Use screenshots, highlight code snippets, include well-written instructions for local set up. Show that you care about and fully understand your own work.

Explore specific frameworks and libraries if they interest you, but keep in mind that those won't be interesting to a company unless the company already wants to use that framework.

You maximize your chances of getting hired by demonstrating that you already have the ability to learn on your own, build, and then present projects to the world. Out of everything else in this article, this is the one fundamental trait that a company won't want to have to teach you.

## Next, stand out

Familiarity with the following topics, along with demonstrating that understanding in your own code, will put you miles ahead of most applicants.

### Reusable code

Companies that build products are concerned with getting the most bang for their buck. This is the same idea as wanting to save yourself time when you're creating something individually. If you put a week of effort into building something, it would be nice if you could keep easily using it for a long time afterwards. How can you maximize the return on your efforts?

Be familiar with DRY code. Avoid creating highly customized pieces that only fit a particular use case, peppered with hard-coded variables and dependent on a particular input structure. Avoid writing code that is hard to update in the future. Recognize when you're writing a script or library that could apply in many different situations, and understand how to turn it into a reusable module.

### Types and mutability

Besides building projects, debugging them can be a company's most expensive task. It takes a lot of time to hunt down and fix bugs, but you can help reduce that cost by understanding the subtler ways that a lot of bugs occur. Understanding types and mutability -- whether and how an object can be changed -- can help open the door to even greater technical proficiency.

Get familiar with at least one type system. If there's a linter available for your language, use it. Understand how immutable and mutable objects work in the language you use. Be able to describe specific use cases for either one. Understand at a general level how mutability impacts system resources, the difference between referencing and copying, and what it means to be thread-safe.

### Follow-on effects

Keep in mind that organizations are made up of people. When you work together with colleagues, your work has an effect on someone else's. Being aware of these effects and demonstrating conscientiousness in this area will help show potential employers that you'd benefit the team as a whole.

Consider the second and third-order effects of code you write. Avoid writing code that will unnecessarily slow down a larger system. Understand what blocking means and how to use concurrency or parallelism in your project. Include your thoughts on follow-on effects in your READMEs. Show that you always have the larger project, effort, costs, or organization in mind.

## Other nice-to-haves

If you've fully taken advantage of the points above, you're most of the way to getting hired already. Seal the deal with these easy wins.

### Be a friendly open source participant

There's no better way to show a potential employer you can work well on a team than by providing plenty of examples. Get involved with open source projects, contribute features and fixes, and interact with contributors and maintainers. Create a real-life simulation for your future colleagues that leaves no doubt about what you'd be like to work with. The further back this history goes, the better, so start right away.

### Communicate with care

If you're participating in open source or working remotely, most of your communication with your colleagues is going to take place online in text. Without facial expressions, tone or inflection, this form of communication leaves a lot to be desired. Some extra care on your part can help make sure your message always comes across as intended.

Get into a habit of drafting most everything you write, especially for long-form communication. Putting yourself in the mindset of creating a draft first lets you take all the time you need to craft your message. You can make sure you're choosing appropriate words and coming across with the emotions you intend to convey. Feeling hurried? Remember the golden rule of online communication: you _never_ need to reply right away. Take a breath, then take your time.

## Finally, use your imagination

Software developers are creative people by necessity. Before you can write code, build a project, or design a page, you first have to be able to imagine it! So put that skill to good use.

In every application, every email, every chat message with your potential employer, imagine yourself in their position. What do they care about right now? What current goals does the company have? What information about yourself can you share that would make them feel comfortable hiring you?

Take your best guess, and then ask if you got it right. "I think the company is looking for someone to [insert guess here], is that accurate?" Show that you have both the capability to anticipate future needs and the desire to identify and solve them.

## Get yourself hired

Admittedly, this post is my own wishlist. Good candidates for software development positions are hard to come by, and people who can rightly say they do everything above are rare. I don't think the discrepancy is due to a lack of ability; perhaps just a lack of information.

I've seen both sides of the virtual interview table, and this post is a result of me figuring things out the long and circuitous way. I hope this helps you to take a more direct route to getting yourself hired as a software developer.
