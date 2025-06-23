---
title: Do I Raise or Return Errors in Python?
date: 2021-02-09T05:34:48-05:00

aliases:
    - /blog/do-i-raise-or-return-errors-in-python/
description: A principal engineer's guide to building robust, debuggable Python applications that fail fast and fail loud.
tags:
    - leadership
    - compsci
    - development
    - python
showtoc: true
draft: false
categories: ["article"]
---

I’ve been writing Python for nearly a decade, and this question still comes up in code reviews more often than you’d think. Should I raise an exception or return an error value? It seems simple on the surface, but the choice ripples through your entire codebase in ways that can make or break your team’s productivity six months down the line.

## The Real Question Behind the Question

When your function discovers something’s wrong, you’re not only choosing between `raise` and `return`. You’re making a decision about how your entire application will handle failure, how readable your code will be for the next person, and how many 3 AM prod debugging sessions you’re setting up for your future self and team.

Here's how I think about this choice, because the right one for your application affects everything from your error logs to your team’s velocity.

## When I Reach for Exceptions

I raise exceptions when something genuinely unexpected happens—when the assumptions my function was built on just got violated. If I’m writing a function to parse a config file and the file doesn’t exist, that’s exceptional. The caller expected a valid config, and I can’t deliver on that contract.

```python
def load_config(filepath):
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Config file not found: {filepath}")
    
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        raise ConfigurationError(f"Invalid JSON in config file: {e}")
```

Here’s why exceptions work well here: the calling code doesn’t need to check every single operation. If any step fails, the exception bubbles up to whoever can actually handle it. Your main application logic stays clean, and error handling happens at the right level.

The business impact here is huge. When your core logic isn’t cluttered with error checking, you can focus on the actual problem you’re solving. Your functions do one thing well, and your error handling is centralized where it belongs.

## When I Return Error Values

But sometimes the “error” isn’t really an error—it’s just one of several possible outcomes. When I’m building a user search function, finding zero results isn’t exceptional. It’s totally normal behavior that the caller needs to handle anyway.

```python
def search_users(query):
    results = database.search(query)
    if not results:
        return []  # Empty list, not an exception
    return results

# Calling code feels natural
users = search_users("john")
if users:
    display_users(users)
else:
    show_no_results_message()
```

This approach shines when you have multiple valid outcomes and the caller needs to make decisions based on which one occurred. It also works well for performance-critical code where exception handling overhead matters.

## The Type Safety Angle

Here’s something I’ve started caring about more as codebases grow: how well does your choice play with static type checking? Modern Python with type hints changes the game significantly.

With exceptions, your function signature stays clean:

```python
def parse_user_id(user_input: str) -> int:
    try:
        return int(user_input)
    except ValueError:
        raise InvalidUserIdError("User ID must be a number")
```

But with return values, you’re often dealing with unions:

```python
def parse_user_id(user_input: str) -> int | None:
    try:
        return int(user_input)
    except ValueError:
        return None
```

That `| None` propagates through your entire codebase. Every function that calls this one now has to handle the None case, and mypy will remind you of that fact. Sometimes that’s exactly what you want—explicit error handling at every level. Other times, it creates unnecessary complexity.

## The Performance Reality Check

What about performance? Yes, exceptions are slower than returning values, but context matters enormously here.

In tight loops processing thousands of items per second, that overhead can add up. Profiling code where you've switched from exceptions to return values might show improved performance of 20-30%. But in typical web application code where you’re dealing with database calls and network requests, exception overhead is noise compared to everything else.

The more important performance consideration is often developer performance. How quickly can someone understand your code? How easily can they modify it without introducing bugs? I’ve seen teams spend weeks debugging subtle issues that wouldn’t have existed with clearer (documented!) error handling patterns.

## Patterns That Actually Work in Production

After working on systems that handle millions of requests, here are the patterns I keep coming back to:

**For library code**: Raise exceptions. Libraries don’t know how their callers want to handle errors, so push that decision up the stack. Custom exception types help callers decide what to catch and what to let bubble up.

**For user input validation**: Usually return structured error information. Users make mistakes constantly, and that’s normal behavior, not exceptional.

```python
def validate_email(email: str) -> ValidationResult:
    if not email:
        return ValidationResult(valid=False, error="Email is required")
    if "@" not in email:
        return ValidationResult(valid=False, error="Invalid email format")
    return ValidationResult(valid=True)
```

**For external service calls**: This is tricky. Network timeouts and service errors happen, but they’re not exactly exceptional in a distributed system. I often use exceptions for the truly unexpected (DNS resolution failures) and return values for the predictable failures (rate limiting, temporary service unavailability).

## The 3AM System Down Test

Here’s my ultimate thought experiment test: if something broke in production and you had to debug it at 3 AM, bleary-eyed and chugging coffee, which approach helps you understand what went wrong faster?

Good exceptions with detailed error messages and proper stack traces are incredible for this. You can see exactly where things went wrong and why. But exceptions that get swallowed or re-raised without context are debugging nightmares.

Return values with proper logging can also be great for debugging, especially when you need to understand the sequence of events that led to a problem. But they require more discipline—you need to actually check and log those return values.

## Making the Choice

When I’m looking at a specific function, I ask myself:

- Is this condition truly unexpected given the function’s contract?
- Do callers need to make immediate decisions based on this failure?
- How will this pattern scale across my team and codebase?
- What will debugging look like when this inevitably breaks?

There’s no universal right answer, but there are patterns that work well for different situations. The key is being intentional about your choice and consistent within your codebase.

Your error handling strategy affects how quickly new team members can contribute, how easy it is to track down production issues, and how confident you can be when making changes. Choose patterns that serve your team’s long-term productivity, not just today’s immediate problem.

The best choice for error handling is the one that helps you sleep better at night, knowing that when something goes wrong, you’ll be able to figure out what happened and fix it quickly.

If you found some value in this post, there's more! I write about high-output development processes and building maintainable systems in the AI age. You can get my posts in your inbox by subscribing below.

{{< subscribe >}}
