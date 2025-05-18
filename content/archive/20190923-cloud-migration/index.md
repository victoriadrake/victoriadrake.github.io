---
title: Migrating to the cloud but without screwing it up, or how to move house
date: 2019-09-23T08:03:12-04:00

aliases:
    - /verbose/migrating-to-the-cloud-but-without-screwing-it-up-or-how-to-move-house/
description: A practical guide to moving to cloud services with minimal downtime, using AWS examples.
tags:
    - aws
    - coding
    - data
    - websites
image: cover.png
 
draft: false
categories: ["article"]
---

For an application that's ready to scale, not using managed cloud architecture these days is like insisting on digging your own well for water. It's far more labour-intensive, requires buying all your own equipment, takes a lot more time, and there's a higher chance you're going to get it wrong because you don't personally have a whole lot of experience digging wells, anyway.

That said - let's just get this out of the way first - there is no cloud. It's just someone else's computer.

Of course, these days, cloud services go far beyond the utility we'd expect from a single computer. Besides being able to quickly set up and utilize the kind of computing power that previously required a new office lease agreement to house, there are now a multitude of monitoring, management, and analysis tools at our giddy fingertips. While it's important to understand that the cloud isn't a better option in every case, for applications that can take advantage of it, we can do more, do it faster, and do it for less money than if we were to insist on building our own on-premises infrastructure.

That's all great, and easily said; moving to the cloud, however, can look from the outset like a pretty daunting task. How, exactly, do we go about shifting what may be years of on-premises data and built-up systems to _someone else's computer?_ You know, without being able to see it, touch it, and without completely screwing up our stuff.

While it probably takes less work and money than setting up or maintaining the same architecture on-premise, it does take some work to move to the cloud initially. It's important that our application is prepared to migrate, and capable of using the benefits of cloud services once it gets there. To accomplish this, and a smooth transition, preparation is key. In fact, it's a whole lot like moving to a new house.

In this article, we'll take a high-level look at the general stages of taking an on-premise or self-hosted application and moving it to the cloud. This guide is meant to serve as a starting point for designing the appropriate process for your particular situation, and to enable you to better understand the cloud migration process. While cloud migration may not be the best choice for some applications - such as ones without scalable architecture or where very high computing resources are needed - a majority of modular and modern applications stand to benefit from a move to the cloud.

It's certainly possible, as I discovered at a recent event put on by [Amazon Web Services](https://aws.amazon.com/) (AWS) Solutions Architects, to migrate smoothly and efficiently, with near-zero loss of availability to customers. I'll specifically reference some services provided by AWS, however, similar functionality can be found with other cloud providers. I've found the offerings from AWS to be pleasantly modular in scope, which is why I use them myself and why they make good examples for discussing general concepts.

To have our move go as smoothly as possible, here are the things we'll want to consider:

1. The type of move we're making;
2. The things we'll take, and the things we'll clean up;
3. How to choose the right type and size for the infrastructure we're moving into; and
4. How to do test runs to practice for the big day.

## The type of move we're making

While it's important to understand why we're moving our application to cloud services, we should also have an idea of what we'd like it to look like when it gets there. There are three main ways to move to the cloud: re-host, re-platform, or re-factor.

### Re-host

A re-host scenario is the the most straightforward type of move. It involves no change to the way our application is built or how it runs. For example, if we currently have Python code, use PostgreSQL, and serve our application with Apache, a re-host move would mean we use all the same components, combined in just the same way, only now they're in the cloud. It's a lot like moving into a new house that has the exact same floor plan as the current one. All the furniture goes into the same room it's in now, and it's going to feel pretty familiar when we get there.

The main draw of a re-host move is that it may offer the least amount of complication necessary in order to take advantage of going to the cloud. Scalable applications, for example, can gain the ability to automatically manage necessary application resources.

While re-hosting makes scaling more automatic, it's important to note that it won't in itself make an application scalable. If the application infrastructure is not organized in such a way that gives it the ability to scale, a re-factor may be necessary instead.

### Re-platform

If a component of our current application set up isn't working out well for us, we're probably going to want to re-platform. In this case, we're making a change to at least one component of our architecture; for example, switching our database from Oracle to MySQL on [Amazon Relational Database Service](https://aws.amazon.com/rds/) (RDS).

Like moving from a small apartment in Tokyo to an equally small apartment in New York, a re-platform doesn't change the basic nature of our application, but does change its appearance and environment. In the database change example, we'll have all the same data, just organized or formatted a little differently. In most cases, we won't have to make these changes manually. A tool such as [Amazon Database Migration Service](https://aws.amazon.com/dms/) (DMS) can help to seamlessly shift our data over to the new database.

We might re-platform in order to enable us to better meet a business demand in the future, such as scaling up, integrating with other technological components, or choosing a more modern technology stack.

### Re-factor

A move in which we re-factor our application is necessarily more complicated than our other options, however, it may provide the most overall benefit for companies or applications that have reason to make this type of move. As with code, refactoring is done when fundamental changes need to be made in order for our application to meet a business need. The specifics necessarily differ case-by-case, but typically involve changes to architectural components or how those components relate to one another. This type of move may also involve changing application code in order to optimize the application's performance in a cloud environment. We can think of it like moving out from our parent's basement in the suburbs and getting a nice townhouse in the city. There's no way we're taking that ancient hand-me-down sofa, so we'll need some new furniture, and for our neighbour's sake, probably window dressings.

