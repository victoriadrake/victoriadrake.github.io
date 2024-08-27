---
date: 2024-08-27T13:55:47.820Z
title: "How to Create Technical Documentation Using ChatGPT"
datePublished: Tue Aug 27 2024 13:55:32 GMT+0000 (Coordinated Universal Time)
cuid: cm0chp6ka001309jwdjaxffnl
slug: how-to-create-technical-documentation-using-chatgpt
canonical: https://victoria.dev/posts/how-to-create-technical-documentation-using-chatgpt
image: https://cdn.hashnode.com/res/hashnode/image/upload/v1724610603073/dbed6199-8e9c-4858-b299-a8d84e280156.jpeg
tags:
    - ai
    - docs

---

No need to print out stacks of code when conversational AI can summarize it for you. (Photo is Margaret Hamilton, a computer scientist who played a crucial role in developing the software for the Apollo space program at NASA, standing next to a towering stack of printed code that she and her team wrote for the Apollo Guidance Computer.)

I've maintained for years that good code isn't that great without good documentation. It's a shame that this area is so often overlooked. Good docs don't have to be hard to write and often help you organize your thoughts -- which makes the code better as well.

Of course, I understand that some people much prefer writing code to writing docs. Here, conversational AI like ChatGPT can do most of the heavy lifting for you. Here are a few strategies for getting ChatGPT to write your docs.

## Quality Code Basics

If your code is ever going to be seen by people other than yourself, there's no excuse to not have a README and simple Getting Started guide. (Even if you're the only one to ever look at it, it's a near-guarantee that you'll forget how something works.)

The ChatGPT web interface allows you to upload files. You can provide your code files and ask ChatGPT to create your docs with a prompt such as:

> Write a straightforward README for the repository that contains these files. Include a beginner-friendly Getting Started section that starts with cloning the repository and installing any necessary dependencies.

If you want ChatGPT to get as close as it can to a complete document that you can copy and paste into your git repository, you can also provide details such as:

* The repo URL
    
* The license type, if any
    
* Instructions for potential contributors
    
* Ways to support the project financially
    
* Links to find you or your project on social media
    

Now your job is as simple as giving the results a read-through and run-through to ensure it makes sense and that instructions are correct. For simple projects or established frameworks, I've found ChatGPT to be accurate and complete.

What if your project isn't simple? In this case, you might benefit from some more in-depth documentation.

## In-Depth Documentation

More complicated projects or ones that don't use an established framework can benefit from in-depth documentation to guide new contributors or refresh the memories of their builders.

ChatGPT can help you write in-depth documentation with a prompt such as:

> Explain this code to me. Start with an overview of what it does in simple language, then detail how all the parts and functions connect in an in-depth technical manner. Describe anything I might need to know about adding to or modifying this code in the future.

Prompts like this are a great practice, whether or not you need the resulting docs. It's like having an always-available programming partner to look over your work and see if it makes sense to someone other than yourself.

Reading the results will help ensure they're correct, that the code you wrote does what you intended it to, and can even help highlight areas for further improvement.

## Inline Documentation

Over years of working with many different teams, developers, and technical leaders, I've come to see that some folks just don't read anything outside of the code files. It's an unfortunate habit that I encourage changing -- reading your team's docs, forum threads, blog posts, etc. can save you time and energy and help inspire your own work.

In the meantime, ChatGPT can still help by creating inline documentation. This can be language-specific (like `pydoc` docstrings, which have the added benefit of generating standalone documentation) or it could take the form of simple comments in the code file.

To generate inline docs, upload your files to ChatGPT and use a prompt such as:

> Add inline documentation to this code file without changing any of the code. Add short explanations to each function that document what it does and its input and output.

## A Few Tips

If you find your results lacking, try providing more context about what the code does in plain language. When communicating (with software developers or ChatGPT) it helps to start by giving context about the general intent, goal, or desired end result. If you find it's difficult to explain, you may have highlighted some opportunities for improvement that would benefit both your docs and your code.

A note on execution: for very long code files, it can be cumbersome to copy and paste the results. ChatGPT can give you a zip of your updated file(s) if you add an instruction to do so, i.e. "...and give me the updated file to download."

I hope I've given you some inspiration of how using ChatGPT for documentation can streamline the process and improve clarity. Whether it's in a README, detailed explanations, or found in inline comments, good documentation helps make your code more accessible. Now you can focus on coding while ensuring your project is well-documented and easier for others (and your future self) to understand and contribute to.
