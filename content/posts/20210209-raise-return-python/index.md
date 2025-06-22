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

I hear this question a lot: "Do I raise or return this error in Python?"

The right answer will depend on the goals of your application logic and the architectural context. As a software leader, ensuring robust and explicit error handling is paramount to building resilient, maintainable, and debuggable systems. You want to **ensure your Python code doesn't fail silently,** saving you and your teammates from having to hunt down deeply entrenched errors in complex production environments.

> TL;DR: The choice between `raise` and `return` shapes your entire system's resilience. Raise exceptions for true failures, return error objects for expected outcomes. Most importantly: establish consistent patterns across your team and never let errors fail silently.

This post explores the nuanced differences between `raise` and `return` when handling failures in Python, and how these choices impact system design and team practices.

## When to raise

> The `raise` statement allows the programmer to force a specific exception to occur. ([8.4 Raising Exceptions](https://docs.python.org/3/tutorial/errors.html#raising-exceptions))

Use `raise` when an exceptional condition occurs that prevents the function from completing its intended purpose. This aligns with the "fail fast" principle, which advocates for immediate termination upon detecting an unrecoverable error. This approach helps prevent corrupted states and simplifies debugging by pinpointing the exact failure origin.

For example, if a function expects a specific type of input and receives something else, raising a `TypeError` is appropriate:

```python
raise TypeError("Wanted strawberry, got grape.")
```

Raising an exception terminates the current flow of your program, allowing the exception to bubble up the call stack. This enables explicit handling of `TypeError` at a higher level. If `TypeError` goes unhandled, code execution stops, resulting in an *unhandled exception* message and typically a program crash.

`raise` is particularly useful for enforcing invariants or business rules:

```python
if "raisins" in text_field:
    raise ValueError("That word is not allowed here")
```

`raise` takes an instance of an exception, or a derivative of the [Exception class](https://docs.python.org/3/library/exceptions.html#Exception). Python provides a rich set of [built-in exceptions](https://docs.python.org/3/library/exceptions.html#bltin-exceptions).

### Custom Exceptions for Clarity and Maintainability

For complex applications, defining custom exception classes is a best practice. This improves code readability, allows for more granular error handling, and provides a clear contract for consumers of your API or library.

```python
class NoJamError(ValueError):
    """Custom exception raised when jam is missing for a sandwich."""
    pass

import os

def sandwich_or_bust(bread: str) -> str:
    jam = os.getenv("JAM")
    if not jam:
        raise NoJamError("There is no jam. Sad bread.") # Use custom exception
    return bread + str(jam) + bread

s = sandwich_or_bust("\U0001F35E")
print(s)
# NoJamError: There is no jam. Sad bread.
```

Custom exceptions make it easier to catch specific error types without catching broader, less specific exceptions.

Any time your code interacts with an external variable, module, or service, there is a possibility of failure. You can use `raise` in an `if` statement to help ensure those failures aren't silent.

### Raise in `try` and `except`

To handle a possible failure by taking an action if there is one, use a `try` ... `except` statement. This mechanism allows for graceful recovery or specific error logging.

```python
try:
    s = sandwich_or_bust("\U0001F35E")
    print(s)
except NoJamError: # Catch the specific custom exception
    buy_more_jam()
    raise # Re-raise to propagate the original exception
```

This lets you `buy_more_jam()` before re-raising the exception. If you want to propagate a caught exception, use `raise` without arguments to avoid possible loss of the stack trace and preserve the original error context.

While you can use a bare `except:` or catch `except Exception:`, it's generally better to raise and handle exceptions explicitly by type. This prevents accidentally catching unexpected errors and makes your error handling more precise.

Use `else` for code to execute if the `try` does not raise an exception. For example:

```python
try:
    s = sandwich_or_bust("\U0001F35E")
    print(s)
except NoJamError:
    buy_more_jam()
    raise
else:
    print("Congratulations on your sandwich.")
```

You could also place the print line within the `try` block, however, this is less explicit and can obscure the intended flow.

## When to return

When you use `return` in Python, you're giving back a value. A function returns to the location it was called from.

While `raise` is idiomatic for exceptional conditions, `return` is more applicable when a function has a defined set of possible outcomes, including "failure" states that are part of its normal operational contract, rather than truly exceptional events.

For example, if your Python code is interacting with other components that do not handle exception classes, or if the "error" is a valid, expected outcome of the function's logic, you may want to return a message or a specific error object.

### Returning Error Objects or Sentinel Values

Instead of raising an exception, you might return a special value (like `None`, an empty list, or a boolean `False`) or a structured error object. This is common in scenarios where the caller is expected to check the return value for success or failure.

Consider a function that attempts to parse a configuration file. If the file is malformed, it might return `None` or a specific error enum rather than raising an exception, especially if malformed files are a common, expected input.

```python
from typing import Optional, Tuple

def parse_config(file_path: str) -> Optional[dict]:
    """Parses a config file, returns None if parsing fails."""
    try:
        # ... parsing logic ...
        config_data = {"key": "value"} # Simulate successful parse
        # raise ValueError("Simulate parsing error") # Uncomment to test failure
        return config_data
    except Exception as e:
        print(f"Error parsing config: {e}")
        return None

# Usage
config = parse_config("my_config.ini")
if config is None:
    print("Failed to load configuration. Using defaults.")
else:
    print(f"Configuration loaded: {config}")
```

### Result Types for Explicit Error Handling

More advanced patterns involve "Result" types (e.g., `Ok` or `Err` variants) which explicitly encapsulate either a successful value or an error. Libraries like `returns` provide such constructs, promoting functional error handling.

```python
from returns.result import Result, Success, Failure

def divide(numerator: float, denominator: float) -> Result[float, str]:
    if denominator == 0:
        return Failure("Cannot divide by zero.")
    return Success(numerator / denominator)

# Usage
result1 = divide(10, 2)
if result1.is_success:
    print(f"Division successful: {result1.unwrap()}")
else:
    print(f"Division failed: {result1.failure()}")

result2 = divide(10, 0)
if result2.is_success:
    print(f"Division successful: {result2.unwrap()}")
else:
    print(f"Division failed: {result2.failure()}")
```

This pattern forces the caller to explicitly handle both success and failure paths, reducing the chance of silent failures.

You may also use `return` to give a specific error object, such as with [`HttpResponseNotFound` in Django](https://docs.djangoproject.com/en/3.1/ref/request-response/#httpresponse-subclasses). For example, you may want to return a `404` instead of a `403` for security reasons in a web application:

```python
if object.owner != request.user:
    return HttpResponseNotFound
```

Using `return` can help you write appropriately noisy code when your function is expected to give back a certain value, and when interacting with outside elements or when the "error" is a part of the expected control flow.

## Error Handling Strategies in Production Systems

Understanding how error handling impacts production systems is crucial to building maintainable products.

### Logging and Observability

Effective error handling goes hand-in-hand with robust logging. When an exception is caught or an error condition is returned, it's vital to log relevant context:

*   **Severity:** Use appropriate log levels (e.g., `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`). Exceptions typically warrant `ERROR` or `CRITICAL`.
*   **Context:** Include request IDs, user IDs, input parameters, and any other data that helps diagnose the issue.
*   **Stack Traces:** Always log the full stack trace for exceptions.

Structured logging (e.g., JSON logs) makes it easier to parse, filter, and analyze logs in centralized logging systems.

### Monitoring and Alerting

Beyond logging, critical errors should trigger alerts. This involves integrating with monitoring systems (e.g., Prometheus, Datadog, Sentry) that can:

*   Count occurrences of specific exceptions.
*   Alert on error rates exceeding thresholds.
*   Notify on unhandled exceptions.

Proactive alerting allows teams to respond to issues before they impact users significantly.

### Graceful Degradation and Resilience

In distributed systems, not all errors are fatal. Robust error handling enables graceful degradation. For instance, if a non-critical external service fails, your application might return cached data or a partial response rather than crashing entirely. This requires careful design of `try...except` blocks and `return` strategies to manage dependencies.

## Architectural Considerations & Team Best Practices

As a leader, you guide your team in establishing consistent and effective error handling patterns.

### Consistency Across the Codebase

Establish clear guidelines for when to `raise` and when to `return`. Inconsistent error handling leads to brittle code that is hard to debug and maintain. Document these conventions for your developers as well as your AI tools and enforce them through code reviews.

### Layered Error Handling

Different layers of an application may handle errors differently:

*   **Presentation Layer (e.g., API endpoints):** Often catches exceptions from lower layers and translates them into standardized HTTP error responses (e.g., 4xx, 5xx).
*   **Business Logic Layer:** May raise custom exceptions for business rule violations or return `Result` types for expected outcomes.
*   **Data Access Layer:** Might translate database-specific errors into more generic application-level exceptions or return `None` for "not found" scenarios.

### Error Contracts and Documentation

For public APIs or shared libraries, explicitly document the errors that can be raised or returned. This forms an "error contract" that consumers can rely on, similar to how function signatures define input and output types.

### Testing Error Paths

Thorough testing includes validating error handling. Unit tests should verify that functions raise the correct exceptions or return the expected error values under various failure conditions. Integration tests should confirm that errors propagate correctly through system layers.

## The Most Important Part

Silent failures create some of the most frustrating bugs to find and fix, especially at scale. As a senior engineer or leader, your responsibility extends beyond just writing functional code to designing systems that are resilient, observable, and easy to debug. By intentionally choosing between `raise` and `return`, defining custom exceptions, and implementing comprehensive logging, monitoring, and consistent architectural patterns, you **ensure that errors are handled explicitly and effectively in your Python code.**

If you found some value in this post, there's more! I write about high-output development processes and building maintainable systems in the AI age. You can get my posts in your inbox by subscribing below.

{{< subscribe >}}
