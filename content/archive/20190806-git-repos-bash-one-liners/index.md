---
title: How to write Bash one-liners for cloning and managing GitHub and GitLab repositories
date: 2019-08-06T10:55:19-04:00

aliases:
    - /verbose/how-to-clone-github-repositories-and-back-up-to-gitlab-with-bash-one-liners/
    - /verbose/bash-one-liners-to-clone-all-your-github-repositories-and-back-them-up-to-gitlab/
    - /verbose/how-to-write-bash-one-liners-for-cloning-and-managing-github-and-gitlab-repositories/
description: Using xargs and awk in Bash to automate managing remote-hosted repositories.
tags:
    
    
    - git
    - data
 
draft: false
categories: ["article"]
---

Few things are more satisfying to me than one elegant line of Bash that automates hours of tedious work. As part of some recent explorations into [automatically re-creating my laptop with Bash scripts](/blog/how-to-set-up-a-fresh-ubuntu-desktop-using-only-dotfiles-and-bash-scripts/), I wanted to find a way to easily clone my GitHub-hosted repositories to a new machine. After a bit of digging around, I wrote a one-liner that did just that. Then, in the spirit of not putting all our eggs in the same basket, I wrote another one-liner to automatically create and push to GitLab-hosted backups as well. Here they are.

## A Bash one-liner to clone all your GitHub repositories

Caveat: you'll need a list of the GitHub repositories you want to clone. The good thing about that is it gives you full agency to choose just the repositories you want on your machine, instead of going in whole-hog.

