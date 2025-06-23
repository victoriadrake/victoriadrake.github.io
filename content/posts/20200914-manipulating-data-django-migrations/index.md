---
title: Manipulating data with Django migrations
date: 2020-09-14T02:12:57-04:00
aliases:
    - /archive/manipulating-data-with-django-migrations/
    - /manipulating-data-with-django-migrations/
description: How to update Django models and manipulate existing data using migrations.
series:
tags:
    - development
    - data
    - python
image: cover.png
 
draft: false
categories: ["article"]
---

Growing, successful applications are a lovely problem to have. As a product develops, it tends to accumulate complication the way your weekend cake project accumulates layers of frosting. Thankfully, Django, my favorite batteries-included framework, handles complexity pretty well.

Django [models help humans work with data in a way that makes sense to our brains](/posts/writing-efficient-django/#django-models), and the framework offers plenty of classes you can inherit to help you rapidly develop a robust application from scratch. As for developing on existing Django applications, there's a feature for that, too. In this article, we'll cover how to use Django migrations to update your existing models and database.

## What's under the hood

Django migrations are Python files that help you add and change things in your database tables to reflect changes in your Django models. To understand how Django migrations help you work with data, it may be helpful to understand the underlying structures we're working with.

### What's a database table

If you've laid eyes on a spreadsheet before, you're already most of the way to understanding a database table. In a relational database, for example, a PostgreSQL database, you can expect to see data organized into columns and rows. A relational database table may have a set number of columns and any number of rows.

In Django, each model is its own table. For example, here's a Django model:

```python
from django.db import models


class Lunch(models.Model):
    left_side = models.CharField(max_length=100, null=True)
    center = models.CharField(max_length=100, null=True)
    right_side = models.CharField(max_length=100, null=True)
```

Each field is a column, and each row is a Django object instance of that model. Here's a representation of a database table for the Django model "Lunch" above. In the database, its name would be `lunch_table`.

| id  | left_side | center | right_side |
| --- | --------- | ------ | ---------- |
| 1   | Fork      | Plate  | Spoon      |

The model `Lunch` has three fields: `left_side`, `center`, and `right-side`. One instance of a `Lunch` object would have "Fork" for the `left_side`, a "Plate" for the `center`, and "Spoon" for the `right_side`. Django [automatically adds an `id` field](https://docs.djangoproject.com/en/3.2/topics/db/models/#automatic-primary-key-fields) if you don't specify a primary key.

If you wanted to change the name of your Lunch model, you would do so in your `models.py` code. For example, change "Lunch" to "Dinner," then [run `python manage.py makemigrations`](https://docs.djangoproject.com/en/3.2/ref/django-admin/#makemigrations). You'll see:

```text
python manage.py makemigrations
Did you rename the backend.Lunch model to Dinner? [y/N] y
Migrations for 'backend':
  backend/migrations/0003_auto_20200922_2331.py
    - Rename model Lunch to Dinner
```

Django automatically generates the appropriate migration files. The relevant line of the generated migrations file in this case would look like:

```python
migrations.RenameModel(old_name="Lunch", new_name="Dinner"),
```

This operation would rename our "Lunch" model to "Dinner" while keeping everything else the same. But what if you also wanted to change the structure of the database table itself, its schema, as well as make sure that existing data ends up in the right place on your Dinner table?

Let's explore how to turn our Lunch model into a Dinner model that looks like this:

```python
from django.db import models


class Dinner(models.Model):
    top_left = models.CharField(max_length=100, null=True)
    top_center = models.CharField(max_length=100, null=True)
    top_right = models.CharField(max_length=100, null=True)
    bottom_left = models.CharField(max_length=100, null=True)
    bottom_center = models.CharField(max_length=100, null=True)
    bottom_right = models.CharField(max_length=100, null=True)
```

...with a database table that would look like this:

| id  | top_left    | top_center | top_right | bottom_left | bottom_center | bottom_right |
| --- | ----------- | ---------- | --------- | ----------- | ------------- | ------------ |
| 1   | Bread plate | Spoon      | Glass     | Fork        | Plate         | Knife        |

## Manipulating data with Django migrations

Before you begin to manipulate your data, it's always a good idea to create a backup of your database that you can restore in case something goes wrong. There are various ways to do this depending on the database you're using. You can typically find instructions by searching for `<your database name>` and keywords like `backup`, `recovery`, or `snapshot`.

In order to design your migration, it's helpful to become familiar with the available [migration operations](https://docs.djangoproject.com/en/3.2/ref/migration-operations/). Migrations are run step-by-step, and each operation is some flavor of adding, removing, or altering data. Like a strategic puzzle, it's important to make model changes one step at a time so that the generated migrations have the correct result.

We've already renamed our model successfully. Now, we'll rename the fields that hold the data we want to retain:

```python
class Dinner(models.Model):
    bottom_left = models.CharField(max_length=100, null=True)
    bottom_center = models.CharField(max_length=100, null=True)
    top_center = models.CharField(max_length=100, null=True)
```

Django is sometimes smart enough to determine the old and new field names correctly. You'll be asked for confirmation:

```text
python manage.py makemigrations
Did you rename dinner.center to dinner.bottom_center (a CharField)? [y/N] y
Did you rename dinner.left_side to dinner.bottom_left (a CharField)? [y/N] y
Did you rename dinner.right_side to dinner.top_center (a CharField)? [y/N] y
Migrations for 'backend':
  backend/migrations/0004_auto_20200914_2345.py
    - Rename field center on dinner to bottom_center
    - Rename field left_side on dinner to bottom_left
    - Rename field right_side on dinner to top_center
```

In some cases, you'll want to try renaming the field and running `makemigrations` one at a time.

Now that the existing fields have been migrated to their new names, add the remaining fields to the model:

```python
class Dinner(models.Model):
    top_left = models.CharField(max_length=100, null=True)
    top_center = models.CharField(max_length=100, null=True)
    top_right = models.CharField(max_length=100, null=True)
    bottom_left = models.CharField(max_length=100, null=True)
    bottom_center = models.CharField(max_length=100, null=True)
    bottom_right = models.CharField(max_length=100, null=True)
```

Running `makemigrations` again now gives us:

```text
python manage.py makemigrations
Migrations for 'backend':
  backend/migrations/0005_auto_20200914_2351.py
    - Add field bottom_right to dinner
    - Add field top_left to dinner
    - Add field top_right to dinner
```

You're done! By generating Django migrations, you've successfully set up your `dinner_table` and moved existing data to its new spot.

## Additional complexity

You'll notice that our Lunch and Dinner models are not very complex. Out of Django's many [model field options](https://docs.djangoproject.com/en/3.2/ref/models/fields/#field-types), we're just using `CharField`. We also set `null=True` to let Django store empty values as `NULL` in the database.

Django migrations can handle additional complexity, such as changing field types, and whether a blank or null value is permitted. I keep Django's [model field reference](https://docs.djangoproject.com/en/3.2/ref/models/fields/#) handy as I work with varying types of data and different use cases.

## De-mystified migrations

I hope this article has helped you better understand Django migrations and how they work!

Now that you can change models and manipulate existing data in your Django application, be sure to use your powers wisely! Backup your database, research and plan your migrations, and always run tests before working with customer data. By doing so, you have the potential to enable your application to grow -- with manageable levels of complexity.
