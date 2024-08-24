---
title: "Multithreaded Python: slithering through an I/O bottleneck"
date: 2020-02-28T09:31:02-05:00

aliases:
description: How taking advantage of parallelism in Python can make your software orders of magnitude faster.
tags:
    - python
    - computing
    - ci/cd
    - data
    - open-source
image: cover.png
noToc: true
draft: false
categories: ["article"]
featured: true
---

I recently developed a project that I called [Hydra](https://github.com/victoriadrake/hydra-link-checker): a multithreaded link checker written in Python. Unlike many Python site crawlers I found while researching, Hydra uses only standard libraries, with no external dependencies like BeautifulSoup. It's intended to be run as part of a CI/CD process, so part of its success depended on being fast.

Multiple threads in Python is a bit of a bitey subject (not sorry) in that the Python interpreter doesn't actually let multiple threads execute at the same time. Python's [Global Interpreter Lock](https://wiki.python.org/moin/GlobalInterpreterLock), or GIL, prevents multiple threads from executing Python bytecodes at once. Each thread that wants to execute must first wait for the GIL to be released by the currently executing thread. The GIL is pretty much the microphone in a low-budget conference panel, except where no one gets to shout.

This has the advantage of preventing [race conditions](https://en.wikipedia.org/wiki/Race_condition). It does, however, lack the performance advantages afforded by running multiple tasks in parallel. (If you'd like a refresher on concurrency, parallelism, and multithreading, see [Concurrency, parallelism, and the many threads of Santa Claus](/blog/concurrency-parallelism-and-the-many-threads-of-santa-claus/).) While I prefer Go for its convenient first-class primitives that support concurrency (see [Goroutines](https://tour.golang.org/concurrency/1)), this project's recipients were more comfortable with Python. I took it as an opportunity to test and explore!

Simultaneously performing multiple tasks in Python isn't impossible; it just takes a little extra work. For Hydra, the main advantage is in overcoming the input/output (I/O) bottleneck.

In order to get web pages to check, Hydra needs to go out to the Internet and fetch them. When compared to tasks that are performed by the CPU alone, going out over the network is comparatively slower. How slow?

Here are approximate timings for tasks performed on a typical PC:

|         | Task                                | Time                            |
| ------- | ----------------------------------- | ------------------------------- |
| CPU     | execute typical instruction         | 1/1,000,000,000 sec = 1 nanosec |
| CPU     | fetch from L1 cache memory          | 0.5 nanosec                     |
| CPU     | branch misprediction                | 5 nanosec                       |
| CPU     | fetch from L2 cache memory          | 7 nanosec                       |
| RAM     | Mutex lock/unlock                   | 25 nanosec                      |
| RAM     | fetch from main memory              | 100 nanosec                     |
| Network | send 2K bytes over 1Gbps network    | 20,000 nanosec                  |
| RAM     | read 1MB sequentially from memory   | 250,000 nanosec                 |
| Disk    | fetch from new disk location (seek) | 8,000,000 nanosec   (8ms)       |
| Disk    | read 1MB sequentially from disk     | 20,000,000 nanosec  (20ms)      |
| Network | send packet US to Europe and back   | 150,000,000 nanosec (150ms)     |

Peter Norvig first published these numbers some years ago in [Teach Yourself Programming in Ten Years](http://norvig.com/21-days.html#answers). Since computers and their components change year over year, the exact numbers shown above aren't the point. What these numbers help to illustrate is the difference, in orders of magnitude, between operations.

Compare the difference between fetching from main memory and sending a simple packet over the Internet. While both these operations occur in less than the blink of an eye (literally) from a human perspective, you can see that sending a simple packet over the Internet is over a million times slower than fetching from RAM. It's a difference that, in a single-thread program, can quickly accumulate to form troublesome bottlenecks.

In Hydra, the task of parsing response data and assembling results into a report is relatively fast, since it all happens on the CPU. The slowest portion of the program's execution, by over six orders of magnitude, is network latency. Not only does Hydra need to fetch packets, but whole web pages! One way of improving Hydra's performance is to find a way for the page fetching tasks to execute without blocking the main thread.

Python has a couple options for doing tasks in parallel: multiple processes, or multiple threads. These methods allow you to circumvent the GIL and speed up execution in a couple different ways.

## Multiple processes

To execute parallel tasks using multiple processes, you can use Python's [`ProcessPoolExecutor`](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ProcessPoolExecutor). A concrete subclass of [`Executor`](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.Executor) from the [`concurrent.futures` module](https://docs.python.org/3/library/concurrent.futures.html), `ProcessPoolExecutor` uses a pool of processes spawned with the [`multiprocessing` module](https://docs.python.org/3/library/multiprocessing.html#module-multiprocessing) to avoid the GIL.

This option uses worker subprocesses that maximally default to the number of processors on the machine. The `multiprocessing` module allows you to maximally parallelize function execution across processes, which can really speed up compute-bound (or [CPU-bound](https://en.wikipedia.org/wiki/CPU-bound)) tasks.

Since the main bottleneck for Hydra is I/O and not the processing to be done by the CPU, I'm better served by using multiple threads.

## Multiple threads

Fittingly named, Python's [`ThreadPoolExecutor`](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ThreadPoolExecutor) uses a pool of threads to execute asynchronous tasks. Also a subclass of [`Executor`](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.Executor), it uses a defined number of maximum worker threads (at least five by default, according to the formula `min(32, os.cpu_count() + 4)`) and reuses idle threads before starting new ones, making it pretty efficient.

Here is a snippet of Hydra with comments showing how Hydra uses `ThreadPoolExecutor` to achieve parallel multithreaded bliss:

```py
# Create the Checker class
class Checker:
    # Queue of links to be checked
    TO_PROCESS = Queue()
    # Maximum workers to run
    THREADS = 100
    # Maximum seconds to wait for HTTP response
    TIMEOUT = 60

    def __init__(self, url):
        ...
        # Create the thread pool
        self.pool = futures.ThreadPoolExecutor(max_workers=self.THREADS)


def run(self):
    # Run until the TO_PROCESS queue is empty
    while True:
        try:
            target_url = self.TO_PROCESS.get(block=True, timeout=2)
            # If we haven't already checked this link
            if target_url["url"] not in self.visited:
                # Mark it as visited
                self.visited.add(target_url["url"])
                # Submit the link to the pool
                job = self.pool.submit(self.load_url, target_url, self.TIMEOUT)
                job.add_done_callback(self.handle_future)
        except Empty:
            return
        except Exception as e:
            print(e)
```

You can view the full code in [Hydra's GitHub repository](https://github.com/victoriadrake/hydra-link-checker).

## Single thread to multithread

If you'd like to see the full effect, I compared the run times for checking my website between a prototype single-thread program, and the ~~multiheaded~~multithreaded Hydra.

```text
time python3 slow-link-check.py https://victoria.dev

real    17m34.084s
user    11m40.761s
sys     0m5.436s


time python3 hydra.py https://victoria.dev

real    0m15.729s
user    0m11.071s
sys     0m2.526s
```

The single-thread program, which blocks on I/O, ran in about seventeen minutes. When I first ran the multithreaded version, it finished in 1m13.358s - after some profiling and tuning, it took a little under sixteen seconds. Again, the exact times don't mean all that much; they'll vary depending on factors such as the size of the site being crawled, your network speed, and your program's balance between the overhead of thread management and the benefits of parallelism.

The more important thing, and the result I'll take any day, is a program that runs some orders of magnitude faster.
