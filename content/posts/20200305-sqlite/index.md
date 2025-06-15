---
title: SQLite in production with WAL
date: 2020-03-05T10:14:43-05:00

aliases:
    - /blog/sqlite-in-production-with-wal/
description: An underappreciated candidate for light and fast database transactions.
tags:
    - data
    - compsci
image: cover.png
 
draft: false
featured: true
categories: ["article"]
---

_Update: read the [HackerNews discussion](https://news.ycombinator.com/item?id=27237919)._

[SQLite](https://sqlite.org/index.html) ("see-quell-lite") is a lightweight Sequel, or Structured Query Language ([SQL](https://en.wikipedia.org/wiki/SQL)), database engine. Instead of using the client-server database management system model, SQLite is self-contained in a single file. It is library, database, and data, all in one package.

For certain applications, SQLite is a solid choice for a production database. It's lightweight, ultra-portable, and has no external dependencies. Remember when MacBook Air first came out? It's nothing like that.

SQLite is best suited for production use in applications that:

- Desire fast and simple set up.
- Require high reliability in a small package.
- Have, and want to retain, a small footprint.
- Are read-heavy but not write-heavy.
- Don't need multiple user accounts or features like multiversion concurrency snapshots.

If your application can benefit from SQLite's serverless convenience, you may like to know about the different modes available for managing database changes.

## With and without WAL

POSIX [system call `fsync()`](https://linux.die.net/man/2/fsync) commits buffered data (data saved in the operating system cache) referred to by a specified file descriptor to permanent storage or disk. This is relevant to understanding the difference between SQLite's two modes, as `fsync()` will block until the device reports the transfer is complete.

For efficiency, SQLite uses [atomic commits](https://sqlite.org/atomiccommit.html) to batch database changes into a single transaction. This enables the apparent writing of many transactions to a database file simultaneously. Atomic commits are performed using one of two modes: a rollback journal, or a write-ahead log (WAL).

### Rollback journal

A [rollback journal](https://www.sqlite.org/lockingv3.html#rollback) is essentially a back-up file created by SQLite before write changes occur on a database file. It has the advantage of providing high reliability by helping SQLite restore the database to its original state in case a write operation is compromised during the disk-writing process.

Assuming a cold cache, SQLite first needs to read the relevant pages from a database file before it can write to it. Information is read out into the operating system cache, then transferred into user space. SQLite obtains a reserved lock on the database file, preventing other processes from writing to the database. At this point, other processes may still read from the database.

SQLite creates a separate file, the rollback journal, with the original content of the pages that will be changed. Initially existing in the cache, the rollback journal is written to persistent disk storage with `fsync()` to enable SQLite to restore the database should its next operations be compromised.

SQLite then obtains an exclusive lock preventing other processes from reading or writing, and writes the page changes to the database file in cache. Since writing to disk is slower than interaction with the cache, writing to disk doesn't occur immediately. The rollback journal continues to exist until changes are safely written to disk, with a second `fsync()`. From a user-space process point of view, the change to the disk (the COMMIT, or end of the transaction) happens instantaneously once the rollback journal is deleted - hence, atomic commits. However, the two `fsync()` operations required to complete the COMMIT make this option, from a transactional standpoint, slower than SQLite's lesser known WAL mode.

### Write-ahead logging (WAL)

While the rollback journal method uses a separate file to preserve the original database state, the [WAL method](https://www.sqlite.org/wal.html) uses a separate WAL file to instead record the changes. Instead of a COMMIT depending on writing changes to disk, a COMMIT in WAL mode occurs when a record of one or more commits is appended to the WAL. This has the advantage of not requiring blocking read or write operations to the database file in order to make a COMMIT, so more transactions can happen concurrently.

WAL mode introduces the concept of the checkpoint, which is when the WAL file is synced to persistent storage before all its transactions are transferred to the database file. You can optionally specify when this occurs, but SQLite provides reasonable defaults. The checkpoint is the WAL version of the atomic commit.

In WAL mode, write transactions are performed faster than in the traditional rollback journal mode. Each transaction involves writing the changes only once to the WAL file instead of twice - to the rollback journal, and then to disk - before the COMMIT signals that the transaction is over.

## The simplicity of SQLite

For medium-sized read-heavy applications, SQLite may be a great choice. Using SQLite in WAL mode may make it an even better one. Benchmarks on the smallest EC2 instance, with no provisioned [IOPS](https://en.wikipedia.org/wiki/IOPS), put this little trooper at 400 write transactions per second, and thousands of reads. That's some perfectly adequate capability, in a perfectly compact package.
