---
title: A Unicode substitution cipher algorithm
date: 2018-01-06T20:00:28-05:00

aliases:
    - /verbose/unicode-cipher
    - /verbose/a-unicode-substitution-cipher-algorithm
description: How a fun but useless project turned into a Unicode substitution cipher algorithm.
tags:
    - algorithms
    
image: cover_unicode-secret.png
 
draft: false
categories: ["article"]

wasfeatured:
    - The 7 Most Popular DEV Posts from the Past Week : https://dev.to/thepracticaldev/the-7-most-popular-dev-posts-from-the-past-week-52d4

---

Full transparency: I occasionally waste time messing around on Twitter. *(Gasp! Shock!)* One of the ways I waste time messing around on Twitter is by writing my name in my profile with different Unicode character "fonts," 𝖑𝖎𝖐𝖊 𝖙𝖍𝖎𝖘 𝖔𝖓𝖊. I previously did this by searching for different Unicode characters on Google, then one-by-one copying and pasting them into the "Name" field on my Twitter profile. Since this method of wasting time was a bit of a time waster, I decided (in true programmer fashion) to write a tool that would help me save some time while wasting it.

I originally dubbed the tool "uni-pretty," (based on LEGO's Unikitty from a movie -- a pun that absolutely no one got) but have since renamed it [fancy unicode](https://fancyunicode.com). It builds from [this GitHub repo](https://github.com/victoriadrake/fancy-unicode). It lets you type any characters into a field and then converts them into Unicode characters that also represent letters, giving you fancy "fonts" that override a website's CSS, like in your Twitter profile. (Sorry, Internet.)

![fancy-unicode screenshot](screenshot.png#screenshot)

The tool's first naive iteration existed for about twenty minutes while I copy-pasted Unicode characters into a data structure. This approach of storing the characters in the JavaScript file, called hard-coding, is fraught with issues. Besides having to store every character from every font style, it's painstaking to build, hard to update, and more code means it's susceptible to more possible errors.

Fortunately, working with Unicode means that there's a way to avoid the whole mess of having to store all the font characters: Unicode numbers are sequential. More importantly, the special characters in Unicode that could be used as fonts (meaning that there's a matching character for most or all of the letters of the alphabet) are always in the following sequence: capital A-Z, lowercase a-z.

For example, in the fancy Unicode above, the lowercase letter "L" character has the Unicode number `U+1D591` and HTML code `&#120209;`. The next letter in the sequence, a lowercase letter "M," has the Unicode number `U+1D592` and HTML code `&#120210;`. Notice how the numbers in those codes increment by one.

Why's this relevant? Since each special character can be referenced by a number, and we know that the order of the sequence is always the same (capital A-Z, lowercase a-z), we're able to produce any character simply by knowing the first number of its font sequence (the capital "A"). If this reminds you of anything, you can borrow my decoder pin.

In cryptography, the Caesar cipher (or shift cipher) is a simple method of encryption that utilizes substitution of one character for another in order to encode a message. This is typically done using the alphabet and a shift "key" that tells you which letter to substitute for the original one. For example, if I were trying to encode the word "cat" with a right shift of 3, it would look like this:

```bash
c a t
f d w
```

With this concept, encoding our plain text letters as a Unicode "font" is a simple process. All we need is an array to reference our plain text letters with, and the first index of our Unicode capital "A" representation. Since some Unicode numbers also include letters (which are sequential, but an unnecessary complication) and since the intent is to display the page in HTML, we'll use the HTML code number `&#120172;`, with the extra bits removed for brevity.

```js
var plain = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var fancyA = 120172;
```

Since we know that the letter sequence of the fancy Unicode is the same as our plain text array, any letter can be found by using its index in the plain text array as an offset from the fancy capital "A" number. For example, capital "B" in fancy Unicode is the capital "A" number, `120172` plus B's index, which is `1`: `120173`.

Here's our conversion function:

```js
function convert(string) {
    // Create a variable to store our converted letters
    let converted = [];
    // Break string into substrings (letters)
    let arr = string.split('');
    // Search plain array for indexes of letters
    arr.forEach(element => {
        let i = plain.indexOf(element);
        // If the letter isn't a letter (not found in the plain array)
        if (i == -1) {
            // Return as a whitespace
            converted.push(' ');
        } else {
            // Get relevant character from fancy number + index
            let unicode = fancyA + i;
            // Return as HTML code
            converted.push('&#' + unicode + ';');
        }

    });
    // Print the converted letters as a string
    console.log(converted.join(''));
}
```

A neat possibility for this method of encoding requires a departure from my original purpose, which was to create a human-readable representation of the original string. If the purpose was instead to produce a cipher, this could be done by using any Unicode index in place of `fancyA` as long as the character indexed isn't a representation of a capital "A."

Here's the same code set up with a simplified plain text array, and a non-letter-representation Unicode key:

```js
var plain = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var key = 9016;
```

You might be able to imagine that decoding a cipher produced by this method would be relatively straightforward, once you knew the encoding secret. You'd simply need to subtract the key from the HTML code numbers of the encoded characters, then find the relevant plain text letters at the remaining indexes.

Well, that's it for today. Be sure to drink your Ovaltine and we'll see you right here next Monday at 5:45!

Oh, and... ⍔⍠⍟⍘⍣⍒⍥⍦⍝⍒⍥⍚⍠⍟⍤ ⍒⍟⍕ ⍨⍖⍝⍔⍠⍞⍖ ⍥⍠ ⍥⍙⍖ ⍔⍣⍪⍡⍥⍚⍔ ⍦⍟⍚⍔⍠⍕⍖ ⍤⍖⍔⍣⍖⍥ ⍤⍠⍔⍚⍖⍥⍪

:)
