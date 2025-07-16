---
title: SQLite in Production with WAL
date: 2020-03-05T10:14:43-05:00

aliases:
    - /blog/sqlite-in-production-with-wal/
description: "When does SQLite with WAL mode fit production needs? Here's how engineering leaders can guide technology decisions based on actual requirements rather than industry hype."
tags:
    - compsci
    - data
image: cover.png
 
draft: false

categories: ["article"]
---

_Update: read the [HackerNews discussion](https://news.ycombinator.com/item?id=27237919)._

So you need a database. It's going to handle a few hundred users and mostly read operations. Time to set up a PostgreSQL cluster, debate connection pooling strategies, configure replication, and design backup procedures... right?

When I say, "What about SQLite?", the response is usually some variation of "That's not a real database."

This reaction reveals something important about how engineering teams make technology decisions. We often choose tools based on what sounds impressive rather than what solves our actual problems. SQLite represents an underappreciated truth in engineering leadership: sometimes the boring, simple solution is exactly what your team needs.

~[SQLite](https://sqlite.org/index.html)~ ("see-quell-lite") is a lightweight SQL database engine that's self-contained in a single file. It's library, database, and data, all in one package. For certain applications, SQLite is a solid choice for a production database. It's lightweight, ultra-portable, and has no external dependencies.

## Matching Tools to Actual Requirements

As an engineering leader, one of your most important responsibilities is helping your team choose appropriate technology rather than impressive technology. SQLite excels in specific scenarios that are more common than most teams realize.

SQLite is best suited for production use in applications that:

* Desire fast and simple setup
* Require high reliability in a small package
* Have, and want to retain, a small footprint
* Are read-heavy but not write-heavy
* Don't need multiple user accounts or features like multiversion concurrency snapshots

These criteria describe a significant percentage of web applications, internal tools, and even customer-facing products. But teams often dismiss SQLite because it doesn't match their mental model of what a "serious" database looks like.

Recognizing when your team's technology choices are driven by resume-driven development rather than problem-solving can save you oodles of time and budget wiggle room. Complex solutions carry hidden costs in deployment complexity, operational overhead, and cognitive load that simple solutions avoid entirely.

## Understanding the Technical Trade-offs

To guide these decisions effectively, it helps to understand the technical details well enough to evaluate trade-offs intelligently. In the case of SQLite, you can examine its performance characteristics to make this evaluation concrete:

### Database Transaction Modes

POSIX system call fsync() commits buffered data (data saved in the operating system cache) referred to by a specified file descriptor to permanent storage or disk. This is relevant to understanding the difference between SQLite's two modes, as fsync() will block until the device reports the transfer is complete.

SQLite uses ~[atomic commits](https://sqlite.org/atomiccommit.html)~ to batch database changes into single transactions, enabling apparent simultaneous writing of multiple operations. This is accomplished through one of two modes: rollback journal or write-ahead log (WAL).

### Rollback Journal Mode

A [rollback journal](https://www.sqlite.org/lockingv3.html#rollback) is essentially a back-up file created by SQLite before write changes occur on a database file. It has the advantage of providing high reliability by helping SQLite restore the database to its original state in case a write operation is compromised during the disk-writing process.

Assuming a cold cache, SQLite first needs to read the relevant pages from a database file before it can write to it. Information is read out into the operating system cache, then transferred into user space. SQLite obtains a reserved lock on the database file, preventing other processes from writing to the database. At this point, other processes may still read from the database.

SQLite creates a separate file, the rollback journal, with the original content of the pages that will be changed. Initially existing in the cache, the rollback journal is written to persistent disk storage with `fsync()` to enable SQLite to restore the database should its next operations be compromised.

SQLite then obtains an exclusive lock preventing other processes from reading or writing, and writes the page changes to the database file in cache. Since writing to disk is slower than interaction with the cache, writing to disk doesn't occur immediately. The rollback journal continues to exist until changes are safely written to disk with a second `fsync()`. From a user-space process point of view, the change to the disk (the COMMIT, or end of the transaction) happens instantaneously once the rollback journal is deleted - hence, atomic commits. However, the two `fsync()` operations required to complete the COMMIT make this option, from a transactional standpoint, slower than SQLite's lesser known WAL mode.

### Write-ahead logging (WAL)

While the rollback journal method uses a separate file to preserve the original database state, the [WAL method](https://www.sqlite.org/wal.html) uses a separate WAL file to instead record the changes. Instead of a COMMIT depending on writing changes to disk, a COMMIT in WAL mode occurs when a record of one or more commits is appended to the WAL. This has the advantage of not requiring blocking read or write operations to the database file in order to make a COMMIT, so more transactions can happen concurrently.

WAL mode introduces the concept of the checkpoint, which is when the WAL file is synced to persistent storage before all its transactions are transferred to the database file. You can optionally specify when this occurs, but SQLite provides reasonable defaults. The checkpoint is the WAL version of the atomic commit.

In WAL mode, write transactions are performed faster than in the traditional rollback journal mode. Each transaction involves writing the changes only once to the WAL file instead of twice - to the rollback journal, and then to disk - before the COMMIT signals that the transaction is over.

For teams handling moderate write loads, WAL mode often provides the performance characteristics they actually need without the operational complexity of distributed databases.

## The Performance Reality

Benchmarks tell a compelling story about SQLite's practical capabilities. On modest hardware—the smallest EC2 instance with no provisioned IOPS—SQLite with WAL mode handles 400 write transactions per second and thousands of reads. For many applications, this represents more capacity than they need.

These numbers matter because they provide concrete data for technology discussions. Instead of theoretical conversations about "what if we need to scale," you can evaluate whether 400 writes per second actually meets your requirements. Often, it does—with significant room for growth.

More importantly, SQLite eliminates entire categories of operational complexity: connection pooling, database server maintenance, backup procedures, replication configuration, and deployment coordination. The operational overhead you don't have to manage often provides more value than the theoretical scalability you might need someday.

## Making Strategic Technology Decisions

Engineering teams often equate complexity with sophistication and assume that simple solutions won't scale or aren't "enterprise-ready" without considering the actual requirements of the enterprise. The SQLite decision exemplifies a broader principle in engineering leadership: optimizing for actual constraints rather than imaginary ones. This requires understanding both the technical capabilities of your options and the real requirements of your systems.

This means asking your teams to articulate specific performance requirements, operational constraints, and growth projections rather than making technology choices based on industry trends or resume building. It means evaluating the total cost of ownership including deployment complexity, operational overhead, and team cognitive load.

Most importantly, it means recognizing that the best technology choice is often the one that solves your current problems effectively while remaining simple enough to understand, maintain, and evolve as requirements change.

## Building a Culture of Appropriate Technology

Teams that consistently make good technology choices develop systematic approaches to evaluation rather than relying on instinct or industry hype. They start with requirements, evaluate options based on total cost of ownership, and choose solutions that match their actual needs rather than their aspirational ones.

This culture emerges when leaders model technical decision-making that prioritizes problem-solving over impressiveness. When you advocate for SQLite over PostgreSQL because it better matches your workload, you're teaching your team to think critically about technology trade-offs.

The long-term impact is teams that build sustainable systems they can actually maintain and evolve. Simple solutions that solve real problems create more value than complex solutions that solve theoretical ones.

For medium-sized, read-heavy applications, SQLite with WAL mode represents exactly this kind of appropriate technology choice. It provides perfectly adequate capability in a perfectly compact package—which is often exactly what your application needs.
