SHELL := /bin/bash
.POSIX:
.PHONY: help env install upgrade-hugo serve build start initial

help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

env:
	pip3 install pipenv

shell: ## Enter the virtual environment
	pipenv shell

install: ## Install or update dependencies
	pipenv install --dev
	npm install
	npm install -g markdownlint-cli
	pre-commit install --install-hooks

HUGO_VERSION:=$(shell curl -s https://api.github.com/repos/gohugoio/hugo/releases/latest | grep 'tag_name' | cut -d '"' -f 4 | cut -c 2-)

upgrade-hugo: ## Get the latest Hugo
	mkdir tmp/ && \
	cd tmp/ && \
	curl -sSL https://github.com/gohugoio/hugo/releases/download/v$(HUGO_VERSION)/hugo_extended_$(HUGO_VERSION)_Linux-64bit.tar.gz | tar -xvzf- && \
	sudo mv hugo /usr/local/bin/ && \
	cd .. && \
	rm -rf tmp/
	hugo version

serve: ## Run the local development server
	hugo serve --enableGitInfo --disableFastRender --environment development

future: ## Run the local development server in the future
	hugo serve --enableGitInfo --buildFuture --disableFastRender --environment development

build: ## Lock dependencies and build site
	pipenv lock
	hugo --minify --cleanDestination

start: upgrade-hugo serve ## Update Hugo and start development server

initial: env install upgrade-hugo serve ## Install tools and start development server
