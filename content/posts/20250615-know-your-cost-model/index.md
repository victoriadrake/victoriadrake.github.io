---
title: "I Spent $78 Learning Why Bash Still Matters in the AI Age"
date: 2025-06-15T14:09:42Z
categories:
description: When AI tools cost 100x more than command line solutions.
tags:
    - algorithms
    - ai
    - compsci
draft: false
---

Here’s how a little laziness cost me $78.

While working on a personal project recently, I wanted Cline to process about a hundred files that were each in subdirectories of a project. I fired up Cline and picked Gemini 2.5 Pro (context window FTW) and asked it to recurse through the subdirectories, process the files, and put the results in a new file.

Cline got to work… slowly. I watched as the “API Request…” spinner appeared for each file read and each time it saved the results. About twenty minutes and $26 later, it finished.

Okay, I thought, that’s not great, but not untenable. The cost of convenience, right? I opened up the results file to take a look and.. *sigh*. Not great work. It was obvious that some files had been skipped despite my very careful instructions to process each and every one.

So, like a glutton for punishment, I made a list of the files Cline had skipped and asked it to try again. Tired of babysitting, I raised the “Maximum Request Auto Approval” limit to more than I thought would be needed to finish processing the files that were left, and went to take a coffee break.

When I came back, Cline was done. The results? Still not great. Files had still been skipped, some files that were processed were missing results, and, oh, my task bill had risen to $78.

Okay, *this* was untenable. Reading all this data into context was costly and slow.

Then the coffee started to kick in, I guess, because it dawned on me: why in the world was I using expensive API calls to do something a Bash one-liner could do?

> "Cline, write a Bash command that will recurse through the `data/` directory and obtain the content of all the files and copy it into a single new file."

Which produced:

```bash
find data/ -type f -exec cat {} + > all_data.txt
```

This command:

- `find data/` - searches recursively in the `data` directory.
- `-type f` - specifies that we're looking for files only (not directories, links, etc.).
- `-exec cat {} +` - for all files found, execute the `cat` command. The `{}` is a placeholder for the filename, and the `+` is a crucial optimization that groups multiple filenames into a single `cat` command, avoiding the overhead of launching a new process for every single file.
- `> all_data.txt` - redirects the standard output of the `cat` command (which is the concatenated content of all the files) into a new file named `all_data.txt`.

Then I asked Cline to read the resulting `all_data.txt` file, process it, and output the results.

It took about two minutes.

And it cost me $0.78.

## What just happened?

My initial naive approach had accidentally created a perfect storm of computational inefficiency.

When Cline processed each file individually, it was making separate API calls for every single operation - reads, writes, the works. With about 100 files, that meant roughly 200+ API calls, each one spinning up its own network round-trip with all the latency that entails. Every time I saw that “API Request…” spinner, I was watching money float away into the ether.

But here’s the kicker: large language models like Gemini charge based on token consumption.

> It’s not just the file content they’re charging for; **every single API call also included the entire conversation history, system prompts, and my instructions.**

With a stateless API, that context has to be re-transmitted with every single request. If my average context was around 10,000 tokens and I made 200 calls, I burned through 2 million tokens (10,000 * 200) on overhead alone, before even counting the actual data.

Combining all the files with bash flipped this whole equation on its head. Instead of 200 API calls, I made exactly one. Instead of bearing the network latency for every file operation, combining the files locally on my machine meant the filesystem could actually optimize that work. What had taken almost an hour of network round-trips for Gemini to access all the data was reduced to a couple hundred milliseconds of local file operations.

## The expensive lesson in algorithmic thinking

This whole debacle reminded me why understanding the cost model of your tools matters just as much as understanding their capabilities. API pricing is designed around per-request and per-token charges, which naturally punishes fine-grained operations. It’s similar to how databases are optimized for bulk operations rather than processing individual rows - the overhead of each transaction quickly becomes the bottleneck.

My first approach had O(n) complexity for API calls, where n equals the number of files. The bash solution reduced that to O(1) by batching everything locally first. That’s the difference between linear scaling and constant cost, and at $78, I felt every bit of that mathematical distinction.

There’s also something to be said about data locality here. My original method couldn’t take advantage of any local caching or filesystem optimizations. Every operation had to go over the network to an API server, get processed, and come back. The bash approach kept everything local until the very end, letting my machine’s filesystem cache work its magic.

## The real cost of convenience

I’d fallen into the trap of thinking that because I *could* use an AI tool for everything, I *should* use it for everything. But there’s a difference between leveraging AI for tasks that require intelligence and using it as an expensive replacement for basic system utilities.

The irony is that I probably spent more mental energy managing and troubleshooting the AI approach than I would have just thinking through the problem for five minutes and reaching for the right tool from the start. Sometimes the most sophisticated solution is knowing when to employ a basic tool.

My little bit of laziness bought me a $78 lesson that boils down to this: always understand the economic model of your tools, especially when they’re priced per operation. The most elegant and cost-effective solution isn’t always the newest and most technically exciting one.
