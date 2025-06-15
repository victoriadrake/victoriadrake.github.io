---
title: Leading with a cybersecurity mindset
date: 2021-07-27T04:26:26-04:00

aliases:
description: Systems for considering software development from a security standpoint.
series:
    - security-for-developers
tags:
    - security
    - leadership
    - open-source
 
draft: false
featured: false
---

Times and technologies change, but a few good ideas are still the same. With consistent application, a handful of wise practices can help deter a slew of cybersecurity attacks. While implementation differs across applications, learning to lead development teams with a cybersecurity mindset boils down to a few fundamental concepts:

- Be a bad guy
- Fail secure
- Practice software minimalism

A slight change in thinking can create a sea change in security. Let's examine how.

## Let's be bad guys

When it comes to cybersecurity, I take a pragmatic approach. There aren't enough sheaves of NIST recommendations in the world to help you if you aren't accustomed to thinking like the bad guy. To best lead your team to defend against hacking, first know how to hack yourself.

A perusal of the resources linked at the end of this article can help you with a starting point, as will general consideration of your application through the lens of an outsider. Are there potentially vulnerable forms or endpoints you might examine first? Is there someone at your company you could call on the phone and surreptitiously get helpful information from? Defense is a difficult position to hold in any battle. If you aren't the first person to consider how your application might be attacked, you've already lost.

Develop your sense of how to be the bad guy. Every component of software, every interaction, every bit of data, can be useful to the bad guy. The more you hone your ability to consider how a thing can be used for ill, the better able you'll be to protect it.

When looking at information, ask, "How can I use this information to gain access to more important information?" When considering a user story, ask, "What happens if I do something unexpected?"

In all things, channel your inner four-year-old. Push all the buttons.

Playing offense on your own application lets you fix vulnerabilities before they happen. That's a luxury you won't get from the real bad guys.

## Fail secure

Every part of a system will fail with 100% certainty on a long enough timescale. Thinking a step ahead can help to ensure that when it does, the one failure doesn't leave your application wide open to others.

To fail secure means that when a system or code fails to perform or does something unexpected, any follow-on effects are halted rather than permitted. This likely takes many forms in many areas of your application, so here are the more common ones I see.

### Permissions

When gating access, deny by default. This most often takes the form of whitelisting, or colloquially, "no one is allowed, except for the people on this list." In terms of code flow, everything should be denied first. Only allow any particular action after proper credentials are verified.

### Automation

For automated workflows such as deployments, ensure each step is dependent on the last. Don't make the (rather common) mistake of connecting actions to triggers that can kick off a workflow before all the necessary pieces are in place. With the smorgasbord of cloud and CI tools available, failure events may not be obvious or noisy.

Be careful to avoid running flows on timed triggers unless they are completely self-contained. Workflows that unpredictably run faster or slower than expected can throw a whole series of events into disarray, leaving processes half-run and states insecure.

### Exception handling

Errors are a frequent gold mine for attackers. Ensure your team's code returns "pretty" errors with content that you can control. "Ugly" errors, returned by default by databases, frameworks, etc, try to be helpful by providing lots of debugging information that can be extremely helpful to a hacker.

## Software minimalism

If your development team doesn't currently have one central source of information when it comes to keeping track of all your application components, here's a tip you really need. In software security, less is more (secure).

The more modular an application is, the better its various components can be isolated, protected, or changed out. With a central source of truth for what all those components are (and preferably one that doesn't rely on manual updates), it's easier to ensure that your application is appropriately minimalist. Dependency managers, such as Pipenv, are a great example.

Few industries besides technology seem to have produced as many acronyms. Philosophies like Don't Repeat Yourself (DRY), Keep It Simple Stupid (KISS), You Aren't Going to Need It (YAGNI), and countless other methodologies all build upon one very basic principle: minimalism. It's a principle that warrants incorporation in every aspect of an application.

There's a reason it takes little skill to shoot the broad side of a barn: barns are rather large, and there's quite a lot of one to hit. Applications bloated by excessive third-party components, repeated code, and unnecessary assets make similarly large targets. The more there is to maintain and protect, the easier it is to hit.

Like Marie Kondo's method for dispatching the inevitable creep of household clutter, you can reduce your application's attack surface by considering each component and asking whether it brings you joy. Do all of this component's functions benefit your application? Is there unnecessary redundancy here? Assess each component and decide how integral it is to the application. Every component is a risk; your job is to decide if it's a worthwhile risk.

## Bonus: your personal Yodas

With the basic principles of learning to think like the bad guy, failing securely, and practicing software minimalism, you're now ready to steep in the specifics. Keeping the fundamentals in mind can help you lead your team to focus your cybersecurity efforts where it matters most.

No Jedi succeeds without a little help from friends. Whether you're a beginner in the battle against the dark side or a twice-returned-home Jedi Master, these resources provide continuing training and guidance.

- [Open Web Application Security Project](https://owasp.org/www-project-web-security-testing-guide/)
- [National Institute of Standards and Technology (NIST): Cybersecurity](https://www.nist.gov/cybersecurity)
- [OWASP Proactive Controls](https://owasp.org/www-project-proactive-controls/)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [NIST Special Publication 800-30: Guide for conducting risk assessments](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-30r1.pdf)
- [NSA’S Cybersecurity Advisories & Technical Guidance](https://www.nsa.gov/Press-Room/Cybersecurity-Advisories-Guidance/)

I hope you find these thought systems helpful! If you find your interest piqued as well, you can read more of what [I've written about cybersecurity here](/tags/cybersecurity).
