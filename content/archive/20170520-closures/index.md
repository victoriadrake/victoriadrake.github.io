---
title: Making sandwiches with closures in JavaScript
date: 2017-05-28T09:16:35+07:00

aliases:
    - /verbose/javascript-closures
    - /verbose/making-sandwiches-with-closures-in-javascript
description: An explanation of closures and how they can emulate private methods in JavaScript.
tags:
    
    
image: cover_closures-sandwich.jpg
 
draft: false
categories: ["article"]

wasfeatured:
    - where : url

---

Say you're having a little coding get-together, and you need some sandwiches. You happen to know that everyone prefers a different type of sandwich, like chicken, ham, or peanut butter and mayo. You could make all these sandwiches yourself, but that would be tedious and boring.

Luckily, you know of a nearby sandwich shop that delivers. They have the ability and ingredients to make any kind of sandwich in the world, and all you have to do is order through their app.

The sandwich shop looks like this:

```js
function makeMeASandwich(x) {
    var ingredients = x.join(' ');
    return function barry() {
        return ingredients.concat(' sandwich');
    }
}
```

Notice that we have an outer function, `makeMeASandwich()` that takes an argument, `x`. This outer function has the local variable `ingredients`, which is just `x` mushed together.

Barry? Who's Barry? He's the guy who works at the sandwich shop. You'll never talk with Barry directly, but he's the reason your sandwiches are made, and why they're so delicious. Barry takes `ingredients` and mushes them together with " sandwich".

The reason Barry is able to access the `ingredients` is because they're in his outer scope. If you were to take Barry out of the sandwich shop, he'd no longer be able to access them. This is an example of *lexical scoping*: "Nested functions have access to variables declared in their outer scope." ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#Lexical_scoping))

Barry, happily at work in the sandwich shop, is an example of a closure.

>**Closures** are functions that refer to independent (free) variables (variables that are used locally, but defined in an enclosing scope). In other words, these functions 'remember' the environment in which they were created. ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures))

When you order, the app submits your sandwich request like so:

```js
var pbm = makeMeASandwich(['peanut butter', 'mayo']);

pbm();
```

And in thirty-minutes-or-it's-free, you get: `peanut butter mayo sandwich`.

The nice thing about the sandwich shop app is that it remembers the sandwiches you've ordered before. Your peanut butter and mayo sandwich is now available to you as `pbm()` for you to order anytime. It's pretty convenient since, each time you order, there's no need to specify that the sandwich you want is the same one you got before with peanut butter and mayo and it's a sandwich. Using `pbm()` is much more concise.

Let's order the sandwiches you need for the party:

```js
var pmrp = makeMeASandwich(['prosciutto', 'mozzarella', 'red pepper']);
var pbt = makeMeASandwich(['peanut butter', 'tuna']);
var hm = makeMeASandwich(['ham']);
var pbm = makeMeASandwich(['peanut butter', 'mayo']);

pmrp();
pbt();
hm();
pbm();
```

Your order confirmation reads:

```sh
prosciutto mozzarella red pepper sandwich
peanut butter tuna sandwich
ham sandwich
peanut butter mayo sandwich
```

Plot twist! The guy who wanted a ham sandwich now wants a ham *and cheese* sandwich. Luckily, the sandwich shop just released a new version of their app that will let you add cheese to any sandwich.

With this added feature, the sandwich shop now looks like this:

```js
function makeMeASandwich(x) {
    var ingredients = x.join(' ');
    var slices = 0;

    function barry() {
        return ingredients.concat(' sandwich');
    }
    function barryAddCheese() {
        slices += 2;
        return ingredients.concat(' sandwich with ', slices, ' slices of cheese');
    }
    return {
        noCheese: function() {
            return barry();
        },
        addCheese: function() {
            return barryAddCheese();
        }
    }
}
```

You amend the order to look like this:

```js
pmrp.noCheese();
pbt.noCheese();
hm.addCheese();
pbm.noCheese();
```

And your order confirmation reads:

```sh
prosciutto mozzarella red pepper sandwich
peanut butter tuna sandwich
ham sandwich with 2 slices of cheese
peanut butter mayo sandwich
```

You'll notice that when you order a sandwich with cheese, Barry puts 2 slices of cheese on it. In this way, the sandwich shop controls how much cheese you get. You can't get to Barry to tell him you want more than 2 slices at a time. That's because your only access to the sandwich shop is through the public functions `noCheese` or `addCheese`.

Of course, there's a way to cheat the system...

```js
hm.addCheese();
hm.addCheese();
hm.addCheese();
```

By ordering the same ham sandwich with cheese three times, you get: `ham sandwich with 6 slices of cheese`.

This happens because the sandwich shop app recognizes the variable `hm` as the same sandwich each time, and increases the number of cheese slices it tells Barry to add.

The app could prevent you from adding lots of cheese to the same sandwich, either by adding a maximum or by appending unique order numbers to the variable names... but this is our fantasy sandwich shop, and we get to pile on as much cheese as we want.

![All the cheese.](closures-cheesestack.jpg#center)

By using closures, we can have JavaScript emulate private methods found in languages like Ruby and Java. Closures are a useful way to extend the functionality of JavaScript, and also order sandwiches.
