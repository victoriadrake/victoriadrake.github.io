---
title: "17 Minutes to 16 Seconds: a 60x Performance Improvement from… Python?!"
date: 2020-02-28T09:31:02-05:00

aliases:
    - /posts/multithreaded-python-slithering-through-an-i/o-bottleneck/
description: "Engineering leadership lessons from Python performance optimization. How to identify real bottlenecks, work within technical constraints, and guide teams toward effective optimization decisions that deliver measurable results."
tags:
    - python
    - compsci
    - development
    - data
    - open-source
image: cover.png
 
draft: false
categories: ["article"]
---

Engineering teams will spend weeks optimizing database queries that run in milliseconds while ignoring network requests that take hundreds of milliseconds. They’ll debate the performance implications of different sorting algorithms while their application spends seventeen minutes on network latency to process a few hundred requests. This misallocation of optimization effort reveals a common leadership challenge: helping teams identify and focus on the bottlenecks that actually matter.

When I developed [Hydra](https://github.com/victoriadrake/hydra-link-checker), a multithreaded link checker written in Python, the performance requirements were clear. It needed to run as part of CI/CD processes, which meant speed was essential for developer productivity. Nobody wants to wait seventeen minutes to learn whether their build succeeded—that’s long enough to make coffee, check Twitter, question your career choices, and wonder if the process crashed.

The project became a case study in systematic performance optimization and the leadership decisions that guide technical implementation. Unlike many Python site crawlers that rely on external dependencies like BeautifulSoup, Hydra uses only standard libraries. This constraint required thinking carefully about how to achieve optimal performance within Python’s limitations.

## Understanding the Performance Landscape

As an engineering leader, one of your most important responsibilities is helping your team understand where performance problems actually occur versus where they assume they occur. Most developers have an intuitive sense that network operations are slower than CPU operations, but the actual magnitude of these differences is staggering.

Here are approximate timings for tasks performed on a typical PC:

|       |Task                               |Time                           |
|-------|-----------------------------------|-------------------------------|
|CPU    |execute typical instruction        |1/1,000,000,000 sec = 1 nanosec|
|CPU    |fetch from L1 cache memory         |0.5 nanosec                    |
|CPU    |branch misprediction               |5 nanosec                      |
|CPU    |fetch from L2 cache memory         |7 nanosec                      |
|RAM    |Mutex lock/unlock                  |25 nanosec                     |
|RAM    |fetch from main memory             |100 nanosec                    |
|Network|send 2K bytes over 1Gbps network   |20,000 nanosec                 |
|RAM    |read 1MB sequentially from memory  |250,000 nanosec                |
|Disk   |fetch from new disk location (seek)|8,000,000 nanosec   (8ms)      |
|Disk   |read 1MB sequentially from disk    |20,000,000 nanosec  (20ms)     |
|Network|send packet US to Europe and back  |150,000,000 nanosec (150ms)    |

Peter Norvig first published these numbers in [Teach Yourself Programming in Ten Years](http://norvig.com/21-days.html#answers). While hardware continues to evolve, the relative relationships remain humbling for anyone who’s ever spent time optimizing the wrong thing.

Notice that sending a simple packet over the Internet is over a million times slower than fetching from RAM. These aren’t small performance differences—they’re fundamental constraints that should guide every optimization decision you make.

For Hydra, parsing response data and assembling results happens on the CPU and is relatively fast. The overwhelming bottleneck—by over six orders of magnitude—is network latency. Any optimization effort that didn’t address network I/O would miss the point.

## Working Within Python’s Constraints

Python presents an interesting challenge for performance-critical applications. The Global Interpreter Lock (GIL) prevents multiple threads from executing Python bytecodes simultaneously—each thread must wait for the GIL to be released by the currently executing thread. This eliminates race conditions but also prevents true parallel execution of CPU-bound tasks.

For many engineering teams, this limitation becomes a reason to dismiss Python entirely for performance work. But effective technical leadership involves understanding how to work within constraints rather than avoiding tools with limitations.

The key insight is that Python’s GIL limitation doesn’t apply uniformly. While CPU-bound tasks suffer from the GIL, I/O-bound tasks can benefit from concurrent execution because the GIL is released during I/O operations. For Hydra’s use case—fetching web pages over the network—multithreading in Python can provide significant performance improvements despite the GIL.

This distinction matters for strategic technical decisions. Instead of automatically reaching for Go or Rust when performance requirements emerge, understanding Python’s actual constraints can enable better technology choices based on specific workload characteristics.

## Choosing the Right Concurrency Model

Python provides multiple approaches to parallel execution, each suited for different types of bottlenecks. Making the right choice requires understanding both technical trade-offs and your application’s specific performance characteristics.

### Multiple Processes

Python’s [`ProcessPoolExecutor`](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ProcessPoolExecutor) uses worker subprocesses to bypass the GIL entirely. This approach maximizes parallelization for CPU-bound tasks by utilizing multiple processor cores effectively.

For compute-heavy operations—mathematical calculations, data processing, algorithm execution—multiple processes provide genuine parallel execution. However, this carries overhead costs in memory usage and inter-process communication that may not be justified for I/O-bound workloads.

### Multiple Threads

Python’s [`ThreadPoolExecutor`](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ThreadPoolExecutor) uses a pool of threads that can execute I/O operations concurrently. While threads can’t execute Python code in parallel due to the GIL, they can perform I/O operations concurrently because the GIL is released during system calls.

For I/O-bound applications—web scraping, API calls, file operations—threading provides excellent performance improvements with lower overhead than multiprocessing.

## Implementation Strategy

Here’s how Hydra uses `ThreadPoolExecutor` to achieve concurrent link checking:

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

The implementation reflects several engineering leadership principles. The thread pool size (100 workers) was determined through profiling and testing rather than guesswork. The timeout mechanism prevents slow requests from blocking overall progress. The callback pattern enables efficient result processing without blocking the main execution thread.

## Measuring Real Impact

Performance optimization discussions often remain theoretical without concrete measurements. For Hydra, the improvement was dramatic. Here’s a comparison between the run times for checking my website with a prototype single-thread program and using Hydra:

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

The single-threaded implementation took over seventeen minutes. The multithreaded version completed in under sixteen seconds. That’s a performance improvement of more than 60x.

These aren’t marginal gains from micro-optimizations. They represent fundamental improvements in application efficiency that users immediately notice. While specific timings vary based on site size and network conditions, the order-of-magnitude improvement demonstrates the value of addressing actual bottlenecks systematically.

## Leadership Lessons in Performance Optimization

The Hydra project illustrates several principles that engineering leaders can apply across different technologies and applications.

**Focus on actual bottlenecks, not theoretical ones.** Teams often optimize the wrong things because they focus on code that feels slow to write rather than code that’s actually slow to execute. Teaching teams to measure and identify real performance constraints prevents wasted optimization effort.

**Understand your tools’ limitations and strengths.** Python’s GIL is a constraint, but it doesn’t preclude high-performance applications in the right contexts. Effective technical leadership involves understanding how to work within technological constraints rather than avoiding tools with limitations.

**Make optimization decisions based on requirements.** Hydra needed to run quickly in CI/CD environments, which justified the development effort for custom multithreading. But this level of effort isn’t required in every Python application. Understanding your specific requirements helps allocate development efforts appropriately.

**Measure improvement, don’t assume it.** Performance optimization can introduce complexity and maintenance overhead. Concrete measurements ensure that optimization efforts provide sufficient value to justify their costs.

## Building Performance-Conscious Teams

The most effective engineering teams develop systematic approaches to performance rather than relying on intuition or premature optimization. This requires creating culture and processes that encourage measurement, analysis, and strategic optimization decisions.

This means teaching teams to profile applications before optimizing them, helping them understand the performance characteristics of their technology choices, and ensuring that optimization efforts align with actual user requirements rather than theoretical concerns.

Most importantly, it means recognizing that performance optimization is a technical leadership skill that involves strategic thinking about trade-offs, constraints, and business requirements—not just implementation knowledge.

## The Real Lesson

Hydra’s performance gains from 17 minutes to 16 seconds teaches a lesson that applies far beyond Python: measure first, optimize second, and always focus on the constraint that’s actually limiting your system. Whether you’re debugging performance bottlenecks or organizational inefficiencies, the biggest wins come from addressing the right problem rather than optimizing the wrong one exceptionally well.

The next time your team debates whether to rewrite everything in Go for performance, remember Hydra's 60x improvement using standard Python libraries. Sometimes the most effective optimization is the one you can implement this week rather than the solution you'll build next quarter… or the quarter after that.