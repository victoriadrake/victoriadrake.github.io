---
title: "How to Think Like a Hacker (And Why Your Team Should Too)"
date: 2021-07-27T04:26:26-04:00

aliases:
    - /posts/leading-with-a-cybersecurity-mindset/
description: "How systematic skepticism helps teams write more secure code. Real strategies for building security-conscious engineering culture through questioning assumptions."
tags:
    - security
    - leadership
    - open-source
 
draft: false
featured: false
---

The most effective security-minded developers I know share one trait: they’re professionally suspicious of their own assumptions. They look at a form field and wonder what happens if someone tries to enter something unexpected. They design an API endpoint and ask how someone might misuse it. They have a systematic curiosity about how systems behave versus how they’re supposed to behave.

I saw this firsthand while working with a team where questioning assumptions became a regular part of our code review process. We’d look at every new feature and ask “How might someone abuse this?” I developed a particular talent for finding injection attacks on forms—apparently I have a knack for thinking of creative ways to sneak SQL queries into text fields. After the third or fourth time I caught these vulnerabilities during review, we added validation middleware to eliminate that entire class of problems.

But the real breakthrough was watching how the team’s thinking evolved. Once developers got used to questioning their assumptions about user behavior, they started writing more robust solutions from the start. Security thinking became a starting point rather than something bolted on afterward.

## Designing for Reality, Not Just Intent

One of the most effective practices we developed was specifying both the “happy path” and the “unhappy path” during our design process. The happy path was straightforward—everything happens in the way and sequence we intended. But the unhappy paths were where we learned the most: what happens when steps occur out of order? When data is missing or provided in an unexpected format? When external systems fail at exactly the wrong moment?

This dual-path thinking transformed how we approached every feature. Instead of just asking “How should this work?” we started asking “How will this actually be used?” and “What should happen when reality doesn’t match our expectations?” It sounds pessimistic, but it actually made development more fun. It caused us to think about our application from all angles rather than just implementing obvious functionality.

The unhappy path exercise revealed assumptions we didn’t even know we were making. We’d design a user registration flow assuming people would fill out forms completely and submit them once. Then we’d consider reality: What if someone submits the form multiple times? What if they navigate away and come back? What if they fill out the form, wait an hour, then submit it after their session expires?

Each unhappy path scenario led to better design decisions. Race condition handling. Idempotent endpoints. Graceful degradation when external services are unavailable. The code that protected against malicious users also handled legitimate users experiencing network glitches or browser crashes.

## Systematic Questioning as a Superpower

There’s a particular mindset that effective security thinking requires—call it systematic skepticism. It’s the ability to look at any system and ask “What assumptions is this making?” and “What happens when those assumptions are wrong?” This kind of thinking makes your software more robust.

Sometimes this means channeling your inner four-year-old—pushing every button, ignoring all instructions, using things in ways their makers never intended. But rather than random exploration, you develop structured ways of challenging system boundaries, finding edge cases, and being creative about the ways that software can be used beyond its intended purpose.

This systematic questioning makes you better at every aspect of development. When you’re used to thinking about edge cases and unexpected inputs, you write more defensive code naturally. When you habitually consider what could go wrong, you build better (more useful) error handling. When you assume users will do unexpected things, you design more intuitive interfaces.

I’ve noticed that developers who adopt this questioning mindset become significantly better at debugging production issues too. Instead of being surprised when something breaks, they’re already thinking “What unexpected condition triggered this?” They approach problems with methodical curiosity rather than frustrated confusion.

## Building a Culture of Constructive Skepticism

The key to building security-conscious teams isn’t teaching people to be afraid of attackers—it’s helping them develop genuine curiosity about system behavior under stress. When questioning assumptions becomes intellectually interesting rather than anxiety-inducing, your team will start doing it automatically.

Code reviews become more engaging when everyone is looking for unspoken assumptions about user behavior. Feature planning gets more thorough when “What are the unhappy paths?” is a standard question alongside “What should it do?” Architecture discussions become more robust when you’re considering not just how systems should work together, but how they should behave when dependencies are slow, unavailable, or returning unexpected data.

The practical implementation is surprisingly straightforward. During development, encourage your team to spend time being deliberately unreasonable with whatever they’re building. During design reviews, spend equal time on happy and unhappy paths. During testing, encourage your team to think like someone who’s never seen your application before and doesn’t understand the rules.

What emerges is a team that builds more resilient systems without extra effort. When you’re accustomed to thinking about failure modes, you naturally design systems that handle them gracefully. When you expect users to ignore instructions, you build interfaces that guide them toward success even when they’re not following the intended flow.

## Security as Engineering Excellence

What I’ve learned is that security thinking is really just rigorous engineering thinking with a creative twist. It’s the same mental process you use when debugging complex issues or designing APIs that won’t confuse future developers. You’re considering multiple perspectives, anticipating edge cases, and designing for resilience rather than just functionality.

The most successful security-conscious teams I’ve worked with don’t have dedicated security experts who review everything after the fact—they have developers who think about security implications as naturally as they think about performance or usability. This happens through cultural reinforcement and consistent practice, not through mandates or compliance checklists.

The payoff extends far beyond security. Teams that think about unhappy paths build more reliable software. Developers who consider malicious inputs write better input validation for legitimate users. Engineers who design for system failures create more robust integrations. The skills reinforce each other in ways that make everyone more effective.

Most importantly, this approach makes engineering work more intellectually satisfying. There’s something deeply rewarding about anticipating problems and solving them before they happen. When your team develops the habit of systematically questioning their assumptions, they’ll approach every problem with the kind of methodical curiosity that leads to truly robust solutions.

You can help your team become professionally curious about system boundaries, failure modes, and the gap between how software is supposed to work and how it actually gets used. Once they develop that mindset, they’ll write more secure code naturally, because they’ll view software the same way attackers do—as systems that can fail when someone does something unexpected.