You can easily clone GitHub repositories without entering your password each time by using HTTPS with your [15-minute cached credentials](https://docs.github.com/en/get-started/getting-started-with-git/caching-your-github-credentials-in-git) or, my preferred method, by [connecting to GitHub with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh). For brevity I'll assume we're going with the latter, and our SSH keys are set up.

Given a list of GitHub URLs in the file `gh-repos.txt`, like this:

```txt
git@github.com:username/first-repository.git
git@github.com:username/second-repository.git
git@github.com:username/third-repository.git
```

We run:

```bash
xargs -n1 git clone < gh-repos.txt
```

This clones all the repositories on the list into the current folder. This same one-liner works for GitLab repositories as well, if you substitute the appropriate URLs.

### What's going on here

There are two halves to this one-liner: the input, counterintuitively on the right side, and the part that makes stuff happen, on the left. We could make the order of these parts more intuitive (maybe?) by writing the same command like this:

```bash
<gh-repos.txt xargs -n1 git clone
```

To run a command for each line of our input, `gh-repos.txt`, we use `xargs -n1`. The tool `xargs` reads items from input and executes any commands it finds (it will `echo` if it doesn't find any). By default, it assumes that items are separated by spaces; new lines also works and makes our list easier to read. The flag `-n1` tells `xargs` to use `1` argument, or in our case, one line, per command. We build our command with `git clone`, which `xargs` then executes for each line. Ta-da.

## A Bash one-liner to create and push many repositories on GitLab

GitLab, unlike GitHub, lets us do this nifty thing where we don't have to use the website to make a new repository first. We can [create a new GitLab repository from our terminal](https://docs.gitlab.com/ee/user/project/working_with_projects.html#create-a-new-project-with-git-push). The newly created repository defaults to being set as Private, so if we want to make it Public on GitLab, we'll have to do that manually later.

The GitLab docs tell us to push to create a new project using `git push --set-upstream`, but I don't find this to be very convenient for using GitLab as a backup. As I work with my repositories in the future, I'd like to run one command that pushes to both GitHub _and_ GitLab without additional effort on my part.

To make this Bash one-liner work, we'll also need a list of repository URLs for GitLab (ones that don't exist yet). We can easily do this by copying our GitHub repository list, opening it up with Vim, and doing a [search-and-replace](https://vim.fandom.com/wiki/Search_and_replace):

```bash
cp gh-repos.txt gl-repos.txt
vim gl-repos.txt
:%s/\<github\>/gitlab/g
:wq
```

This produces `gl-repos.txt`, which looks like:

```txt
git@gitlab.com:username/first-repository.git
git@gitlab.com:username/second-repository.git
git@gitlab.com:username/third-repository.git
```

We can create these repositories on GitLab, add the URLs as remotes, and push our code to the new repositories by running:

```bash
awk -F'\/|(\.git)' '{system("cd ~/FULL/PATH/" $2 " && git remote set-url origin --add " $0 " && git push")}' gl-repos.txt
```

Hang tight and I'll explain it; for now, take note that `~/FULL/PATH/` should be the full path to the directory containing our GitHub repositories.

We do have to make note of a couple assumptions:

1. The name of the directory on your local machine that contains the repository is the same as the name of the repository in the URL (this will be the case if it was cloned with the one-liner above);
2. Each repository is currently checked out to the branch you want pushed, ie. `master`.

The one-liner could be expanded to handle these assumptions, but it is the humble opinion of the author that at that point, we really ought to be writing a Bash script.

### What's going on here

Our Bash one-liner uses each line (or URL) in the `gl-repos.txt` file as input. With `awk`, it splits off the name of the directory containing the repository on our local machine, and uses these pieces of information to build our larger command. If we were to `print` the output of `awk`, we'd see:

```bash
cd ~/FULL/PATH/first-repository && git remote set-url origin --add git@gitlab.com:username/first-repository.git && git push
cd ~/FULL/PATH/second-repository && git remote set-url origin --add git@gitlab.com:username/second-repository.git && git push
cd ~/FULL/PATH/third-repository && git remote set-url origin --add git@gitlab.com:username/third-repository.git && git push
```

Let's look at how we build this command.

#### Splitting strings with `awk`

The tool `awk` can split input based on [field separators](https://www.gnu.org/software/gawk/manual/html_node/Command-Line-Field-Separator.html). The default separator is a whitespace character, but we can change this by passing the `-F` flag. Besides single characters, we can also use a [regular expression field separator](https://www.gnu.org/software/gawk/manual/html_node/Regexp-Field-Splitting.html#Regexp-Field-Splitting). Since our repository URLs have a set format, we can grab the repository names by asking for the substring between the slash character `/` and the end of the URL, `.git`.

One way to accomplish this is with our regex `\/|(\.git)`:

* `\/` is an escaped `/` character;
* `|` means "or", telling awk to match either expression;
* `(\.git)` is the capture group at the end of our URL that matches ".git", with an escaped `.` character. This is a bit of a cheat, as ".git" isn't strictly splitting anything (there's nothing on the other side) but it's an easy way for us to take this bit off.

Once we've told `awk` where to split, we can grab the right substring with the [field operator](https://www.gnu.org/software/gawk/manual/html_node/Fields.html#index-_0024-_0028dollar-sign_0029_002c-_0024-field-operator). We refer to our fields with a `$` character, then by the field's column number. In our example, we want the second field, `$2`. Here's what all the substrings look like:

```bash
1: git@gitlab.com:username
2: first-repository
```

To use the whole string, or in our case, the whole URL, we use the field operator `$0`. To write the command, we just substitute the field operators for the repository name and URL. Running this with `print` as we're building it can help to make sure we've got all the spaces right.

```bash
awk -F'\/|(\.git)' '{print "cd ~/FULL/PATH/" $2 " && git remote set-url origin --add " $0 " && git push"}' gl-repos.txt
```

#### Running the command

We build our command inside the parenthesis of `system()`. By using this as the output of `awk`, each command will run as soon as it is built and output. The `system()` function creates a [child process](https://en.wikipedia.org/wiki/Child_process) that executes our command, then returns once the command is completed. In plain English, this lets us perform the Git commands on each repository, one-by-one, without breaking from our main process in which `awk` is doing things with our input file. Here's our final command again, all put together.

```bash
awk -F'\/|(\.git)' '{system("cd ~/FULL/PATH/" $2 " && git remote set-url origin --add " $0 " && git push")}' gl-repos.txt
```

#### Using our backups

By adding the GitLab URLs as remotes, we've simplified the process of pushing to both externally hosted repositories. If we run `git remote -v` in one of our repository directories, we'll see:

```bash
origin  git@github.com:username/first-repository.git (fetch)
origin  git@github.com:username/first-repository.git (push)
origin  git@gitlab.com:username/first-repository.git (push)
```

Now, simply running `git push` without arguments will push the current branch to both remote repositories.

We should also note that `git pull` will generally only try to pull from the remote repository you originally cloned from (the URL marked `(fetch)` in our example above). Pulling from multiple Git repositories at the same time is possible, but complicated, and beyond the scope of this post. Here's an [explanation of pushing and pulling to multiple remotes](https://astrofloyd.wordpress.com/2015/05/05/git-pushing-to-and-pulling-from-multiple-remote-locations-remote-url-and-pushurl/) to help get you started, if you're curious. The [Git documentation on remotes](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes) may also be helpful.

## To elaborate on the succinctness of Bash one-liners

Bash one-liners, when understood, can be fun and handy shortcuts. At the very least, being aware of tools like `xargs` and `awk` can help to automate and alleviate a lot of tediousness in our work. However, there are some downsides.

In terms of an easy-to-understand, maintainable, and approachable tool, Bash one-liners suck. They're usually more complicated to write than a Bash script using `if` or `while` loops, and certainly more complicated to read. It's likely that when we write them, we'll miss a single quote or closing parenthesis somewhere; and as I hope this post demonstrates, they can take quite a bit of explaining, too. So why use them?

Imagine reading a recipe for baking a cake, step by step. You understand the methods and ingredients, and gather your supplies. Then, as you think about it, you begin to realize that if you just throw all the ingredients at the oven in precisely the right order, a cake will instantly materialize. You try it, and it works!

That would be pretty satisfying, wouldn't it?
