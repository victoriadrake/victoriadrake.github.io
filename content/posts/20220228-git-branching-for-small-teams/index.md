---
title: "Mastering Git for Small Teams"
date: 2022-02-28T06:37:48-06:00

aliases:
    - /git-branching-for-small-teams/
description: Unlock a more productive Git workflow for your small team with an approach to branch management designed to reduce headaches and accelerate your path to deployment.
tags:
    - leadership
    - git
image: cover.png
featured: true
draft: false
---

I've watched too many talented engineers spend their Friday afternoons untangling Git messes that could have been avoided with a simpler workflow. You know the scene: someone's trying to merge a three-week-old feature branch, there are conflicts in files that haven't been touched in months, and suddenly what should have been a five-minute deployment turns into a two-hour debugging session (with the whole team).

The solution isn't mastering Git's most obscure commands or memorizing every branching strategy ever invented. It's adopting a workflow that prevents the chaos in the first place. Here's the approach I use personally and recommend for small teams that want to ship code without the drama.

## A Protected Main Branch (No Exceptions)

First rule: no human should have direct push permissions to your `master` branch. Ever. I don't care if you're the CTO, the person who started the repository, or the only one who "really understands the codebase." The moment you start making exceptions is the moment you start breaking things in production.

Your main branch should be your source of truth for what's currently deployed. When you create a release from the latest tag, that code should work. Period. If you're not deploying frequently and automatically, you're missing out on one of the biggest advantages of this approach.

## One Issue, One Branch, One PR (Keep It Simple)

Here's where most teams overcomplicate things. You've got your issues tracked somewhere (and if you don't, we need to have a different conversation). Each issue represents a well-defined piece of work that can be merged and deployed without breaking anything. Maybe it's a new feature, a component update, or a bug fix. Doesn't matter—the process stays the same.

{{< figure src="cover.png" title="Author's illustration of issue branches and releases from master." >}}

The key is keeping branches short-lived. For a small commercial team, we're talking days, not weeks. Open source projects with volunteer contributors might stretch this to a few weeks or months, but the principle remains: finish the work, get it reviewed, merge it, and move on.

Here's what this looks like in practice. Say you're working on **(#28) Add user settings page**:

```sh
# Get all the latest work locally
git checkout master
git pull
# Start your new branch from master
git checkout -b 28/add-settings-page
```

Work on the issue, and periodically merge `master` to stay current:

```sh
# Commit to your issue branch
git commit ...
# Get the latest work on master
git checkout master
git pull
# Return to your issue branch and merge in master
git checkout 28/add-settings-page
git merge master
```

I know some of you are thinking "but what about rebasing?" Look, I like rebasing too. A clean, linear history is beautiful. But I've seen too many developers get tangled up in interactive rebasing purgatory while accidentally dropping commits or creating conflicts that didn't need to exist. Merging might create a slightly messier history, but it's predictable and reversible. When you're optimizing for team productivity, predictable wins over pretty.

When your work is ready, open a PR against `master`. Tests run automatically. Your teammates review the code and leave helpful feedback (hopefully). Maybe you deploy a preview version to staging. Once everything looks good, merge it, close the issue, and delete the branch. (Yes. Delete it. It will be okay.)

## Avoiding the Common Disasters

Here are the patterns I see that turn this simple workflow into a nightmare:

**Branching off feature branches:** This is how you end up with dependency chains that make merging feel like getting the Christmas lights out of storage. Someone starts working on feature B before feature A is merged, then feature C depends on both, and suddenly you need a whiteboard and a computer science degree to figure out the merge order. Just branch from the latest `master`. Always.

**Scope creep on branches:** You're implementing the user settings page, but then you notice the button component could use some updates, and hey, while we're at it, let's refactor this entire authentication flow. Stop. That's how a three-day task becomes a three-week (or three-month) PR that nobody wants to review. Stick to the issue at hand.

**Keeping dead branches around:** Your branch got merged last month, but it's still sitting there in the repository like a ghost haunting your Git history. Delete merged branches immediately. Future you will thank present you for not having to scroll through fifty old feature branches trying to find the one you're actually working on.

## Why This Actually Works

This workflow works because it aligns with how small teams actually operate. You don't need the complexity of GitFlow when you've got eight developers. You don't need long-lived release branches when you're deploying multiple times per week. You need a system that gets out of your way and lets you focus on building software.

The protection on `master` means your deployable code stays deployable. The one-issue-per-branch rule keeps PRs reviewable and prevents feature creep. The short-lived branches mean conflicts are small and manageable. The regular merging from `master` means you catch integration issues early when they're easy to fix.

Most importantly, **this workflow is boring in the best possible way.** Once your team gets the hang of it, Git becomes background infrastructure instead of a daily source of stress. Developers stop losing work to merge conflicts. Code reviews become focused discussions about functionality rather than archaeology expeditions through weeks of accumulated changes.

The best development workflows are the ones you don't have to think about. They handle the routine stuff automatically so you can focus on the interesting problems. This Git strategy does exactly that—it gets out of your way and lets you ship code with confidence.
