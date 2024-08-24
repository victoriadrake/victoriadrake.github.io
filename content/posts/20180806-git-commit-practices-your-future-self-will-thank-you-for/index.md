---
title: Git commit practices your future self will thank you for
date: 2018-08-06T08:54:56-04:00

aliases:
    - /verbose/git-commit-practices-your-future-self-will-thank-you-for
    - /verbose/git-commit-practices-your-future-self-will-thank-you-for/
description: Learn how to easily create a clean and readable Git commit history with git squash, message templates, git stash, and tags.
tags:
    - git
    - coding
    - terminal
    - leadership
image: cover_git-commit-art.png
noToc: true
draft: false
categories: ["article"]
---

A history of clean commits can be evidence of a lot of things: attention to detail, good work ethic, and genuine investment in the project. What do your Git commits say about you?

Here's how you can create and maintain a clean and orderly Git commit history using [message templates](#write-great-git-commit-messages-with-a-template), [learning how to squash commits](#one-change-per-commit-how-to-squash-git-commits), [using git stash](#git-stash), and [creating annotated commit tags](#tag-release-versions-using-annotated-git-tags).

## What it means to commit responsibly

Whether our code will be seen by the entire open source community or just future versions of ourselves, either one will be grateful if we commit responsibly today. Being responsible can mean a lot of things to different people, so I enlisted some of `mastodon.technology` (instance shut down since) and [dev.to](https://dev.to/victoria/what-does-it-mean-to-commit-responsibly-22mi) to help round out my list. From those (really great) threads, I distilled these main points:

> __Committing responsibly__
>
> 1. Provide and/or use tests to avoid committing bugs or broken builds
> 1. Write clean code that meets style specifications
> 1. Use descriptive commit messages that reference related discussion
> 1. Make only one change per commit and avoid including unrelated changes

Some of the above is achieved through maintaining a short feedback loop that helps you improve your code quality while staying accountable to yourself. [I wrote another article](/blog/how-to-set-up-a-short-feedback-loop-as-a-solo-coder/) that discusses this in detail, especially the part about [code review](/blog/how-to-set-up-a-short-feedback-loop-as-a-solo-coder/#block-out-time-for-code-review). Other items on this list have to do specifically with making commits in Git. There are some features of Git that can benefit us in these areas, as can harnessing tools like Vim. I'll cover those topics here.

If the majority of your Git commits so far have been created with something like `git commit -m "Bug fixes"` then this is the article for you!

## Write great Git commit messages with a template

I think [Linus](https://github.com/torvalds/subsurface-for-dirk/commit/b6590150d68df528efd40c889ba6eea476b39873) would be very happy if we didn't use `git commit -m "Fix bug"` in a public repository ever again. As very well put in [this classic post](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html) and [the seven rules of a great Git commit message](https://chris.beams.io/posts/git-commit/):

> A properly formed Git commit subject line should always be able to complete the following sentence:
>
> If applied, this commit will _your subject line here_

[This other classic post](http://who-t.blogspot.com/2009/12/on-commit-messages.html) also discusses three questions that the body of the commit message should answer:

> Why is it necessary?
> How does it address the issue?
> What effects does the patch have?

This can be a lot to remember to cover, but there's a slick way to have these prompts at hand right when you need it. You can set up a commit message template by using the `commit.template` [configuration value](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration).

To set it, configure Git to use a template file (for example, `.gitmessage` in your home directory), then create the template file with Vim:

```sh
git config --global commit.template ~/.gitmessage
vim ~/.gitmessage
```

When we run `git commit` without the `-m` message flag, the editor will open with our helpful template ready to go. Here's my commit message template:

```text
## If applied, this commit will...
## [Add/Fix/Remove/Update/Refactor/Document] [issue #id] [summary]


## Why is it necessary? (Bug fix, feature, improvements?)
-
## How does the change address the issue?
-
## What side effects does this change have?
-
```

I'm a fan of this format because commented lines are not included in the final message. I can simply fill in the blank lines with text and bullet points under the prompts, and it comes out looking something like this:

```txt
Fix #16 missing CSS variables
- Fix for unstyled elements
- Add background color, height for code blocks
- Only affects highlight class
```

### Reference related discussion

Issue trackers in [GitHub](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) and [Bitbucket](https://confluence.atlassian.com/bitbucket/resolve-issues-automatically-when-users-push-code-221451126.html) both recognize the keywords `close`, `fix`, and `resolve` followed immediately by the issue or pull request number. These keywords conveniently help us close the referenced issue or pull request, and this helps maintain a clear trail of changes. [GitLab](https://docs.gitlab.com/ee/user/project/issues/crosslinking_issues.html), and issue trackers like [Jira](https://confluence.atlassian.com/jirasoftwarecloud/referencing-issues-in-your-development-work-777002789.html) offer similar functionalities.

### Use helpful Vim settings for git commit messages

By adding a few lines to our Vim configuration, we can make writing great git commit messages easy. We can add these lines to `~/.vimrc` to turn on syntax highlighting in general, and spell check and text wrapping for commit messages in particular:

```vimrc
" Filetype detection, plugins, and indent rules
filetype plugin indent on

" Syntax highlighting
syntax on

" Spell check and line wrap just for git commit messages
autocmd Filetype gitcommit setlocal spell textwidth=72
```

If you're curious, you can find my full `~/.vimrc` in my [dotfiles](https://github.com/victoriadrake/dotfiles).

Other editors have settings that can help us out as well. I came across [these for Sublime Text 3](https://dev.to/shreyasminocha/how-i-do-my-git-commits-34d) and [language specific settings for VS Code](https://github.com/Microsoft/vscode-docs/blob/master/docs/getstarted/tips-and-tricks.md#language-specific-settings).

## One change per commit: how to squash Git commits

{{< figure src="git-commit-squash.png" alt="A doodle of squash" caption="Still life Git" >}}

Let's get one thing out of the way first: rewriting Git history just for the sake of having a pretty tree, especially with public repositories, is generally not advisable. It's kind of like going back in time, where changes you make to your version of the project cause it to look completely different from a version that someone else forked from a point in history that you've now erased - I mean, haven't you seen _Back to the Future Part II_? (If you'd rather maintain that only one _Back to the Future_ movie was ever made, thus sparing your future self from having to watch the sequels, I get it.)

Here's the main point. If you've pushed messy commits to a public repository, I say go right ahead and leave them be, instead of complicating things further. (We all learn from our embarrassments, especially the public ones - I'm looking at you, past-Vicky.) If your messy commits currently only exist on your local version, great! We can tidy them up into one clean, well-described commit that we'll be proud to push, and no one will be the wiser.

There are a couple different ways to squash commits, and choosing the appropriate one depends on what we need to achieve.

The following examples are illustrated using `git log --graph`, with some options for brevity. We can set a handy alias to see this log format in our terminal with:

```sh
git config --global alias.plog "log --graph --pretty=format:'%h -%d %s %n' --abbrev-commit --date=relative --branches"
```

Then we just do `git plog` to see the pretty log.

### Method #1: one commit to rule the master branch

This is appropriate when:

* We're committing directly to master
* We don't intend to open a pull request to merge a feature
* We don't want to preserve history of branches or changes we haven't yet pushed

This method takes a Git tree that looks like this:

```text
*   3e8fd79 - (HEAD -> master) Fix a thing
|
*   4f0d387 - Tweak something
|
*   0a6b8b3 - Merge branch 'new-article'
|\
| * 33b5509 - (new-article) Update article again again
| |
| * 1782e63 - Update article again
| |
| * 3c5b6a8 - Update article
| |
* | f790737 - (master) Tweak unrelated article
|/
|
* 65af7e7 Add social media link
|
* 0e3fa32 (origin/master, origin/HEAD) Update theme
```

And makes it look like this:

```text
* 7f9a127 - (HEAD -> master) Add new article
|
* 0e3fa32 - (origin/master, origin/HEAD) Update theme
```

Here's how to do it - hold on to your hoverboards, it's super complicated:

```sh
git reset --soft origin/master
git commit
```

Yup that's all. We can delete the unwanted branch with `git branch -D new-article`.

### Method #2: not _that_ much

This is appropriate when:

* We want to squash the last _x_ commits but not _all_ commits since `origin/master`
* We want to open a pull request to merge a branch

This method takes a Git tree that looks like this:

```text
* 13a070f - (HEAD -> new-article) Finish new article
|
* 78e728a - Edit article draft
|
* d62603c - Add example
|
* 1aeb20e - Update draft
|
* 5a8442a - Add new article draft
|
| * 65af7e7 - (master) Add social media link
|/
|
* 0e3fa32 - (origin/master, origin/HEAD) Update theme
```

And makes it look like this:

```text
* 90da69a - (HEAD -> new-article) Add new article
|
| * 65af7e7 - (master) Add social media link
|/
|
* 0e3fa32 - (origin/master, origin/HEAD) Update theme
```

To squash the last five commits on branch `new-article` into one, we use:

```sh
git reset --soft HEAD~5
git commit -m "New message for the combined commit"
```

Where `--soft` leaves our files untouched and staged, and `5` can be thought of as "the number of previous commits I want to combine."

We can then do `git merge master` and create our pull request.

### Method #3: getting picky

Say we had a really confusing afternoon and our Git tree looks like this:

```text
* dc89918 - (HEAD -> master) Add link
|
* 9b6780f - Update image asset
|
* 6379956 - Fix CSS bug
|
*   16ee1f3 - Merge master into branch
|\
| |
| * ccec365 - Update list page
| |
* | 033dee7 - Fix typo
| |
* | 90da69a - Add new article
|/
|
* 0e3fa32 - (origin/master, origin/HEAD) Update theme
```

We want to retain some of this history, but clean up the commits. We also want to change the messages for some of the commits. To achieve this, we'll use `git rebase`.

This is appropriate when:

* We want to squash only some commits
* We want to edit previous commit messages
* We want to delete or reorder specific commits

Git `rebase` is a powerful tool, and handy once we've got the hang of it. To change all the commits since `origin/master`, we do:

```sh
git rebase -i origin/master
```

Or, we can do:

```sh
git rebase -i 0e3fa32
```

Where the commit hash is the last commit we want to retain as-is.

The `-i` option lets us run the interactive rebase tool, which launches our editor with, essentially, a script for us to modify. We'll see a list of our commits in reverse order to the git log, with the oldest at the top:

```text
pick 90da69a Add new article
pick 033dee7 Fix typo
pick ccec365 Update list page
pick 6379956 Fix CSS bug
pick 9b6780f Update image asset
pick dc89918 Add link

# Rebase 0e3fa32..dc89918 onto 0e3fa32 (6 commands)
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
# d, drop = remove commit
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
#
~
```

The comments give us a handy guide as to what we're able to do. For now, let's squash the commits with small changes into the more significant commits. In our editor, we change the script to look like this:

```text
pick 90da69a Add new article
squash 033dee7 Fix typo
pick ccec365 Update list page
squash 6379956 Fix CSS bug
squash 9b6780f Update image asset
squash dc89918 Add link
```

Once we save the changes, the interactive tool continues to run. It will execute our instructions in sequence. In this case, we see the editor again with the following:

```text
# This is a combination of 2 commits.
# This is the 1st commit message:

Add new article

# This is the commit message #2:

Fix typo

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# interactive rebase in progress; onto 0e3fa32
# Last commands done (2 commands done):
#    pick 90da69a Add new article
#    squash 033dee7 Fix typo
# Next commands to do (4 remaining commands):
#    pick ccec365 Update list page
#    squash 6379956 Fix CSS bug
# You are currently rebasing branch 'master' on '0e3fa32'.
#
# Changes to be committed:
#       modified:   ...
#
~
```

Here's our chance to create a new commit message for this first squash, if we want to. Once we save it, the interactive tool will go on to the next instructions. Unless...

```text
[detached HEAD 3cbad01] Add new article
 1 file changed, 129 insertions(+), 19 deletions(-)
Auto-merging content/dir/file.md
CONFLICT (content): Merge conflict in content/dir/file.md
error: could not apply ccec365... Update list page

Resolve all conflicts manually, mark them as resolved with
"git add/rm <conflicted_files>", then run "git rebase --continue".
You can instead skip this commit: run "git rebase --skip".
To abort and get back to the state before "git rebase", run "git rebase --abort".

Could not apply ccec365... Update list page
```

Again, the tool offers some very helpful instructions. Once we fix the merge conflict, we can resume the process with `git rebase --continue`. Our interactive rebase picks up where it left off.

Once all the squashing is done, our Git tree looks like this:

```text
* 3564b8c - (HEAD -> master) Update list page
|
* 3cbad01 - Add new article
|
* 0e3fa32 - (origin/master, origin/HEAD) Update theme
```

Phew, much better.

## Git stash

If we're in the middle of some work and it's not a good time to commit, but we need to switch branches, [stashing](https://git-scm.com/book/en/v2/Git-Tools-Stashing-and-Cleaning) can be a good option. Stashing lets us save our unfinished work without needing to create a half-assed commit. It's like that pile of paper on your desk representing all the stuff you've been in the middle of doing since two weeks ago. Yup, that one.

It's as easy as typing `git stash`:

```text
Saved working directory and index state WIP on master: 3564b8c Update list page
```

The dirty work we're in the midst of is safely tucked away, and our working directory is clean - just as it was after our last commit. To see what's in our stash stack, we do `git stash list`:

```text
stash@{0}: WIP on master: 3564b8c Update list page
stash@{1}: WIP on master: 90da69a Add new article
stash@{2}: WIP on cleanup: 0e3fa32 Update theme
```

To restore our work in progress, we use `git stash apply`. Git will try and apply our most recent stashed work. To apply an older stash, we use `git stash apply stash@{1}` where `1` is the stash to apply. If changes since stashing our work prevent the stash from reapplying cleanly, Git will give us a merge conflict to resolve.

Applying a stash doesn't remove it from our list. To remove a stash from our stack, we do `git stash drop stash@{0}` where `0` is the one we want to remove.

We can also use `git stash pop` to apply the most recent stash and then immediately remove it from the stack.

## Tag release versions using annotated Git tags

In the spirit of having a beautiful, clean Git history, there's one more thing we can do to help make our commit log inspire infinite joy in its viewers. If you've never heard of `git tag`, your master branch history might look like this...

```text
* 0377782 - Update theme
|
* ecf8128 - Add about page (#25)
|
* 33e432f - Fix #23 navigation bug
|
* 08b853b - Create blog section
|
* 63d18b4 - Add theme (#12)
|
* 233e23f - Add main content (#6)
```

Wouldn't it be nice if it looked like this instead?

```text
* 0377782 - (tag: v2.1.0) Update theme
|
* ecf8128 - Add about page (#25)
|
* 33e432f - Fix #23 navigation bug
|
* 08b853b - (tag: v2.0.0) Create blog section
|
* 63d18b4 - Add theme (#12)
|
* 233e23f - (tag: v1.1.0) Add main content (#6)
```

We can tag Git commits with anything, but tags are especially helpful for semantic versioning of releases. Sites like [GitHub](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release) and [GitLab](https://docs.gitlab.com/ee/user/project/releases/) have pages for repositories that list tags, letting viewers of our project browse the release versions. This can be helpful for public projects to differentiate major releases, updates with bug fixes, or beta versions.

There are two types of Git tags: lightweight and annotated. For adding a version tag to commits, we use annotated Git tags.

The [Git tag documentation](https://git-scm.com/docs/git-tag) explains it this way:

> Tag objects (created with -a, -s, or -u) are called "annotated" tags; they contain a creation date, the tagger name and e-mail, a tagging message, and an optional GnuPG signature. Whereas a "lightweight" tag is simply a name for an object (usually a commit object).
>
> Annotated tags are meant for release while lightweight tags are meant for private or temporary object labels. For this reason, some git commands for naming objects (like git describe) will ignore lightweight tags by default.

We can think of lightweight tags as bookmarks, and annotated tags as signed releases.

For public repositories, annotated tags allow us to:

* See who tagged the commit, which may differ from the commit author
* See all the tags with `git describe`
* Avoid conflicting tag names

To create an annotated Git tag and attach it to our current (last) commit, we do:

```sh
git tag -a v1.2.0 -m "Clever release title"
```

This tags the commit on our local repository. To push all annotated tags to the remote, we do:

```sh
git push --follow-tags
```

We can also set our Git configuration to push our annotated tags by default:

```sh
git config --global push.followTags true
```

If we then want to skip pushing tags this time, we pass `--no-follow-tags`.

## Practice responsible commits

A little time invested in getting familiar with these tools and practices can make your commits even more useful and well-crafted. With a little practice, these processes will become second nature. You can make it even easier by creating a personal commit checklist on paper to keep handy while you work - or if that isn't fun enough, [make it an interactive pre-commit hook.](/blog/an-automatic-interactive-pre-commit-checklist-in-the-style-of-infomercials/)

Creating clean, useful, and responsible Git commits says a lot about you. Especially in remote work, Git commits may be a primary way that people interact with you over projects. With a little practice and effort, you can make your commit habits an even better reflection of your best work - work that is evidently created with care and pride.

If you enjoyed this post, there's a lot more where it came from! I write about computing, cybersecurity, and leading great technical teams. [Subscribe on victoria.dev](https://victoria.dev) to see new articles first, and check out the ones below!
