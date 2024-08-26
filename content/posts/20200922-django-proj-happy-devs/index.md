---
title: Django project best practices to keep your developers happy
date: 2020-09-22T04:55:19-04:00

aliases:
    - /blog/my-django-project-best-practices-for-happy-developers/
    - /archive/django-project-best-practices-to-keep-your-developers-happy/
description: Using Makefiles, pre-commit, and GitHub Actions to help create a happy development team.
series:
tags:
    - django
    - python
    - leadership
    - coding
    - docs
image: cover.png
noToc: true
draft: false
categories: ["article"]
---

Do you want your team to _enjoy_ your development workflow? Do you think building software should be _fun and existentially fulfilling?_ If so, _this is the post_ for you!

I've been developing with Django for years, and I've never been happier with my Django project set up than I am right now. Here's how I'm making a day of developing with Django the most relaxing and enjoyable development experience possible for myself and my engineering team.

## A custom CLI tool for your Django project

Instead of typing:

```sh
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic
python3 manage.py runserver
```

Wouldn't it be much nicer to type:

```sh
make start
```

...and have all that happen for you? I think so!

We can do that with a self-documenting Makefile! Here's one I frequently use when developing my Django applications, like [ApplyByAPI.com](https://applybyapi.com/):

```Makefile
VENV := env
BIN := $(VENV)/bin
PYTHON := $(BIN)/python
SHELL := /bin/bash

include .env

.PHONY: help
help: ## Show this help
    @egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: venv
venv: ## Make a new virtual environment
    python3 -m venv $(VENV) && source $(BIN)/activate

.PHONY: install
install: venv ## Make venv and install requirements
    $(BIN)/pip install --upgrade -r requirements.txt

freeze: ## Pin current dependencies
    $(BIN)/pip freeze > requirements.txt

migrate: ## Make and run migrations
    $(PYTHON) manage.py makemigrations
    $(PYTHON) manage.py migrate

db-up: ## Pull and start the Docker Postgres container in the background
    docker pull postgres
    docker-compose up -d

db-shell: ## Access the Postgres Docker database interactively with psql. Pass in DBNAME=<name>.
    docker exec -it container_name psql -d $(DBNAME)

.PHONY: test
test: ## Run tests
    $(PYTHON) manage.py test application --verbosity=0 --parallel --failfast

.PHONY: run
run: ## Run the Django server
    $(PYTHON) manage.py runserver

start: install migrate run ## Install requirements, apply migrations, then start development server
```

You'll notice the presence of the line `include .env` above. This ensures `make` has access to environment variables stored in a file called `.env`. This allows Make to utilize these variables in its commands, for example, the name of my virtual environment, or to pass in `$(DBNAME)` to `psql`.

What's with that weird "`##`" comment syntax? A Makefile like this gives you a handy suite of command-line aliases you can check in to your Django project. It's very useful so long as you're able to remember what all those aliases are.

The `help` command above, which runs by default, prints a helpful list of available commands when you run `make` or `make help`:

```text
help                 Show this help
venv                 Make a new virtual environment
install              Make venv and install requirements
migrate              Make and run migrations
db-up                Pull and start the Docker Postgres container in the background
db-shell             Access the Postgres Docker database interactively with psql
test                 Run tests
run                  Run the Django server
start                Install requirements, apply migrations, then start development server
```

All the usual Django commands are covered, and we've got a `test` command that runs our tests with the options we prefer. Brilliant.

You can read my full [post about self-documenting Makefiles here](/posts/how-to-create-a-self-documenting-makefile/), which also includes an example Makefile using `pipenv`.

## Save your brainpower with pre-commit hooks

I previously wrote about some [technical ergonomics](/posts/technical-ergonomics-for-the-efficient-developer/) that can make it a lot easier for teams to develop great software.

One area that's a no-brainer is using pre-commit hooks to lint code prior to checking it in. This helps to ensure the quality of the code your developers check in, but most importantly, ensures that no one on your team is spending time trying to remember if it should be single or double quotes or where to put a line break.

The confusingly-named [pre-commit framework](https://pre-commit.com/) is an otherwise fantastic way to keep hooks (which are not included in cloned repositories) consistent across local environments.

Here is my configuration file, `.pre-commit-config.yaml`, for my Django projects:

```yaml
fail_fast: true
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v3.1.0
    hooks:
      - id: detect-aws-credentials
  - repo: https://github.com/psf/black
    rev: 19.3b0
    hooks:
      - id: black
  - repo: https://github.com/asottile/blacken-docs
    rev: v1.7.0
    hooks:
      - id: blacken-docs
        additional_dependencies: [black==19.3b0]
  - repo: local
    hooks:
      - id: markdownlint
        name: markdownlint
        description: "Lint Markdown files"
        entry: markdownlint '**/*.md' --fix --ignore node_modules --config "./.markdownlint.json"
        language: node
        types: [markdown]
```

These hooks check for accidental secret commits, format Python files using [Black](https://github.com/psf/black), format Python snippets in Markdown files using [`blacken-docs`](https://github.com/asottile/blacken-docs), and [lint Markdown files](https://github.com/igorshubovych/markdownlint-cli) as well. To install them, just type `pre-commit install`.

There are likely even more useful hooks available for your particular use case: see [supported hooks](https://pre-commit.com/hooks.html) to explore.

## Useful gitignores

An underappreciated way to improve your team's daily development experience is to make sure your project uses a well-rounded `.gitignore` file. It can help prevent files containing secrets from being committed, and can additionally save developers hours of tedium by ensuring you're never sifting through a `git diff` of generated files.

To efficiently create a [gitignore for Python and Django projects](https://www.toptal.com/developers/gitignore/api/python,django), Toptal's [gitignore.io](https://gitignore.io) can be a nice resource for generating a robust `.gitignore` file.

I still recommend examining the generated results yourself to ensure that ignored files suit your use case, and that nothing you want ignored is commented out.

## Continuous testing with GitHub Actions

If your team works on GitHub, setting up a testing process with Actions is low-hanging fruit.

Tests that run in a consistent environment on every pull request can help eliminate "works on my machine" conundrums, as well as ensure no one's sitting around waiting for a test to run locally.

A hosted CI environment like GitHub Actions can also help when running integration tests that require using managed services resources. You can use [encrypted secrets in a repository](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) to grant the Actions runner access to resources in a testing environment, without worrying about creating testing resources and access keys for each of your developers to use.

I've written on many occasions about setting up Actions workflows, including [using one to run your Makefile](/posts/a-lightweight-tool-agnostic-ci/cd-flow-with-github-actions/), and [how to integrate GitHub event data](/blog/publishing-github-event-data-with-github-actions-and-pages/). GitHub even [interviewed me about Actions](https://github.blog/2020-06-26-github-action-hero-victoria-drake/) once.

For Django projects, here's a GitHub Actions workflow that runs tests with a consistent Python version whenever someone opens a pull request in the repository.

```yaml
name: Run Django tests

on: pull_request

jobs:
  test:

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.8'
      - name: Install dependencies
        run: make install
      - name: Run tests
        run: make test
```

For the installation and test commands, I've simply utilized the [Makefile](#a-custom-cli-tool-for-your-django-project) that's been checked in to the repository. A benefit of using your Makefile commands in your CI test workflows is that you only need to keep them updated in one place -- your Makefile! No more "why is this working locally but not in CI??!?" headaches.

If you want to step up your security game, you can add [Django Security Check](https://github.com/victoriadrake/django-security-check) as an Action too.

## Set up your Django project for success

Want to help keep your development team happy? Set them up for success with these best practices for Django development. Remember, an ounce of brainpower is worth a pound of software!