Refactoring may enable us to modernize a dated application, or make it more efficient in general. With greater efficiency, we can better take advantage of services that cloud providers typically offer, like bursting resources or attaining deep analytical insight.

If a re-factor is necessary but time is scarce, it may be better to re-host or re-platform first, then re-factor later. That way, we'll have a job well done later instead of a hasty, botched migration (and more problems) sooner.

## What to take, and what to clean up

Over the years of living in one place, stuff tends to pile up unnoticed in nooks and crannies. When moving house, it's usually a great opportunity to sort everything out and decide what is useful enough to keep, and what should be discarded or given away. Moving to the cloud is a similarly great opportunity to do the same when it comes to our application.

While cloud storage is inexpensive nowadays, there may be some things that don't make sense to store any longer, or at least not keep stored with our primary application. If data cannot be discarded due to policy or regulations, we may choose a different storage class to house data that we don't expect to need anytime soon outside of our main application.

In the case of [Amazon's Simple Storage Service](https://aws.amazon.com/s3/) (S3), we can choose to use different [storage classes](https://aws.amazon.com/s3/storage-classes/) that accomplish this goal. While the data that our business relies on every day can take advantage of the Standard class 99.99% availability, data meant for long-term cold storage such as archival backups can be put into the Glacier class, which has longer retrieval time and lower cost.

## The right type and size

Choosing the type and size of cloud infrastructure appropriate for our business is usually the part that can be the most confusing. How should we predict, in a new environment or for a growing company, the computing power we'll need?

Part of the beauty of not procuring hardware on our own is that won't have to make predictions like these. Using cloud storage and instances, expanding or scaling back resources can be done in a matter of minutes, sometimes seconds. With managed services, it can even be done automatically for us. With the proper support for scalability in our application, it's like having a magical house that instantly generates any type of room and amenity we need at that moment. The ability to continually ensure that we're using appropriate, cost-effective resources is at our fingertips, and often clearly visualized in charts and dashboards.

For applications new to the cloud, some leeway for experimentation may be necessary. While cloud services enables us to quickly spin up and try out different architectures, there's no guarantee that all of those set ups will work well for our application. For example, running a single instance may be [less expensive than going serverless](http://einaregilsson.com/serverless-15-percent-slower-and-eight-times-more-expensive/), but we'd be hard pressed to know this until we tried it out.

As a starting point, we simply need enough storage and computing power to support the application as it is currently running, today. For example, in the case of storage, consider the size of the current database - the actual database data, not the total storage capacity of hardware on-premises. For a detailed cost exploration, AWS even offers a [Simple Monthly Calculator](https://calculator.s3.amazonaws.com/index.html) with use case samples to help guide expectations.

## Do test runs before the big day

Running a trial cloud migration may be an odd concept, but it is an essential component to ensuring that the move goes as planned with minimal service interruption. Imagine the time and energy that would be saved in the moving house example if we could automate test runs! Invariably, some box or still-hung picture is forgotten and left out of the main truck, necessitating additional trips in other vehicles. With multiple chances to ensure we've got it down pat, we minimize the possibility that our move causes any break in normal day-to-day business.

Generally, to do a test run, we create a duplicate version of our application. The more we can duplicate, the more thorough the test run will be, especially if our data is especially large. Though duplication may seem tedious, working with the actual components we intend to migrate is essential to ensuring the migration goes as planned. After all, if we only did a moving-house test run with one box, it wouldn't be very representative.

Test runs can help to validate our migration plan against any challenges we may encounter. These challenges might include:

- Downtime restrictions;
- Encrypting data in transit and immediately when at rest on the target;
- Schema conversion to a new target schema (the [AWS Schema Conversion Tool](https://aws.amazon.com/dms/schema-conversion-tool/) can also help);
- Access to databases, such as through firewalls or VPNs;
- Developing a process to ensure that all the data successfully migrated, such as by using a hash function.

Test runs also help to give us a more accurate picture of the overall time that a migration will take, as well as affording us the opportunity to fine-tune it. Factors that may affect the overall speed of a migration include:

- The sizes of the source and target instances;
- Available bandwidth for moving data;
- Schema configurations; and
- Transaction pressure on the source, such as changes to the data and the volume of incoming transactions.

Once the duplicate application has been migrated via one or more [options](https://aws.amazon.com/cloud-data-migration/), we test the heck out of the application that's now running in the cloud to ensure it performs as expected. Ideally, on the big day, we'd follow this same general process to move up-to-date duplicate data, and then seamlessly point the "real" application or web address to the new location in the cloud. This means that our customers experience near-zero downtime; essentially, only the amount of time that the change in location-pointing would need to propagate to their device.

In the case of very large or complex applications with many components or many teams working together at the same time, a more gradual approach may be more appropriate than the "Big Bang" approach, and may help to mitigate risk of any interruptions. This means migrating in stages, component by component, and running tests between stages to ensure that all parts of the application are communicating with each other as expected.

## Preparation is essential to a smooth migration

I hope this article has enabled a more practical understanding of how cloud migration can be achieved. With thorough preparation, it's possible to take advantage of all the cloud has to offer, with minimal hassle to get there.

My thanks to the AWS Solutions Architects who presented at Pop-Up Loft and shared their knowledge on these topics, in particular: Chandra Kapireddy, Stephen Moon, John Franklin, Michael Alpaugh, and Priyanka Mahankali.

One last nugget of wisdom, courtesy of John: "Friends don't let friends use DMS to create schema objects."
