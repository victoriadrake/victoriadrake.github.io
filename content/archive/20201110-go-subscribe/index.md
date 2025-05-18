---
title: Build your own serverless subscriber list with Go and AWS
date: 2020-11-10T04:52:50-05:00

aliases:
description: How to build your own newsletter list with DynamoDB and SES email sign up confirmations.
tags:
    - api
    - aws
    - coding
    - go
    - data
    - cybersecurity
    - websites
image: envelope.png
 
draft: false
categories: ["article"]
---

You can now subscribe to my email list on [victoria.dev](/)! Here's how I lovingly built a subscription sign up flow with email confirmation that doesn't suck. You can too.

## Introducing Simple Subscribe

If you're interested in managing your own mailing list or newsletter, you can set up Simple Subscribe on your own AWS resources to collect email addresses. This open source API is written in Go, and runs on AWS Lambda. Visitors to your site can sign up to your list, which is stored in a DynamoDB table, ready to be queried or exported at your leisure.

When someone signs up, they'll receive an email asking them to confirm their subscription. This is sometimes called "double opt-in," although I prefer the term "verified." Simple Subscribe works on serverless infrastructure and uses an AWS Lambda to handle subscription, confirmation, and unsubscribe requests.

You can find the [Simple Subscribe project, with its fully open-source code, on GitHub](https://github.com/victoriadrake/simple-subscribe). I encourage you to pull up the code and follow along! In this post I'll share each build step, the thought process behind the API's single-responsibility functions, and security considerations for an AWS project like this one.

## Building a verified subscription flow

A non-verified email sign up process is straightforward. Someone puts their email into a box on your website, then that email goes into your database. However, if I've taught you anything about [not trusting user input](/blog/sql-injection-and-xss-what-white-hat-hackers-know-about-trusting-user-input/), the very idea of a non-verified sign up process should raise your hackles. Spam may be great when fried in a sandwich, but no fun when it's running up your AWS bill.

While you can use a strategy like a CAPTCHA or puzzle for is-it-a-human verification, these can create enough friction to turn away your potential subscribers. Instead, a confirmation email can help to ensure both address correctness and user sentience.

To build a subscription flow with email confirmation, create single-responsibility functions that satisfy each logical step. Those are:

1. Accept an email address and record it.
2. Generate a token associated with that email address and record it.
3. Send a confirmation email to that email address with the token.
4. Accept a verification request that has both the email address and token.

To achieve each of these goals, Simple Subscribe uses the [official AWS SDK for Go](https://docs.aws.amazon.com/sdk-for-go/api/) to interact with DynamoDB and SES.

At each stage, consider what the data looks like and how you store it. This can help to handle conundrums like, "What happens if someone tries to subscribe twice?" or even [threat-modeling](/blog/if-you-want-to-build-a-treehouse-start-at-the-bottom/) such as, "What if someone subscribes with an email they don't own?"

Ready? Let's break down each step and see how the magic happens.

### Subscribing

The subscription process begins with a humble web form, like the one on my site's main page. A form input with attributes `type="email" required` helps with validation, [thanks to the browser](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#Validation). When submitted, the form sends a GET request to the Simple Subscribe subscription endpoint.

Simple Subscribe receives a GET request to this endpoint with a query string containing the intended subscriber's email. It then generates an `id` value and adds both `email` and `id` to your DynamoDB table.

The table item now looks like:

| email                    | confirm | id           | timestamp           |
| ------------------------ | ------- | ------------ | ------------------- |
| `subscriber@example.com` | _false_ | `uuid-xxxxx` | 2020-11-01 00:27:39 |

The `confirm` column, which holds a boolean, indicates that the item is a subscription request that has not yet been confirmed. To verify an email address in the database, you'll need to find the correct item and change `confirm` to `true`.

As you work with your data, consider the goal of each manipulation and how you might compare an incoming request to existing data.

For example, if someone made a subsequent subscription request for the same email address, how would you handle it? You might say, "Create a new line item with a new `id`," however, this might not be best strategy when your serverless application database is paid for by request volume.

Since [DynamoDB Pricing](https://aws.amazon.com/dynamodb/pricing/) depends on how much data you read and write to your tables, it's advantageous to avoid piling on excess data.

With that in mind, it would be prudent to handle subscription requests for the same email by performing an update instead of adding a new line. Simple Subscribe actually uses the same function to either add or update a database item. This is typically referred to as, "update or insert."

In a database like SQLite this is accomplished with the [UPSERT syntax](https://www.sqlite.org/lang_UPSERT.html). In the case of DynamoDB, you use an update operation. For the [Go SDK](https://docs.aws.amazon.com/sdk-for-go/api/service/dynamodb/), its syntax is `UpdateItem`.

When a duplicate subscription request is received, the database item is matched on the `email` only. If an existing line item is found, its `id` and `timestamp` are overridden, which updates the existing database record and avoids flooding your table with duplicate requests.

### Verifying email addresses

After submitting the form, the intended subscriber then receives an email from SES containing a link. This link is built using the `email` and `id` from the table, and takes the format:

```url
<BASE_URL><VERIFY_PATH>/?email=subscriber@example.com&id=uuid-xxxxx
```

In this set up, the `id` is a UUID that acts as a secret token. It provides an identifier that you can match that is sufficiently complex and hard to guess. This approach deters people from subscribing with email addresses they don't control.

Visiting the link sends a request to your verification endpoint with the `email` and `id` in the query string. This time, it's important to compare both the incoming `email` and `id` values to the database record. This verifies that the recipient of the confirmation email is initiating the request.

The verification endpoint ensures that these values match an item in your database, then performs another update operation to set `confirm` to `true`, and update the timestamp. The item now looks like:

| email                    | confirm | id           | timestamp           |
| ------------------------ | ------- | ------------ | ------------------- |
| `subscriber@example.com` | _true_  | `uuid-xxxxx` | 2020-11-01 00:37:39 |

### Querying for emails

You can now query your table to build your email list. Depending on your email sending solution, you might do this manually, with another Lambda, or even from the command line.

Since data for requested subscriptions (where `confirm` is `false`) is stored in the table alongside confirmed subscriptions, it's important to differentiate this data when querying for email addresses to send to. You'll want to ensure you only return emails where `confirm` is `true`.

## Providing unsubscribe links

Similar to verifying an email address, Simple Subscribe uses `email` and `id` as arguments to the function that deletes an item from your DynamoDB table in order to unsubscribe an email address. To allow people to remove themselves from your list, you'll need to provide a URL in each email you send that includes their `email` and `id` as a query string to the unsubscribe endpoint. It would look something like:

```url
<BASE_URL><UNSUBSCRIBE_PATH>/?email=subscriber@example.com&id=uuid-xxxxx
```

When the link is clicked, the query string is passed to the unsubscribe endpoint. If the provided `email` and `id` match a database item, that item will be deleted.

Proving a method for your subscribers to automatically remove themselves from your list, without any human intervention necessary, is part of an ethical and respectful philosophy towards handling the data that's been entrusted to you.

## Caring for your data

Once you decide to accept other people's data, it becomes your responsibility to care for it. This is applicable to everything you build. For Simple Subscribe, it means maintaining the security of your database, and periodically pruning your table.

In order to avoid retaining email addresses where `confirm` is `false` past a certain time frame, it would be a good idea to set up a cleaning function that runs on a regular schedule. This can be achieved manually, with an AWS Lambda function, or using the command line.

To clean up, find database items where `confirm` is `false` and `timestamp` is older than a particular point in time. Depending on your use case and request volumes, the frequency at which you choose to clean up will vary.

Also depending on your use case, you may wish to keep backups of your data. If you are particularly concerned about data integrity, you can explore [On-Demand Backup](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/backuprestore_HowItWorks.html) or [Point-in-Time Recovery](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery.html) for DynamoDB.

## Build your independent subscriber base

Building your own subscriber list can be an empowering endeavor! Whether you intend to start a newsletter, send out notifications for new content, or want to create a community around your work, there's nothing more personal or direct than an email from me to you.

I encourage you to start building your subscriber base with Simple Subscribe today! Like most of my work, it's open source and free for your personal use. Dive into the code at [the GitHub repository](https://github.com/victoriadrake/simple-subscribe) or learn more at [SimpleSubscribe.org](https://simplesubscribe.org).
