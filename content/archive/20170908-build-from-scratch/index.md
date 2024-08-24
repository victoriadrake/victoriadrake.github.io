---
title: How to code a satellite algorithm and cook paella from scratch
date: 2017-09-08T16:50:24-04:00

aliases:
    - /verbose/build-from-scratch
    - /verbose/how-to-code-a-satellite-algorithm-and-cook-paella-from-scratch
description: A guide to expertly tackling seemingly complicated problems that you'd rather never tackle in the first place.
tags:
    - algorithms
    - coding
    - javascript
image: cover_solve-paella.jpg
noToc: true
draft: false
categories: ["article"]

wasfeatured:
    - freeCodeCamp : https://medium.freecodecamp.org/how-to-build-a-program-or-make-dinner-from-scratch-9eb1263ecdbc

---
What if I told you that by the end of this article, you'll be able to calculate the orbital period of satellites around Earth using their average altitudes and... You tuned out already, didn't you?

Okay, how about this: I'm going to teach you how to make paella!

*And* you'll have written a function that does *the stuff I mentioned above*, just like I did for a freeCodeCamp challenge.

I promise there's an overarching moral lesson that will benefit you every day for the rest of your life. Or at least, feed you for one night. Let's get started.

## The only thing I know about paella is that it's an emoticon

{{< figure alt="Unicode paella emoji." src="solve-unicode-paella.jpg" caption="Unless you're reading this on a Samsung phone, in which case you're looking at a Korean hotpot." >}}

