---
title: Do I raise or return errors in Python?
date: 2021-02-09T05:34:48-05:00

aliases:
    - /blog/do-i-raise-or-return-errors-in-python/
description: Raise, return, and how to never fail silently in Python.
tags:
    - python
    - coding
    - leadership
showtoc: true
draft: false
categories: ["article"]
---

I hear this question a lot: "Do I raise or return this error in Python?"

The right answer will depend on the goals of your application logic. You want to **ensure your Python code doesn't fail silently,** saving you and your teammates from having to hunt down deeply entrenched errors.

Here's the difference between `raise` and `return` when handling failures in Python.

## When to raise

> The `raise` statement allows the programmer to force a specific exception to occur. ([8.4 Raising Exceptions](https://docs.python.org/3/tutorial/errors.html#raising-exceptions))

Use `raise` when you know you want a specific behavior, such as:

```python
raise TypeError("Wanted strawberry, got grape.")
```

Raising an exception terminates the flow of your program, allowing the exception to bubble up the call stack. In the above example, this would let you explicitly handle `TypeError` later. If `TypeError` goes unhandled, code execution stops and you'll get an *unhandled exception* message.

Raise is useful in cases where you want to define a certain behavior to occur. For example, you may choose to disallow certain words in a text field:

```python
if "raisins" in text_field:
    raise ValueError("That word is not allowed here")
```

Raise takes an instance of an exception, or a derivative of the [Exception class](https://docs.python.org/3/library/exceptions.html#Exception). Here are all of [Python's built-in exceptions](https://docs.python.org/3/library/exceptions.html#bltin-exceptions).

Raise can help you avoid writing functions that fail silently. For example, this code will not raise an exception if `JAM` doesn't exist:

```python
import os


def sandwich_or_bust(bread: str) -> str:
    jam = os.getenv("JAM")
    return bread + str(jam) + bread


s = sandwich_or_bust("\U0001F35E")
print(s)
# Prints "🍞None🍞" which is not very tasty.
```

To cause the `sandwich_or_bust()` function to actually bust, add a `raise`:

```python
import os


def sandwich_or_bust(bread: str) -> str:
    jam = os.getenv("JAM")
    if not jam:
        raise ValueError("There is no jam. Sad bread.")
    return bread + str(jam) + bread


s = sandwich_or_bust("\U0001F35E")
print(s)
# ValueError: There is no jam. Sad bread.
```

Any time your code interacts with an external variable, module, or service, there is a possibility of failure. You can use `raise` in an `if` statement to help ensure those failures aren't silent.

### Raise in `try` and `except`

To handle a possible failure by taking an action if there is one, use a `try` ... `except` statement.

```python
try:
    s = sandwich_or_bust("\U0001F35E")
    print(s)
except ValueError:
    buy_more_jam()
    raise
```

This lets you `buy_more_jam()` before re-raising the exception. If you want to propagate a caught exception, use `raise` without arguments to avoid possible loss of the stack trace.

If you don't know that the exception will be a `ValueError`, you can also use a bare `except:` or catch any derivative of the `Exception` class with `except Exception:`. Whenever possible, it's better to raise and handle exceptions explicitly.

Use `else` for code to execute if the `try` does not raise an exception. For example:

```python
try:
    s = sandwich_or_bust("\U0001F35E")
    print(s)
except ValueError:
    buy_more_jam()
    raise
else:
    print("Congratulations on your sandwich.")
```

You could also place the print line within the `try` block, however, this is less explicit.

## When to return

When you use `return` in Python, you're giving back a value. A function returns to the location it was called from.

While it's more idiomatic to `raise` errors in Python, there may be occasions where you find `return` to be more applicable.

For example, if your Python code is interacting with other components that do not handle exception classes, you may want to return a message instead. Here's an example using a `try` ... `except` statement:

```python
from typing import Union


def share_sandwich(sandwich: int) -> Union[float, Exception]:
    try:
        bad_math = sandwich / 0
        return bad_math
    except Exception as e:
        return e


s = share_sandwich(1)
print(s)
# Prints "division by zero"
```

Note that when you return an `Exception` class object, you'll get a representation of its associated value, usually the first item in its list of arguments. In the example above, this is the string explanation of the exception. In some cases, it may be a tuple with other information about the exception.

You may also use `return` to give a specific error object, such as with [`HttpResponseNotFound` in Django](https://docs.djangoproject.com/en/3.1/ref/request-response/#httpresponse-subclasses). For example, you may want to return a `404` instead of a `403` for security reasons:

```python
if object.owner != request.user:
    return HttpResponseNotFound
```

Using `return` can help you write appropriately noisy code when your function is expected to give back a certain value, and when interacting with outside elements.

## The most important part

Silent failures create some of the most frustrating bugs to find and fix. You can help create a pleasant development experience for yourself and your team by using `raise` and `return` to **ensure that errors are handled in your Python code.**

I write about good development practices and how to improve productivity as a software developer. You can get these tips right in your inbox by signing up below!

<div class="form-container centered" style="border:none; box-shadow: none; background-color:transparent !important;" id="subscribe">
    <iframe src="https://victoriadrake.substack.com/embed" width="480" height="320" style="border:1px solid #EEE; background-color:transparent !important;" frameborder="0" scrolling="no"></iframe>
</div>
