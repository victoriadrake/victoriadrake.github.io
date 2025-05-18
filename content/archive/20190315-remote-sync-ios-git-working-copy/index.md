---
title: 'A remote sync solution for iOS and Linux: Git and Working Copy'
date: 2019-03-15T11:55:28-04:00
lastmod: 2020-12-02T11:55:28-04:00

aliases:
    - /verbose/a-remote-sync-solution-for-ios-and-linux-git-and-working-copy/
description: How to set up a cross-platform solution for working with Git on iOS.
tags:
    - linux
    - git
 
draft: false
categories: ["article"]

wasfeatured:
    - where : url
---

I'm always looking for pockets of time in which I can be productive. If you add up the minutes you spend in limbo while waiting in line, commuting, or waiting for food delivery (just me?), you may just find an extra hour or two in your day.

To take full advantage of these bits of time, I needed a solution that let me pick up work on my Git repositories wherever I happen to be. That means a remote sync solution that bridges my iOS devices (iPad and iPhone) and my Linux machine.

After a lot of trial and error, I've found one that works really well. With synced Git repositories on iOS, I can seamlessly pick up work for any of my repositories on the go.

## Components

* [Working Copy app](https://workingcopy.app) ($15.99 one-time pro-unlock and well worth it)
* [iA Writer app](https://ia.net/writer) ($8.99 one-time purchase for iOS, also available on Mac, Windows, and Android)
* GitHub repositories

## Get set up

Here are the steps to setting up that I'll walk you through in this article.

1. Create your remote repository
2. Clone repository to iPad with Working Copy
3. Open and edit files with iA Writer
4. Push changes back to remote
5. Pull changes from repository on your computer

This system is straightforward to set up whether you're a command line whiz or just getting into Git. Let's do it!

### Create your remote repository

Create a public or private repository on GitHub.

If you're creating a new repository, you can follow GitHub's instructions to push some files to it from your computer, or you can add files later from your iOS device.

### Clone repository to iOS with Working Copy

Download [Working Copy](https://workingcopy.app) from the App Store. It's a fantastic app. Developer [Anders Borum](https://twitter.com/palmin) has a steady track record of frequent updates and incorporating the latest features for iOS apps, like [drag and drop](https://workingcopy.app/manual/dragdrop) on iPad. I think he's fairly priced his product in light of the work he puts into maintaining and enhancing it.

In Working Copy, find the gear icon in the top left corner and touch to open Settings.

Tap on SSH Keys, and you'll see this screen:

SSH keys, or Secure Shell keys, are access credentials used in the [SSH protocol](https://en.wikipedia.org/wiki/Secure_Shell). Your key is a password that your device will use to securely connect with your remote repository host - GitHub, in this example. Since anyone with your SSH keys can potentially pretend to be you and gain access to your files, it's important not to share them accidentally, like in a screenshot on a blog post.

Tap on the second line that looks like **WorkingCopy@iPad-xxxxxxxx** to get this screen:

Working Copy supports easy connection to GitHub. Tap **Connect With GitHub** to bring up some familiar sign-in screens that will authorize Working Copy to access your account(s).

Once connected, tap the **+** symbol in the top right of the side bar to add a new repository. Choose **Clone repository** to bring up this screen:

Here, you can either manually input the remote URL, or simply choose from the list of repositories that Working Copy fetches from your connected account. When you make your choice, the app clones the repository to your device and it will show up in the sidebar. You're connected!

### Open and edit files with iA Writer

One of the (many) reasons I adore [iA Writer](https://ia.net/writer) is its ability to select your freshly cloned remote repository as a Library Location. To enable this, first open your Files app. On the Browse screen, tap the overflow menu (three dots) in the top right and choose **Edit**.

Turn on Working Copy as a location option:

Then in the iA Writer app:

1. From the main Library list, in the top right of the sidebar, tap **Edit**.
1. Tap **Add Location...**.
1. A helpful popup appears. Tap **OK**.
1. From the Working Copy location, tap **Select** in the top right, then choose the repository folder.
1. Tap **Open**, then **Done**.

Your remote repository now appears as a Location in the sidebar. Tap on it to work within this directory.

While inside this location, new files you create (by tapping the pencil-and-paper icon in the top right corner) will be saved to this folder locally. As you work, iA Writer automatically saves your progress. Next, we'll look at pushing those files and changes back to your remote.

### Push changes back to remote

Once you've made changes to your files, open Working Copy again. You should see a yellow dot on your changed repository.

Tap on your repository name, then on **Repository Status and Configuration** at the top of the sidebar. Your changed files will be indicated by yellow dots or green **+** symbols. These mean that you've modified or added files, respectively.

Working Copy is a sweet iOS Git client, and you can tap on your files to see additional information including a comparison of changes ("diff") as well as status and Git history. You can even edit files right within the app, with [syntax highlighting](https://workingcopyapp.com/manual/edit) for its many supported languages. For now, we'll look at how to push your changed work to your remote repository.

On the **Repository Status and Configuration** page, you'll see right at the top that there are changes to be committed. If you're new to Git, this is like "saving your changes" to your Git history, something typically done with the terminal command [`git commit`](https://git-scm.com/docs/git-commit). You can think of this as saving the files that we'll want to send to the GitHub repository. Tap **Commit changes**.

Enter your commit message, and select the files you want to add. Toggle the **Push** switch to send everything to your remote repository when you commit the files. Then tap **Commit**.

You'll see a progress bar as your files are uploaded, and then a confirmation message on the status screen.

Congratulations! Your changes are now present in your remote repository on GitHub. You've successfully synced your files remotely!

### Pull changes from repository on your computer

To bring your updated files full circle to your computer, you pull them from the GitHub repository. I prefer to use the terminal for this as it's quick and easy, but GitHub also offers a [graphical client](https://docs.github.com/en/desktop/overview/getting-started-with-github-desktop?platform=windows) if terminal commands seem a little alien for now.

If you started with the GitHub repository, you can clone it to a folder on your computer by following [these instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

### Staying in sync

When you update your work on your computer, you'll use Git to push your changes to the remote repository. To do this, you can use GitHub's [graphical client](https://docs.github.com/en/desktop/overview/getting-started-with-github-desktop?platform=windows), or follow [these instructions](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-an-existing-project-to-github-using-the-command-line).

On your iOS device, Working Copy makes pulling and pushing as simple as a single tap. On the Repository Status and Configuration page, tap on the remote name under **Remotes**.

Then tap **Synchronize**. Working Copy will take care of the details of pushing your committed changes and/or pulling any new changes it finds from the remote repository.

## Work anywhere

For a Git-based developer and work-anywhere-aholic like me, this set up couldn't be more convenient. Working Copy really makes staying in sync with my remote repositories seamless, nevermind the ability to work with any of my GitHub repos on the go.

I most recently used this set up to get some writing done while hanging out in the atrium of Washington DC's National Portrait Gallery, which is pleasantly photogenic.

Happy working! If you enjoyed this post, there's a lot more where this came from! I write about computing, cybersecurity, and leading great technical teams. [You can subscribe](/) to see new articles first.
