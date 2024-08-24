SHELL := /bin/bash
.POSIX:
.PHONY: help env install upgrade-hugo lint serve build start initial

help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

DATETIME:=$(shell date +%FT%T)
DAY:=$(shell date +%F)

draft: ## Create frontmatter for a new article draft
	mkdir blog/D-$(DAY)
	printf '%b\n' "---\ntitle: $(shell uuidgen) \ndate: $(DAY) \ncategories: [\"article\"] \ntags: \ndraft: true\n---\n\n" > blog/D-$(DAY)/index.md

a: ## Create file and frontmatter for a NEW=...
	@printf '%b\n' "---\ntitle: $(shell uuidgen)\ndate: $(DATETIME)\ncategories: [\"$(NEW)\"]\ntags: \n---\n\n" > neofeed/$(DATETIME).md
	touch neofeed/$(DATETIME).md

lint: ## Lint files
	pre-commit run --all-files
