---
title: Post to your static website from your iPhone
date: 2024-05-05 
categories: ["article"] 
description: Hugo + Collected Notes for a more modern static website solution.
tags: 
    
draft: false
image: mock.png
---

I love websites. I love static sites in particular. But I know that sometimes it's just not practical to write and post only from your computer. With my hands full raising a family, I do a lot more development in stops and starts from my phone these days than I thought I ever would.

So I brought together everything that's great about Hugo plus everything that's great about sharing your 3AM thoughts with the world from your phone, thanks to Collected Notes. I put it in a new Hugo site template with a fancy new theme I call Quint.

You can deploy the Quint site template with one button (this button):

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/victoriadrake/quint-demo)

The Quint template can use the Collected Notes app as a CMS and also saves your posts to the site repository, for [redundancy](https://victoria.dev/posts/digital-resilience-redundancy-for-websites-and-communications/). It fetches new posts each time you build, and if you're deploying via Netlify or GitHub Actions, you can use a webhook to deploy the site whenever you make a new post with Collected Notes.

To set up your own site:

1. Deploy the Quint template to Netlify with the button above, or clone the repo if you plan to use another deployment solution.
2. Sign up for [Collected Notes](https://collectednotes.com/) if you haven't already (there's a free plan) and download the Collected Notes app on your iPhone.
3. Update the `utils/fetch-posts.js` file to use your Collected Notes site name.
4. Allow the GitHub Action to push changes back to your repository to save your posts. Under Settings > Actions > General > Workflow permissions, choose Read and write permissions.

Netlify will trigger a new build each time you push to your site repo, or, if you have a Collected Notes Premium subscription, you can set a [Netlify Build Hook](https://docs.netlify.com/configure-builds/build-hooks/) URL in your Collected Notes site settings to automatically redeploy the site when you make a post or update an existing post.

I hope you found this post helpful! If you have any suggestions or improvements to add, feel free to [contribute to the repository](https://github.com/victoriadrake/quint-demo).
