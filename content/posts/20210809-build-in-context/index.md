---
title: "The Doorway Problem: Why Building in Isolation Fails"
date: 2021-08-09T03:17:49Z

aliases:
    - /posts/building-in-context/
description: "Why software projects fail when built in isolation. Practical strategies for building in context, avoiding the planning fallacy, and shipping features that actually work."
series:
tags:
    - leadership
    - development
image: cover.jpg
 
draft: false
---

It’s a comedy classic—you’ve got a grand idea. Maybe you want to build a beautiful new dining room table. You spend hours researching woodcraft, learn about types of wood and varnish, explore different styles of construction, and now you have a solid plan. You buy the wood and other materials. You set up in the garage. For months you measure and saw, sand, hammer and paint. Finally, the effort pays off. The table is finished, and it’s fantastic.

In a frenzy of accomplishment you drag it into the house—only to discover that your dining room doorway is several inches too small. It doesn’t fit.

You might say this comedic example is unrealistic. Of course an experienced DIY-er would have measured the doorway first. But in real life, unforeseen problems rarely come solo. Once you finally get the table through the door (after removing the legs and reassembling it inside), you discover the floor’s uneven. The chairs you chose are a few inches too short. The ceiling light hangs too low. Each solution creates new problems you never anticipated.

I’ve seen this exact pattern play out dozens of times in software development, just with different furniture. Teams spend months building features in isolation, only to discover they don’t fit through the “doorways” of real user workflows, existing infrastructure, or business constraints. The solution isn’t better planning—it’s building in context from the start.

## The Planning Fallacy (Or: Why We’re All Terrible at This)

Few software developers are accurate when it comes to time and cost estimates. This isn’t a failing of engineers specifically—it’s a deeply human tendency toward optimism when predicting our own future. First proposed by Daniel Kahneman and Amos Tversky in 1979, the planning fallacy explains why our estimates are consistently wrong.

In one study, students were asked to estimate how long they’d take to finish their senior theses. The estimates averaged 27.4 days at the optimistic end and 48.6 days at the pessimistic end. The actual completion time? 55.5 days. Even the pessimistic estimates were too optimistic.

The researchers proposed two main reasons: first, people focus on their future plans rather than their past experiences; second, people don’t think past experiences matter much to the future anyway.

You can probably find examples of this in your own recent project history. Sure, that last “two-day feature” turned into a two-week affair, but that was only because the API documentation was wrong. Or maybe you didn’t finish that database migration when planned, but that was only because you discovered the staging environment was configured differently than production. You’re absolutely, positively, definitely certain that next time will be different.

> The reality is that we’re terrible at factoring in the unexpected daily demands of building software.

Legacy code behaves mysteriously. Third-party services have undocumented quirks. Staging environments don’t match production. Users do things we never anticipated. Some measure of ignorance about these complications probably keeps us sane enough to start new projects.

But some measure of accurate planning is also necessary for success. The solution is working in context as much as possible, rather than trying to plan for every contingency.

## Context Is Your Reality Check

Let’s reconsider the dining room table story. Instead of spending months out in the garage, what would you do differently to build in context?

You might say, “Build it in the dining room!” While that would be ideal for context, it’s rarely possible in homes or software development. Instead, you do the next best thing: start building, and make frequent visits to context.

Having decided you want to build a table, one of the first questions is “How big will it be?” You’ll have requirements to fulfill (must seat six, must match other furniture, must hold the weight of your annual twenty-eight-course Christmas feast) that lead you to a rough decision.

With a size in mind, you build a mock-up. At this point, the specific materials, style, and color don’t matter—only the three dimensions. Once you have your mock table, you can make your first trip to the context where it will ultimately live. Attempting to carry your foam/wood/cardboard/balloon animal mock-up into the dining room will reveal issues you never considered, and possibly new opportunities as well. Perhaps, though you’d never have thought it, a modern abstractly-shaped dining table would better complement the space. You can take this into account in your next higher-fidelity iteration.

This translates directly to software development, minus the Christmas feast. You may recognize this as the MVP approach, but even here, putting the MVP in context is a step that’s frequently omitted.

I’ve seen teams spend months building a “simple” user authentication system, only to discover that their company’s SSO provider doesn’t support the OAuth flow they built around. Or teams that create beautiful interfaces that completely break when real user data (with its inconsistent formats and edge cases) gets loaded. Where will your product ultimately live? How will it be accessed? What does real data look like?

> Building your MVP and attempting to deploy it with realistic constraints will uncover these issues when they’re still manageable.

Even when teams have prior experience with technologies, remember the planning fallacy. People naturally discount past evidence to the point of forgetting. It’s also unlikely that the same exact team is building the same exact product as last time. The language, technology, framework, and infrastructure have likely changed—as have the capabilities and bandwidth of the engineers. Frequent visits to context help you run into issues early, adapt to them, and create short feedback loops.

## Go for Good Enough (Then Iterate)

The specific meaning of putting something in context varies from project to project. It might mean deploying to cloud infrastructure, running on a new server, or testing whether your remote office can access the same resources you use. In all cases, keep those short iterations going. Don’t wait to get a version to 100% before finding out if it works in context. Ship it at 80%, see how close you got, then iterate.

This approach feels risky if you’re used to planning everything upfront. But the alternative—discovering fundamental incompatibilities after months of work—is much riskier. Better to learn that your table won’t fit through the door when it’s still made of cardboard than when it’s solid oak.

The best software gets built by teams that understand the difference between the theoretical problem they’re solving and the real environment where their solution needs to work. Context is messy, unpredictable, and full of constraints you never anticipated. That’s exactly why you need to visit it early and often.

Your garage is perfect for focused work, but your dining room is where people actually eat dinner. Build for where your software will really live, not where it’s convenient to develop it.
