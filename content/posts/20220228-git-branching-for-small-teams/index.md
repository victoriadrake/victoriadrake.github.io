---
title: Git branching for small teams
date: 2022-02-28T06:37:48-06:00

aliases:
description: A Git version control branch management strategy for small teams.
series:
    - heres-a-doc-for-that
tags:
    - leadership
    - git
image: cover.png
 
draft: false
---

Here's a practice I use personally and encourage within my open source projects and any small teams I run for work. I've seen major elements of it presented under a few different names: [Short-Lived Feature Branch](https://trunkbaseddevelopment.com/short-lived-feature-branches/) flow, [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow) (not to be confused with GitFlow), and [Feature Branch Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) are some. Having implemented features I like from all of these with different teams over the years, I'll describe the resulting process that I've found works best for small teams of about 5-12 people.

## A protected main branch

To support continuous delivery, no human should have direct push permissions on your `master` branch. If you develop on GitHub, the latest tag of this branch gets deployed when you [create a release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release) -- which is hopefully very often, and very automated.

## One issue, one branch, one PR

You're already doing a great job of tracking future features and current bugs as issues (right?). To take a quick aside, an issue is a well-defined piece of work that can be merged to the main branch and deployed without breaking anything. It could be a new piece of functionality, a button component update, or a bug fix.

{{< figure src="cover.png" title="Author's illustration of issue branches and releases from master." >}}

A short-lived branch-per-issue helps ensure that its resulting pull request doesn't get too large, making it unwieldy and hard to review carefully. The definition of "short" varies depending on the team or project's development velocity: for a small team producing a commercial app (like a startup), the time from issue branch creation to PR probably won't exceed a week. For open source projects like the [OWASP WSTG](https://github.com/OWASP/wstg) that depends on volunteers working around busy schedules, branches may live for a few weeks to a few months, depending on the contributor. Generally, strive to iterate in as little time as possible.

Here's what this looks like practically. For an issue named **(#28) Add user settings page**, check out a new branch from `master`:

```sh
# Get all the latest work locally
git checkout master
git pull
# Start your new branch from master
git checkout -b 28/add-settings-page
```

Work on the issue, and periodically merge `master` to fix and avoid other conflicts:

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

You may prefer to use rebasing instead of merging in `master`. This happens to be my personal preference as well, however, I've found that people generally seem to have a harder time wrapping their heads around how rebasing works than they do with merging. Interactive rebasing can easily introduce confusing errors, and rewriting history can be confusing to begin with. Since I'm all about reducing cognitive load in developers' processes in general, I recommend using a merge strategy.

When the issue work is ready to PR, open the request against `master`. Automated tests run. Teammates review the work (using [inline comments and suggestions](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/commenting-on-a-pull-request#adding-line-comments-to-a-pull-request) if you're on GitHub). Depending on the project, you may deploy a preview version as well.

Once everything checks out, the PR is merged, the issue is closed, and the branch is deleted.

## Keep it clean

Some common pitfalls I've seen that can undermine this flow are:

1. **Creating feature branches off of other feature/issue branches.** This is a result of poor organization and prioritization. To avoid confusing conflicts and dependencies, always branch off the most up-to-date `master`.
2. **Letting the issue branch live *just a little longer*.** This results in scope creep and huge, confusing PRs that take a lot of time and mental effort to review. Keep branches tightly scoped to the one issue they're meant to close.
3. **Not deleting merged branches.** There's no reason to leave them about -- all the work is in `master`. Not removing branches that are stale or have already been merged can cause confusion and make it more difficult than necessary to differentiate new ones.

If this sounds like a process you'd use, or if you have anything to add, [let me know via Webmention!](https://webmention.io/victoria.dev/webmention)
