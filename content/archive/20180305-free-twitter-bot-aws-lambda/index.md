---
title: Running a free Twitter bot on AWS Lambda
date: 2018-03-05T10:29:15-05:00

aliases:
    - /verbose/free-twitter-bot-aws-lambda
    - /verbose/running-a-free-twitter-bot-on-aws-lambda
    - /verbose/aws-lambda/
description: How to save some time with automated link sharing on Twitter - for free!
tags:
    - aws
    - go
image: cover_lambda-doodle.png
showtoc: true
draft: false
categories: ["article"]

wasfeatured:
    - freeCodeCamp : https://medium.freecodecamp.org/running-a-free-twitter-bot-on-aws-lambda-66160eb4de4
---

If you read [About time](/blog/about-time/), you'll know that I'm a big believer in spending time now on building things that save time in the future. To this end I built a simple Twitter bot in Go that would occasionally post links to my articles and keep my account interesting even when I'm too busy to use it. The tweets help drive traffic to my sites, and I don't have to lift a finger.

I ran the bot on an Amazon EC2 instance for about a month. My AWS usage has historically been pretty inexpensive (less than the price of a coffee in most of North America), so I was surprised when the little instance I was using racked up a bill 90% bigger than the month before. I don't think AWS is expensive, to be clear, but still... I'm cheap. I want my Twitter bot, and I want it for less.

I'd been meaning to explore AWS Lamda, and figured this was a good opportunity. Unlike an EC2 instance that is constantly running (and charging you for it), Lambda charges you per request and according to the duration of time your function takes to run. There's a free tier, too, and the first 1 million requests, plus a certain amount of compute time, are free. Roughly translated to running a Twitter bot that posts for you, say, twice a day, your monthly cost for using Lambda would total... carry the one... nothing. I've been running my Lambda function for a couple weeks now, completely free.

When recently it came to me to take the reigns of the [@freeCodeCampTO](https://twitter.com/freeCodeCampTO) Twitter, I decided to employ a similar strategy, and also use this opportunity to document the process for you, dear reader.

So if you're currently using a full-time running instance for a task that could be served by a cron job, this is the article for you. I'll cover how to write your function for Lambda, how to get it set up to run automatically, and as a sweet little bonus, a handy bash script that updates your function from the command line whenever you need to make a change. Let's do it!

## Is Lambda right for you

When I wrote the code for my Twitter bot in Go, I intended to have it run on an AWS instance and borrowed heavily from [Francesc's awesome Just for Func episode](https://github.com/campoy/justforfunc/tree/master/14-twitterbot). Some time later I modified it to randomly choose an article from my RSS feeds and tweet the link, twice a day. I wanted to do something similar for the @freeCodeCampTO bot, and have it tweet an inspiring quote about programming every morning.

This is a good use case for Lambda because:

* The program should execute once
* It runs on a regular schedule, using time as a trigger
* It doesn't need to run constantly

The important thing to keep in mind is that Lambda runs a function once in response to an event that you define. The most widely applicable trigger is a simple cron expression, but there are many other trigger events you can hook up. You can get an overview [here](https://aws.amazon.com/lambda/).

## Write a Lambda function

I found this really straightforward to do in Go. First, grab the [aws-lambda-go](https://github.com/aws/aws-lambda-go) library:

```bash
go get github.com/aws/aws-lambda-go/lambda
```

Then make this your `func main()`:

```go
func main() {
 lambda.Start(tweetFeed)
}
```

Where `tweetFeed` is the name of the function that makes everything happen. While I won't go into writing the whole Twitter bot here, you can view my code [on GitHub](https://gist.github.com/victoriadrake/7859dab68df87e28f40d6715d08383c7).

## Setting up AWS Lambda

I'm assuming you already have an AWS account. If not, first things first here: [https://aws.amazon.com/free](https://aws.amazon.com/free)

### 1. Create your function

Find AWS Lambda in the list of services, then look for this shiny button:

![Create function](lambda-01.png#screenshot)

We're going to author a function from scratch. Name your function, then under **Runtime** choose "Go 1.x".

Under **Role name** write any name you like. It's a required field but irrelevant for this use case.

Click **Create function.**

![Author from scratch](lambda-02.png#screenshot)

### 2. Configure your function

You'll see a screen for configuring your new function. Under **Handler** enter the name of your Go program.

![Configure your function](lambda-03.png#screenshot)

If you scroll down, you'll see a spot to enter environment variables. This is a great place to enter the Twitter API tokens and secrets, using the variable names that your program expects. The AWS Lambda function will create the environment for you using the variables you provide here.

![Environment variables](lambda-04.png#screenshot)

No further settings are necessary for this use case. Click **Save** at the top of the page.

### 3. Upload your code

You can upload your function code as a zip file on the configuration screen. Since we're using Go, you'll want to `go build` first, then zip the resulting executable before uploading that to Lambda.

...Of course I'm not going to do that manually every time I want to tweak my function. That's what `awscli` and this bash script is for!

`update.sh`

```sh
go build && \
zip fcc-tweet.zip fcc-tweet && \
rm fcc-tweet && \
aws lambda update-function-code --function-name fcc-tweet --zip-file fileb://fcc-tweet.zip && \
rm fcc-tweet.zip
```

Now whenever I make a tweak, I just run `bash update.sh`.

If you're not already using [AWS Command Line Interface](https://aws.amazon.com/cli/), do `pip install awscli` and thank me later. Find instructions for getting set up and configured in a few minutes [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) under **Quick Configuration**.

### 4. Test your function

Wanna see it go? Of course you do! Click "Configure test events" in the dropdown at the top.

![Configure test events](lambda-05.png#screenshot)

Since you'll use a time-based trigger for this function, you don't need to enter any code to define test events in the popup window. Simply write any name under **Event name** and empty the JSON in the field below. Then click **Create**.

![Configuring an empty test event](lambda-06.png#screenshot)

Click **Test** at the top of the page, and if everything is working correctly you should see...

![Test success notification](lambda-07.png#screenshot)

### 5. Set up CloudWatch Events

To run our function as we would a cron job - as a regularly scheduled time-based event - we'll use CloudWatch. Click **CloudWatch Events** in the **Designer** sidebar.

![CloudWatch Events trigger](lambda-08.png#screenshot)

Under **Configure triggers**, you'll create a new rule. Choose a descriptive name for your rule without spaces or punctuation, and ensure **Schedule expression** is selected. Then input the time you want your program to run as a *rate expression*, or cron expression.

A cron expression looks like this: `cron(0 12 * * ? *)`

| Minutes | Hours | Month | Day of week | Year | In English                  |
| ------- | ----- | ----- | ----------- | ---- | --------------------------- |
| 0       | 12    | `*`   | ?           | `*`  | Run at noon (UTC) every day |

For more on how to write your cron expressions, read [this.](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html)

If you want your program to run twice a day, say once at 10am and again at 3pm, you'll need to set two separate CloudWatch Events triggers and cron expression rules.

Click **Add**.

![Set cron expression rule](lambda-09.png#screenshot)

## Watch it go

That's all you need to get your Lambda function up and running! Now you can sit back, relax, and do more important things than share your RSS links on Twitter.