One of my favorite things about living in the world today is that it's *totally fine* to know next-to-nothing about something. A hundred years ago you might have gone your whole life not knowing anything more about paella other than that it's an emoticon.* But today? You can simply [look it up](https://en.wikipedia.org/wiki/Paella).

*That was a joke.

As with all things in life, when we are unsure, we turn to the internet - in this case, the entry for *paella* on Wikipedia, which reads:

>Paella ...is a Valencian rice dish. Paella has ancient roots, but its modern form originated in the mid-19th century near the Albufera lagoon on the east coast of Spain adjacent to the city of Valencia. Many non-Spaniards view paella as Spain's national dish, but most Spaniards consider it to be a regional Valencian dish. Valencians, in turn, regard paella as one of their identifying symbols.

At this point, you're probably full of questions. Do I need to talk to a Valencian? Should I take an online course on the history of Spain? What type of paella should I try to make? What is the common opinion of modern chefs when it comes to paella types?

If you set out with the intention of answering all these questions, one thing is certain: you'll never end up actually making paella. You'll spend hours upon hours typing questions into search engines and years later wake up with a Masters in Valencian Cuisine.

## The "Most Important Question" method

When I talk to myself out loud in public (doesn't everyone?) I refer to this as "MIQ" (rhymes with "Nick"). I also imagine MIQ to be a rather crunchy and quite adorable anthropomorphized tortilla chip. Couldn't tell you why.

![MIQ the chip.](solve-miq.png#center)

MIQ swings his crunchy triangular body around to point me in the right direction, and the right direction always takes the form of the most important question that you need to ask yourself at any stage of problem solving. The first most important question is always this:

**What is the scope of the objective I want to achieve?**

Well, you want to make paella.

The next MIQ then becomes: how much do I actually need to know about paella in order to start making it?

You've heard this advice before: any big problem can be broken down into multiple, but more manageable, bite-size problems. In this little constellation of bite-size problems, there's only *one* that you need to solve in order to get *most of the way* to a complete solution.

In the case of making paella, we need a recipe. That's a bite-size problem that a search engine can solve for us:

> **Simple Paella Recipe**
>
> 1. In a medium bowl, mix together 2 tablespoons olive oil, paprika, oregano, and salt and pepper. Stir in chicken pieces to coat. Cover, and refrigerate.
> 1. Heat 2 tablespoons olive oil in a large skillet or paella pan over medium heat. Stir in garlic, red pepper flakes, and rice. Cook, stirring, to coat rice with oil, about 3 minutes. Stir in saffron threads, bay leaf, parsley, chicken stock, and lemon zest. Bring to a boil, cover, and reduce heat to medium low. Simmer 20 minutes.
> 1. Meanwhile, heat 2 tablespoons olive oil in a separate skillet over medium heat. Stir in marinated chicken and onion; cook 5 minutes. Stir in bell pepper and sausage; cook 5 minutes. Stir in shrimp; cook, turning the shrimp, until both sides are pink.
> 1. Spread rice mixture onto a serving tray. Top with meat and seafood mixture. ([allrecipes.com](https://www.allrecipes.com/recipe/84137/easy-paella/))

And *voila*! Believe it or not, we're *most of the way* there already.

Having a set of step-by-step instructions that are easy to understand is really most of the work done. All that's left is to go through the motions of gathering the ingredients and then making paella. From this point on, your MIQs may become fewer and far between, and they may slowly decrease in importance in relation to the overall problem. (Where do I buy paprika? How do I know when sausage is cooked? How do I set the timer on my phone for 20 minutes? How do I stop thinking about this delicious smell? Which Instagram filter best captures the ecstasy of this paella right now?)

{{< figure src="Paella in Nashville Instagram filter" src="solve-insta-paella.jpg" caption="The answer to that last one is Nashville" >}}

## I still know nothing about calculating the orbital periods of satellites

Okay. Let's examine the problem:

> Return a new array that transforms the element's average altitude into their orbital periods.
>
> The array will contain objects in the format {name: 'name', avgAlt: avgAlt}.
>
> You can read about orbital periods on wikipedia.
>
> The values should be rounded to the nearest whole number. The body being orbited is Earth.
>
> The radius of the earth is 6367.4447 kilometers, and the GM value of earth is 398600.4418 km3s-2.
>
> `orbitalPeriod([{name : "sputnik", avgAlt : 35873.5553}])` should return `[{name: "sputnik", orbitalPeriod: 86400}].`

Well, as it turns out, in order to calculate the orbital period of satellites, we also need a recipe. Amazing, the things you can find on the internet these days.

Courtesy of [dummies.com](http://www.dummies.com/education/science/physics/how-to-calculate-the-period-and-orbiting-radius-of-a-geosynchronous-satellite/) (yup! #noshame), here's our recipe:

{{< figure alt="Orbital period formula" src="solve-orbital-period.png" caption="It's kind of cute, in a way." >}}

That might look pretty complicated, but as we've already seen, we just need to answer the next MIQ: how much do I actually need to know about this formula in order to start using it?

In the case of this challenge, not too much. We're already given `earthRadius`, and `avgAlt` is part of our arguments object. Together, they form the radius, *r*. With a couple search queries and some mental time-travel to your elementary math class, we can describe this formula in a smattering of English:

***T*, the orbital period, equals 2 multiplied by Pi, in turn multiplied by the square root of the radius, *r* cubed, divided by the gravitational mass, *GM*.**

JavaScript has a `Math.PI` property, as well as `Math.sqrt()` function and `Math.pow()` function. Using those combined with simple calculation, we can represent this equation in a single line assigned to a variable:

```js
var orbitalPeriod = 2 * Math.PI * (Math.sqrt(Math.pow((earthRadius + avgAlt), 3) / GM));
```

From the inside out:

1. Add `earthRadius` and `avgAlt`
1. Cube the result of step 1
1. Divide the result of step 2 by GM
1. Take the square root of the result of step 3
1. Multiply 2 times Pi times the result of step 4
1. Assign the returned value to `orbitalPeriod`

Believe it or not, we're already most of the way there.

The next MIQ for this challenge is to take the arguments object, extract the information we need, and return the result of our equation in the required format. There are a multitude of ways to do this, but I'm happy with a straightforward `for` loop:

```js
function orbitalPeriod(arr) {
  var resultArr = [];

  for (var teapot = 0; teapot < arguments[0].length; teapot++) {
    var GM = 398600.4418;
    var earthRadius = 6367.4447;
    var avgAlt = arguments[0][teapot]['avgAlt'];
    var name = arguments[0][teapot]['name'];
    var orbitalPeriod = 2 * Math.PI * (Math.sqrt(Math.pow((earthRadius + avgAlt), 3) / GM));
    var result = {
      name: name,
      orbitalPeriod: Math.round(orbitalPeriod)
    }
    resultArr.push(result);
  }

  return resultArr;
}
```

If you need a refresher on iterating through arrays, have a look at my [article on iterating, featuring breakfast arrays](/blog/iterating-over-objects-and-arrays-frequent-errors/)! (5 minutes read)

Don't look now, but you just gained the ability to calculate the orbital period of satellites. You could even do it *while* making paella, if you wanted to. Seriously. Put it on your resume.

## Tl;dr: the overarching moral lesson

Whether it's cooking, coding, or anything else, problems may at first seem confusing, insurmountable, or downright boring. If you're faced with such a challenge, just remember: they're a lot more digestible with a side of bite-sized MIQ chips.

![Bowl of MIQs.](solve-miq-bowl.png#center)
