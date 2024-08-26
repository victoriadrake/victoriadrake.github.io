---
title: Writing efficient Django
date: 2020-07-09T04:02:47-05:00
aliases:
    - /archive/writing-efficient-django/
description: How to use Django's views, models, and queries to build a better application.
series:
tags:
    - django
    - coding
    - python
image: code.png
noToc: true
draft: false
categories: ["article"]
---

I like Django. It's a well-considered and intuitive framework with a name I can pronounce out loud. You can use it to quickly spin up a weekend-sized project, and you can still use it to run [full-blown production applications](https://applybyapi.com) at scale. I've done both these things, and over the years I've discovered how to use some of Django's features for maximum efficiency. These are:

- [Class-based versus function-based views](#class-based-versus-function-based-views)
- [Django models](#django-models)
- [Retrieving objects with queries](#retrieving-objects-with-queries)

Understanding these main features are the building blocks for maximizing development efficiency with Django. They'll build the foundation for you to [test efficiently](/posts/increase-developer-confidence-with-a-great-django-test-suite/) and [create an awesome development experience for your engineers](/blog/django-project-best-practices-to-keep-your-developers-happy/). Let's look at how these tools let you create a performant Django application that's pleasant to build and maintain.

## Class-based versus function-based views

Remember that Django is all Python under the hood. When it comes to views, you've got two choices: [view functions](https://docs.djangoproject.com/en/3.2/topics/http/views/) (sometimes called "function-based views"), or [class-based views](https://docs.djangoproject.com/en/3.2/topics/class-based-views/).

Years ago when I first built [ApplyByAPI](https://applybyapi.com), it was initially composed entirely of function-based views. These offer granular control, and are good for implementing complex logic; just as in a Python function, you have complete control (for better or worse) over what the view does. With great control comes great responsibility, and function-based views can be a little tedious to use. You're responsible for writing all the necessary methods for the view to work - this is what allows you to completely tailor your application.

In the case of ApplyByAPI, there were only a sparse few places where that level of tailored functionality was really necessary. Everywhere else, function-based views began making my life harder. Writing what is essentially a custom view for run-of-the-mill operations like displaying data on a list page became tedious, repetitive, and error-prone.

With function-based views, you'll need figure out which Django methods to implement in order to handle requests and pass data to views. Unit testing can take some work to write. In short, the granular control that function-based views offer also requires some granular tedium to properly implement.

I ended up holding back ApplyByAPI while I refactored the majority of the views into class-based views. This was not a small amount of work and refactoring, but when it was done, I had a bunch of tiny views that made a huge difference. I mean, just look at this one:

```python
class ApplicationsList(ListView):
    model = Application
    template_name = "applications.html"
```

It's three lines. My developer ergonomics, and my life, got a lot easier.

You may think of class-based views as templates that cover most of the functionality any app needs. There are views for displaying lists of things, for viewing a thing in detail, and [editing views](https://docs.djangoproject.com/en/3.2/ref/class-based-views/generic-editing/) for performing CRUD (Create, Read, Update, Delete) operations. Because implementing one of these generic views takes only a few lines of code, my application logic became dramatically succinct. This gave me less repeated code, fewer places for something to go wrong, and a more manageable application in general.

Class-based views are fast to implement and use. The built-in class-based generic views may require less work to test, since you don't need to write tests for the base view Django provides. (Django does its own tests for that; no need for your app to double-check.) To tweak a generic view to your needs, you can [subclass a generic view](https://docs.djangoproject.com/en/3.2/topics/class-based-views/#subclassing-generic-views) and override attributes or methods. In my case, since I only needed to write tests for any customizations I added, my test files became dramatically shorter, as did the time and resources it took to run them.

When you're weighing the choice between function-based or class-based views, consider the amount of customization the view needs, and the future work that will be necessary to test and maintain it. If the logic is common, you may be able to hit the ground running with a generic class-based view. If you need sufficient granularity that re-writing a base view's methods would make it overly complicated, consider a function-based view instead.

## Django models

[Models](https://docs.djangoproject.com/en/3.2/topics/db/models/) organize your Django application's central concepts to help make them flexible, robust, and easy to work with. If used wisely, models are a powerful way to collate your data into a definitive source of truth.

Like views, Django provides some built-in model types for the convenience of implementing basic authentication, including the [User](https://docs.djangoproject.com/en/3.2/ref/contrib/auth/) and [Permission](https://docs.djangoproject.com/en/3.2/ref/contrib/auth/) models. For everything else, you can create a model that reflects your concept by [inheriting from a parent Model class](https://docs.djangoproject.com/en/3.2/topics/db/models/#model-inheritance).

```python
class StaffMember(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company = models.OneToOneField(Company, on_delete=models.CASCADE)

    def __str__(self):
        return self.company.name + " - " + self.user.email
```

When you create a custom model in Django, you subclass [Django's Model class](https://github.com/django/django/blob/master/django/db/models/base.py) and take advantage of all its power. Each model you create generally maps to a database table. Each attribute is a database field. This gives you the ability to create objects to work with that humans can better understand.

You can make a model useful to you by defining its fields. Many [built-in field types](https://docs.djangoproject.com/en/3.2/ref/models/fields/#model-field-types) are conveniently provided. These help Django figure out the data type, the HTML [widget](https://docs.djangoproject.com/en/3.2/ref/forms/widgets/) to use when rendering a form, and even [form validation](https://docs.djangoproject.com/en/3.2/ref/forms/validation/) requirements. If you need to, you can [write custom model fields](https://docs.djangoproject.com/en/3.2/howto/custom-model-fields/).

Database [relationships](https://docs.djangoproject.com/en/3.2/topics/db/models/#relationships) can be defined using a [ForeignKey](https://docs.djangoproject.com/en/3.2/ref/models/fields/#django.db.models.ForeignKey) field (many-to-one), or a [ManyToManyField](https://docs.djangoproject.com/en/3.2/ref/models/fields/#django.db.models.ManyToManyField) (give you three guesses). If those don't suffice, there's also a [OneToOneField](https://docs.djangoproject.com/en/3.2/ref/models/fields/#django.db.models.OneToOneField). Together, these allow you to define relations between your models with levels of complexity limited only by your imagination. (Depending on the imagination you have, this may or may not be an advantage.)

## Retrieving objects with queries

Use your model's Manager (`objects` by default) to [construct a QuerySet](https://docs.djangoproject.com/en/3.2/topics/db/queries/#retrieving-objects). This is a representation of objects in your database that you can refine, using methods, to retrieve specific subsets. All available methods are in the [QuerySet API](https://docs.djangoproject.com/en/3.2/ref/models/querysets/#django.db.models.query.QuerySet) and can be chained together for even more fun.

```py
Post.objects.filter(
    type="new"
).exclude(
    title__startswith="Blockchain"
)
```

Some methods return new QuerySets, such as [`filter()`](https://docs.djangoproject.com/en/3.2/ref/models/querysets/#filter), or [`exclude()`](https://docs.djangoproject.com/en/3.2/ref/models/querysets/#exclude). Chaining these can give you powerful queries without affecting performance, as QuerySets aren't fetched from the database [until they are evaluated](https://docs.djangoproject.com/en/3.2/ref/models/querysets/#when-querysets-are-evaluated). Methods that evaluate a QuerySet include `get()`, [`count()`](https://docs.djangoproject.com/en/3.2/ref/models/querysets/#count), `len()`, `list()`, or `bool()`.

Iterating over a QuerySet also evaluates it, so avoid doing so where possible to improve query performance. For instance, if you just want to know if an object is present, you can use `exists()` to avoid iterating over database objects.

Use [`get()`](https://docs.djangoproject.com/en/3.2/ref/models/querysets/#django.db.models.query.QuerySet.get) in cases where you want to retrieve a specific object. This method raises [`MultipleObjectsReturned`](https://docs.djangoproject.com/en/3.2/ref/exceptions/#django.core.exceptions.MultipleObjectsReturned) if something unexpected happens, as well as the `DoesNotExist` exception, if, take a guess.

If you'd like to get an object that may not exist in the context of a user's request, use the convenient [`get_object_or_404()`](https://docs.djangoproject.com/en/3.2/topics/http/shortcuts/#get-object-or-404) or [`get_list_or_404()`](https://docs.djangoproject.com/en/3.2/topics/http/shortcuts/#get-list-or-404) which raises [`Http404`](https://docs.djangoproject.com/en/3.2/topics/http/views/#django.http.Http404) instead of [`DoesNotExist`](https://docs.djangoproject.com/en/3.2/ref/models/instances/#django.db.models.Model.DoesNotExist). These helpful [shortcuts](https://docs.djangoproject.com/en/3.2/topics/http/shortcuts/) are suited to just this purpose. To create an object that doesn't exist, there's also the convenient [`get_or_create()`](https://docs.djangoproject.com/en/3.2/ref/models/querysets/#get-or-create).

<!-- omit in toc -->
## Efficient essentials

You've now got a handle on these three essential tools for building your efficient Django application -- congratulations! You can make Django work even better for you by learning about [manipulating data with migrations](/posts/manipulating-data-with-django-migrations/), [testing effectively](/posts/increase-developer-confidence-with-a-great-django-test-suite/), and [setting up your team's Django development for maximum happiness](/blog/django-project-best-practices-to-keep-your-developers-happy/).

If you're going to build on GitHub, you may like to set up my [django-security-check GitHub Action](https://github.com/victoriadrake/django-security-check). In the meantime, you're well on your way to building a beautiful software project.
