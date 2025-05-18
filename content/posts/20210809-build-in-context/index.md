---
title: Building in context
date: 2021-08-09T03:17:49Z

aliases:
description: The best laid plans are made better by staying close to context.
series:
tags:
    - leadership
    - computing
image: cover.jpg
 
draft: false
---

It's a comedy classic -- you've got a grand idea. Maybe you want to build a beautiful new dining room table. You spend hours researching woodcraft, learn about types of wood and varnish, explore different styles of construction, and now you have a solid plan. You buy the wood and other materials. You set up in the garage. For months you measure and saw, sand, hammer and paint. Finally, the effort is worthwhile. The table is finished, and it's fantastic.

In a frenzy of accomplishment you drag it into the house -- only to discover that your dining room doorway is several inches too small. It doesn't fit.

Art only imitates life, so you may say that this comedic example is unrealistic. Of course an experienced DIY-er would have measured the doorway first. In real life, however, unforeseen hindrances rarely come in ones: once you get the table in the door, you discover the floor's uneven. Perhaps the chairs you've chosen are a few inches too short... and so on.

Far from attempting to persuade you away from your next DIY project, I'd like to help make those and any other projects you take on go even smoother. The same patterns are found in furniture-building as in software development: it's always better to build in context.

## The planning fallacy

Few software developers are accurate when it comes to time and cost estimates. This isn't a failing of software engineers, but a human tendency to towards optimism when it comes to predicting your own future. First proposed by Daniel Kahneman and Amos Tversky in 1979, the planning fallacy is no new concept.

In [one study](https://www.semanticscholar.org/paper/Exploring-the-%22planning-fallacy%22%3A-Why-people-their-Buehler-Griffin/f91964dad8c0e54cd58b1aa99e430b900fcf082b), students were asked to estimate how long they would take to finish their senior theses. The estimates, an average 27.4 days at the optimistic end and 48.6 days at the pessimistic end, came up predictably short. The average actual completion time was 55.5 days.

The study proposed two main hypotheses as to why this happens: first, that people tend to focus on their future plans rather than their past experiences; and second, people don't tend to think that past experiences matter all that much to the future anyway.

You can probably find examples of this in your own life without trying too hard, perhaps couched in the infamous "only because" envelope. Sure, that last "weekend project" turned into a two-week affair, but that was only because you had to go run some unexpected errands. Or maybe you didn't finish that blog post when you mean to, but that's only because your siblings dropped in to visit. You're absolutely, positively, definitely certain that next time would be different.

In reality, people are just plain poor at factoring in the unexpected daily demands of life. This makes sense from a certain perspective: if we were good at it, we'd probably have a lot more to fret about on a daily basis. Some measure of ignorance can make life a little more blissful.

That said, some measure of accurate planning is also necessary for success. One way we can improve accuracy is to work in context as much as possible.

## Context

Let's consider the dining room table story again. Instead of spending months out in the garage, what would you do differently to build in context?

You might say, "Build it in the dining room!" While that would certainly be ideal for context, both in homes and in software development, it's rarely possible (or palatable). Instead, you can do the next best thing: start building, and make frequent visits to context.

Having decided you'd like to build a table, one of the first questions is likely, "How big will it be?" You'll undoubtedly have some requirements to fulfill (must seat six, must match other furniture, must hold the weight of your annual twenty-eight-course Christmas feast, etc.) that will lead you to a rough decision.

With a size in mind, you can then build a mock up. At this point, the specific materials, style, and color don't matter -- only its three dimensions. Once you have your mock table, you now have the ability to make your first trip to the context in which you hope it will ultimately live. Attempting to carry your foam/wood/cardboard/balloon animal mock up into the dining room is highly likely to reveal a number of issues, and possibly new opportunities as well. Perhaps, though you'd never have thought it, a modern abstractly-shaped dining table would better compliment the space and requirements. (It worked for the Jetsons.) You can then take this into account in your next higher-fidelity iteration.

This process translates directly to software development, minus the Christmas feast. You may have already recognized the MVP approach; however, even here, putting the MVP in context is a step that's frequently omitted.

Where will your product ultimately live? How will it be accessed? Building your MVP and attempting to deploy it is sure to help uncover lots of little hiccups at an early stage.

Even when teams have prior experience with stacks or technologies, remember the planning fallacy. People have a natural tendency to discount past evidence to the point of forgetting (memory bias). It's also highly unlikely that the same exact team is building the same exact product as the last time. The language, technology, framework, and infrastructure have likely changed in at least some small way -- as have the capabilities and appetites of the engineers on your team. Frequent visits to context can help you run into any issues early on, adapt to them, and create a [short feedback loop](/blog/how-to-set-up-a-short-feedback-loop-as-a-solo-coder/).

## Go for good enough

The specific meaning of putting something in context is going to vary from one software project to another. It may mean deployment to cloud infrastructure, running a new bare metal server, or attempting to find out if your office across the ocean can access the same resources you use. In all cases, keep those short iterations going. Don't wait and attempt to get a version to 100% before you find out if it works in context. Send it at 80%, see how close you got, then iterate again.

The concept of building in context can be applied at any stage -- of course, the sooner the better! Try applying this idea to your project guidance today. I'd love to hear how it goes.
