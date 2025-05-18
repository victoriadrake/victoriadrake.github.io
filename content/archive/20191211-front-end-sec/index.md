---
title: Secure web forms for the front-end developer
date: 2019-12-11T08:27:31-04:00

aliases:
    - /blog/security-for-the-front-end-developer/
    - /blog/user-interface-security-for-the-front-end-developer/
description: "How to design secure web forms: validate, sanitize, and control."
series:
    - security-for-developers
series_weight: 4
tags:
    - cybersecurity
    - coding
    - leadership
image: cover.png
 
draft: false
categories: ["article"]
---

While cybersecurity is often thought of in terms of databases and architecture, much of a strong security posture relies on elements in the domain of the front-end developer. For certain potentially devastating vulnerabilities like [SQL injection](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A1-Injection) and [Cross-Site Scripting (XSS)](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A7-Cross-Site_Scripting_(XSS)), a well-considered user interface is the first line of defense.

Here are a few areas of focus for front-end developers who want to help fight the good fight.

## Control user input

A whole whack of [crazy things](/blog/sql-injection-and-xss-what-white-hat-hackers-know-about-trusting-user-input/) can happen when developers build a form that fails to control user input. To combat vulnerabilities like injection, it's important to validate or sanitize user input.

Input can be validated by constraining it to known values, such as by using [semantic input types](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Semantic_input_types) or [validation-related attributes](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes) in forms. Frameworks like [Django](https://www.djangoproject.com/) also help by providing [field types](https://docs.djangoproject.com/en/3.0/ref/models/fields/#field-types) for this purpose. Sanitizing data can be done by removing or replacing contextually-dangerous characters, such as by using a whitelist or escaping the input data.

While it may not be intuitive, even data that a user submits to their own area on a site should be validated. One of the fastest viruses to proliferate was the [Samy worm](https://en.wikipedia.org/wiki/Samy_(computer_worm)) on MySpace (yes, I'm old), thanks to code that Samy Kamkar was able to inject into his own profile page. Don't directly return any input to your site without thorough validation or santization.

For some further guidance on battling injection attacks, see the [OWASP Injection Prevention Cheat Sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Injection_Prevention_Cheat_Sheet.md).

## Beware hidden fields

Adding `type="hidden"` is an enticingly convenient way to hide sensitive data in pages and forms, but unfortunately not an effective one. With tools like [ZapProxy](https://www.zaproxy.org/) and even inspection tools in plain ol' web browsers, users can easily click to reveal tasty bits of invisible information. Hiding checkboxes can be a neat hack for creating CSS-only switches, but hidden fields do little to contribute to security.

## Carefully consider autofill fields

When a user chooses to give you their [Personally Identifiable Information](https://en.wikipedia.org/wiki/Personal_data) (PII), it should be a conscious choice. Autofill form fields can be convenient - for both users and attackers. [Exploits using hidden fields can harvest PII](https://freedom-to-tinker.com/2017/12/27/no-boundaries-for-user-identities-web-trackers-exploit-browser-login-managers/) previously captured by an autocomplete field.

Many users aren't even aware what information their browser's autofill has stored up. Use these fields sparingly, and disable autofilled forms for particularly sensitive data.

It's important to also weigh your risk profile against its trade-offs. If your project must be [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) compliant, disabling autocomplete can break your input for different modalities. For more, see [1.3.5: Identify Input Purpose in WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html).

## Keep errors generic

While it may seem helpful to let users know whether a piece of data exists, it's also very helpful to attackers. When dealing with accounts, emails, and PII, it's most secure to err (🥁) on the side of less. Instead of returning "Your password for this account is incorrect," try the more ambiguous feedback "Incorrect login information," and avoid revealing whether the username or email is in the system.

In order to be more helpful, provide a prominent way to contact a human in case an error should arise. Avoid revealing information that isn't necessary. If nothing else, for heaven's sake, don't suggest data that's a close match to the user input.

## Be a bad guy

When considering security, it's helpful to take a step back, observe the information on display, and ask yourself how a malicious attacker would be able to utilize it. Play devil's advocate. If a bad guy saw this page, what new information would they gain? Does the view show any PII?

Ask yourself if everything on the page is actually necessary for a genuine user. If not, redact or remove it. Less is safer.

## Security starts at the front door

These days, there's a lot more overlap between coding on the front end and the back end. To create a well-rounded and secure application, it helps to have a general understanding of ways attackers can get their foot in the front door.
