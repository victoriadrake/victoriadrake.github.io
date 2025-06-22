---
title: How to replace a string with sed in current and recursive subdirectories
date: 2017-05-06T20:04:53+08:00
lastmod: 2020-11-22T20:04:53+08:00
aliases:
    - /blog/how-to-replace-a-string-with-sed-in-current-and-recursive-subdirectories/
    - /posts/how-to-replace-a-string-in-a-dozen-old-blog-posts-with-one-sed-terminal-command/
    - /archive/how-to-replace-a-string-in-a-dozen-old-blog-posts-with-one-sed-terminal-command/
    - /verbose/replace-string-sed-command
    - /verbose/when-stackoverflow-sed-saves-30mins
    - /verbose/how-to-replace-a-string-in-a-dozen-old-blog-posts-with-one-sed-terminal-command
description: The power to update multiple files with a single command in your terminal.
tags:
    
image: cover_sed.png
 
draft: false
categories: ["article"]

wasfeatured:
    - where : url

---

If you want to save time and money, efficiency and automation are paramount. The ability to quickly and accurately modify codebases, configuration files, or documentation across an entire project is a critical skill that scales with team size and project complexity. This is where `sed`, the stream editor, becomes an indispensable tool in your terminal arsenal.

While often underutilized, `sed` offers powerful capabilities for finding and replacing strings in files, making it a cornerstone for tasks ranging from simple text manipulation to large-scale refactoring and infrastructure automation.

## Strategic String Replacement with `sed`

When approaching string replacement, consider the scope of your operation:

-   **Non-recursive:** Targeting files exclusively within the current directory.
-   **Recursive:** Extending the operation to include all subdirectories, ensuring comprehensive changes across a project.

Let's explore the practical applications and underlying mechanics.

## Current directory, non-recursive

For localized changes, `sed` operates directly on files in the current directory, ignoring subdirectories.

```text
.
├── index.html        # Change this file
└── blog
    ├── list.html     # Don't change
    └── single.html   # these files
```

To replace all occurrences of "foo" with "bar" in files within the current directory:

```sh
sed -i -- 's/foo/bar/g' *
```

Here's what each component of the command does:

- `-i` will change the original, and stands for "in-place."
- `s` is for substitute, so we can find and replace.
- `foo` is the string we'll be taking away,
- `bar` is the string we'll use instead today.
- `g` as in "global" means "all occurrences, please."
- `*` denotes all file types. (No more rhymes. What a tease.)

You can limit the operation to one file type, such as `txt`, by using a matching pattern:

```sh
sed -i -- 's/foo/bar/g' *.txt
```

## Current directory and subdirectories, recursive

For comprehensive, project-wide changes, combine `sed` with `find`. This extends the operation to all files within the current directory and its subdirectories, including hidden files.

```sh
find . -type f -exec sed -i 's/foo/bar/g' {} +
```

To exclude hidden files (e.g., `.git` directories or dotfiles), use the `-not -path` modifier:

```sh
find . -type f -not -path '*/\.*' -exec sed -i 's/foo/bar/g' {} +
```

This command excludes any file whose path contains `/.`.

To limit the operation to specific file extensions, such as Markdown files:

```sh
find . -type f -name "*.md" -exec sed -i 's/foo/bar/g' {} +
```

## Advanced `sed` Techniques and Best Practices

Beyond basic string replacement, `sed` offers advanced capabilities crucial for robust automation.

### Replacing URLs: Changing the Separator

When dealing with strings containing `/` (like URLs), escaping each slash can quickly become unreadable and error-prone:

```sh
find . -type f -exec sed -i \
's/https:\/\/www.oldurl.com\/blog/https:\/\/www.newurl.com\/blog/g' {} +
```

A best practice is to change the separator character. `sed` allows any character immediately following `s` to be the separator. Using a non-conflicting character like `,` or `_` significantly improves readability:

```sh
find . -type f -exec sed -i \
's_https://www.oldurl.com/blog_https://www.newurl.com/blog_g' {} +
```

### Regular Expressions and Capture Groups

`sed` supports full regular expressions, enabling complex pattern matching and manipulation using capture groups. This is invaluable for structured data transformations.

Example: Swapping `firstName, lastName` to `lastName, firstName`

```sh
echo "John, Doe" | sed 's/\(.*\), \(.*\)/\2, \1/'
# Output: Doe, John
```

Here, `\(.*\)` captures content into groups `\1` and `\2`, which are then reordered.

### Multi-line Replacements

While `sed` is primarily line-oriented, it can handle multi-line patterns using techniques like reading the next line (`N`) or branching. For complex multi-line operations, however, `awk` or scripting languages like Python might be more suitable.

### Idempotency and Safety

When automating changes across a codebase, ensuring idempotency (running the command multiple times yields the same result as running it once) and safety is critical.

*   **Test First:** Always test `sed` commands on a small, non-critical subset of files or in a temporary environment before applying them broadly.
*   **Version Control:** Never run `sed -i` without a clean version control state. Commit your changes before and after the `sed` operation to easily revert if unintended consequences occur.
*   **Backup:** For critical operations, create explicit backups of files before modification.
*   **Review Diffs:** After running a `sed` command, always review the generated diffs (`git diff`) to ensure only intended changes were made.

## `sed` in a Leadership Context

Mastering tools like `sed` isn't just about personal productivity; it's about enabling team efficiency and maintaining system health at scale.

*   **Automated Refactoring:** `sed` can be integrated into scripts for large-scale code refactoring, ensuring consistency across a sprawling codebase.
*   **CI/CD Pipelines:** Use `sed` to dynamically update configuration files, version numbers, or environment-specific variables within automated deployment pipelines.
*   **Infrastructure as Code:** Automate modifications to configuration files for servers, containers, or cloud resources, ensuring consistency and reducing manual errors.
*   **Knowledge Sharing:** Encourage your team to learn and utilize such powerful command-line tools. A team proficient in automation tools is a more productive and resilient team.

## The most important part

The ability to efficiently manipulate text and code across a project is underrated skill that can save time and money. `sed` is a powerful, versatile tool that, when used judiciously and with an understanding of its implications, can significantly enhance productivity, facilitate large-scale changes, and contribute to the overall maintainability and reliability of software systems. As a leader, advocating for and demonstrating proficiency in foundational tools sets a high standard for technical excellence and operational efficiency within your team.

If you found some value in this post, there's more! I write about high-output development processes and building maintainable systems in the AI age. You can get my posts in your inbox by subscribing below.

{{< subscribe >}}
