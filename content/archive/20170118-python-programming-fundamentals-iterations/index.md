---
title: "Iteration in Python: for, list, and map"
date: 2017-01-18T21:58:28+07:00
lastmod: 2020-11-22T21:58:28+07:00

aliases:
    - /blog/basics-of-iteration-in-python/
    - /blog/iterations-in-python-for-loop-list-comprehension-and-map/
    - /verbose/python-programming-fundamentals-iterations
    - /verbose/iterations-in-python-for-loop-list-comprehension-and-map
description: The basics of writing iterations in Python using for loops, list comprehensions, and map.
tags:
    - python
    - coding
 
draft: false
categories: ["article"]

wasfeatured:
    - where : url

---

Iteration in Python can be a little hard to understand. Subtle differences in terminology like *iteration*, *iterator*, *iterating*, and *iterable* aren't the most beginner-friendly.

When tackling new concepts, I find concrete examples to be most useful. I'll share some in this post and discuss appropriate situations for each. (Pun intended.)

## For loop

First, in pseudocode:

```python
for iterating_variable in iterable:
    statement(s)
```

I find `for` loops to be the most readable way to iterate in Python. This is especially nice when you're writing code that someone else needs to read and understand, which is always.

An `iterating_variable`, loosely speaking, is anything you could put in a group. For example: a letter in a string, an item from a list, or an integer in a range of integers.

An `iterable` houses the things you iterate on. This can also take different forms: a string with multiple characters, a range of numbers, a list, and so on.

A `statement` or multiple `statements` indicates _doing something_ to the iterating variable.  This could be anything from mathematical expressions to simply printing a result.

Here are a couple simple examples that print each `iterating_variable` of an `iterable`:

```python
for letter in "Hello world":
    print(letter)

for i in range(10):
    print(i)

breakfast_menu = ["toast", "eggs", "waffles", "coffee"]
for choice in breakfast_menu:
    print(choice)
```

You can even use a `for` loop in a more compact situation, such as this one-liner:

```python
breakfast_buffet = " ".join(str(item) for item in breakfast_menu)
```

The downside to `for` loops is that they can be a bit verbose, depending on how much you're trying to achieve. Still, for anyone hoping to make their Python code as easily understood as possible, `for` loops are the most straightforward choice.

## List comprehensions

A pseudocode example:

```python
new_list = [statement(s) for iterating_variable in iterable]
```

List comprehensions are a concise and elegant way to create a new list by iterating on variables. Once you have a grasp of how they work, you can perform efficient iterations with very little code.

List comprehensions will always return a list, which may or may not be appropriate for your situation.

For example, you could use a list comprehension to quickly calculate and print tip percentage on a few bar tabs at once:

```sh
tabs = [23.60, 42.10, 17.50]
tabs_incl_tip = [round(tab*1.15, 2) for tab in tabs]
print(tabs_incl_tip)

>>> [27.14, 48.41, 20.12]
```

In one concise line, we've taken each tab amount, added a 15% tip, rounded it to the nearest cent, and made a new list of the tabs plus the tip values.

List comprehensions can be an elegant tool if output to a list is useful to you. Be advised that the more statements you add, the more complicated your list comprehension begins to look, especially once you get into nested list comprehensions. If your code isn't well annotated, it may become difficult for another reader to figure out.

## Map

How to `map`, in pseudocode:

```python
map(statement, iterable)
```

Map is pretty compact, for better or worse. It can be harder to read and understand, especially if your line of code has a lot of parentheses.

In terms of efficiency for character count, `map` is hard to beat. It applies your `statement` to every instance of your `iterable` and returns an iterator.

Here's an example casting each element of `input()` (the iterable) from string representation to integer representation. Since `map` returns an iterator, you also cast the result to a list representation.

```python
values = list(map(int, input().split()))
weights = list(map(int, input().split()))
```

It's worth noting that you can also use `for` loops, list comprehension, and `map` all together:

```python
output = sum([x[0] * x[1] for x in zip(values, weights)]) / sum(weights)

print(round(output, 1))
```

## Your iteration toolbox

Each of these methods of iteration in Python have a special place in the code I write every day. I hope these examples have helped you see how to use `for` loops, list comprehensions, and `map` in your own Python code!

If you like this post, there's a lot more where that came from! I write about efficient programming for coders and for leading technical teams. Check out the posts below!
