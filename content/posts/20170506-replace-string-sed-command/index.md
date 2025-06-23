---
title: How to Replace a String with sed in Current and Recursive Subdirectories
date: 2017-05-06T20:04:53+08:00
lastmod: 2025-06-23T20:04:53+08:00
aliases:
    - /how-to-replace-a-string-with-sed-in-current-and-recursive-subdirectories/
    - /blog/how-to-replace-a-string-with-sed-in-current-and-recursive-subdirectories/
    - /posts/how-to-replace-a-string-in-a-dozen-old-blog-posts-with-one-sed-terminal-command/
    - /archive/how-to-replace-a-string-in-a-dozen-old-blog-posts-with-one-sed-terminal-command/
    - /verbose/replace-string-sed-command
    - /verbose/when-stackoverflow-sed-saves-30mins
    - /verbose/how-to-replace-a-string-in-a-dozen-old-blog-posts-with-one-sed-terminal-command
description: The power to update multiple files with a single command in your terminal.
tags:
    - development
 
draft: false
categories: ["article"]

wasfeatured:
    - where : url

---

I’ve probably run some variation of “find and replace across multiple files” thousands of times in my career. It’s one of those operations that seems straightforward until you’re staring at a codebase with 500,000 lines spread across 2,000 files, and you need to rename a function that’s used everywhere. Get it wrong, and you’re looking at hours of manual cleanup—or worse, subtle bugs that only surface in production.

Here's the approach I use, why some methods work better than others, and some tips that can save you from that sinking feeling when you realize you just broke prod.

## Current Directory Only

You can use sed by itself to make changes to files in the current directory, ignoring subdirectories.

```sh
.
├── index.html        # Change this file
└── blog
    ├── list.html     # Don't change
    └── single.html   # these files
```

To replace all occurrences of “foo” with “bar” in files within the current directory:

```sh
sed -i -- 's/foo/bar/g' *
```

Here’s what each component of the command does:

- `-i` will change the original, and stands for “in-place.”
- `s` is for substitute, so we can find and replace.
- `foo` is the string we’ll be taking away,
- `bar` is the string we’ll use instead today.
- `g` as in “global” means “all occurrences, please.”
- `*` denotes all file types. (No more rhymes. What a tease.)

You can limit the operation to one file type, such as Python files, by using a matching pattern:

```sh
sed -i -- 's/foo/bar/g' *.py
```

## The Performant Recursive Pattern

Here’s a performant command for making changes in the current directory and all subdirectories:

```bash
find . -type f -name "*.py" -exec sed -i 's/old_function_name/new_function_name/g' {} +
```

Let me break this down because each piece matters more than you might think:

- `find .` starts from the current directory
- `-type f` only matches files (not directories)
- `-name "*.py"` filters to Python files (adjust the pattern for your needs)
- `-exec sed -i 's/old/new/g' {} +` runs sed on batches of files

That `+` at the end instead of `\;` is crucial for performance. It batches multiple files into each sed call instead of spawning a new process for every single file. When you’re dealing with thousands of files, this can be the difference between a 5-second operation and a 5-minute one.

## The Safer Version I Actually Use

But in the real world, it might not be best to run that command as-is. Here's a more accidentally-had-decaf-proof version:

```bash
# First, see what we're dealing with
find . -type f -name "*.py" -exec grep -l "old_function_name" {} +

# Test on a single file first
find . -type f -name "*.py" -exec grep -l "old_function_name" {} + | head -1 | xargs sed -i.bak 's/old_function_name/new_function_name/g'

# If that looks good, run on everything
find . -type f -name "*.py" -exec sed -i.bak 's/old_function_name/new_function_name/g' {} +
```

That `.bak` extension creates backup files automatically. Yes, you should be using version control, but I’ve seen too many scenarios where someone needed to quickly revert a change and of course they hadn't started with a clean working tree. 

The backup files are easy to clean up later:

```bash
find . -name "*.bak" -delete
```

## When GNU sed vs BSD sed Actually Matters

Here’s something you run into when you switch from Linux to macOS: sed behaves differently. BSD sed (default on macOS) requires an argument to `-i`, even if it’s empty:

```bash
# Linux (GNU sed)
sed -i 's/old/new/g' file.txt

# macOS (BSD sed) - this breaks
sed -i 's/old/new/g' file.txt

# macOS (BSD sed) - this works
sed -i '' 's/old/new/g' file.txt
# or with backup
sed -i '.bak' 's/old/new/g' file.txt
```

You can also write portable versions:

```bash
# Portable approach
if sed --version 2>/dev/null | grep -q GNU; then
    find . -type f -name "*.py" -exec sed -i 's/old/new/g' {} +
else
    find . -type f -name "*.py" -exec sed -i '' 's/old/new/g' {} +
fi
```

Or use the backup approach everywhere since it works on both:

```bash
find . -type f -name "*.py" -exec sed -i.bak 's/old/new/g' {} +
```

## Handling Special Characters Without Losing Your Mind

When your search string contains slashes, quotes, or regex metacharacters, things get interesting.

Instead of fighting with escaping, change the delimiter:

```bash
# Instead of this nightmare
sed -i 's/https:\/\/old\.domain\.com\/api/https:\/\/new\.domain\.com\/api/g'

# Use this
sed -i 's|https://old.domain.com/api|https://new.domain.com/api|g'
```

You can use almost any character as the delimiter. I usually go with `|` for URLs and `#` for file paths or when I’m dealing with email addresses (it's easier to differentiate from a lowercase L).

For really complex patterns, sometimes it’s easier to put the sed script in a file:

```bash
# In replace.sed
s|https://old.domain.com/api|https://new.domain.com/api|g
s/DEBUG = True/DEBUG = False/g
s/old_secret_key/new_secret_key/g

# Use it
find . -type f -name "*.py" -exec sed -i.bak -f replace.sed {} +
```

This approach is also great for complex replacements that you’ll need to run multiple times or document for your team.

## Performance Considerations That Actually Matter

When you’re dealing with large codebases, performance starts to matter. Seemingly simple find-and-replace operations could take 20+ minutes on large repositories when done inefficiently.

The biggest performance killer is usually file selection. Don’t do this:

```bash
# Slow—processes every file then filters
find . -type f -exec grep -l "old_string" {} + | xargs sed -i 's/old/new/g'
```

Do this instead:

```bash
# Fast—filters files first
find . -type f -name "*.py" -exec sed -i 's/old/new/g' {} +
```

If you need to be more selective about which files to process, use multiple find conditions:

```bash
# Only process Python files that aren't in virtual environments or build directories
find . -type f -name "*.py" ! -path "./venv/*" ! -path "./build/*" ! -path "./.git/*" -exec sed -i.bak 's/old/new/g' {} +
```

## When sed Isn’t the Right Tool

It's tempting to force sed to do things it’s not great at. Here’s when I reach for other tools:

**For complex transformations**: Use a proper scripting language. A 50-line sed script could be 10 lines of Python and infinitely more readable.

**For structured data**: If you’re modifying JSON, YAML, or XML, use tools that understand the format. sed doesn’t know about string escaping or nested structures.

**For very large files**: sed loads the entire file into memory for each operation. For multi-gigabyte files, stream processing tools like awk might be better.

**For interactive replacements**: Use your editor’s project-wide search and replace, or tools like `rg` (ripgrep) with interactive replacement.

## The Nuclear Option: Parallel Processing

If you're dealing with truly massive codebases (millions of lines), you might need to get aggressive about performance:

```bash
# Find all target files first
find . -type f -name "*.py" ! -path "./venv/*" > /tmp/files_to_process

# Process them in parallel
cat /tmp/files_to_process | xargs -n 50 -P 8 sed -i.bak 's/old/new/g'
```

That `-P 8` runs up to 8 sed processes in parallel, and `-n 50` processes 50 files per batch. Adjust based on your CPU cores and I/O capacity.

## Testing Before You Commit

Here’s a thorough testing workflow for large replacements:

```bash
# 1. Count occurrences before
find . -type f -name "*.py" -exec grep -c "old_string" {} + | awk -F: '{sum+=$2} END {print sum}'

# 2. Run replacement with backups
find . -type f -name "*.py" -exec sed -i.bak 's/old_string/new_string/g' {} +

# 3. Count occurrences after (should be 0)
find . -type f -name "*.py" -exec grep -c "new_string" {} + | awk -F: '{sum+=$2} END {print sum}'

# 4. Spot check a few files
find . -name "*.bak" | head -5 | while read backup; do
    original="${backup%.bak}"
    echo "=== $original ==="
    diff "$backup" "$original"
done

# 5. Run tests
make test  # or whatever your test command is

# 6. If everything looks good, clean up backups
find . -name "*.bak" -delete
```

## Using sed in Real-World Scenarios

**API endpoint migration**: Moving from v1 to v2 API endpoints meant updating hundreds of URL references across multiple repositories. The key was being selective about file types and using exact matches to avoid accidentally changing documentation or comments that mentioned the old API.

**Database migrations**: After a database refactor for a Django application, sed came in handy for making changes to complex Django migration files. I used different sed patterns for different contexts—from Python to raw SQL—because the replacement patterns were slightly different in each case.

**Configuration key updates**: When our configuration format changed, I needed to update key names across config files, code references, and documentation. This one required multiple passes with different patterns because the same logical key appeared in different syntactic contexts.

## The Debugging Workflow That Saves Time

When a sed operation goes wrong (and it will), here’s how I debug:

1. **Check what files were actually modified**:

   ```bash
   find . -name "*.bak" -exec sh -c 'diff -q "$1" "${1%.bak}"' _ {} \; | head -10
   ```

2. **Look for unintended matches**:
   
   ```bash
   find . -name "*.bak" -exec sh -c 'diff "$1" "${1%.bak}"' _ {} \; | grep "^<" | sort | uniq -c | sort -nr
   ```

3. **Restore and try a more specific pattern**:
   
   ```bash
   find . -name "*.bak" -exec sh -c 'mv "$1" "${1%.bak}"' _ {} \;
   ```

The pattern of creating backups, testing the results, and having a quick rollback strategy will save you countless hours. It’s especially important when you’re working on shared codebases where a mistake affects your entire team.

While sed operations might seem like they're just for simple text processing, they can help with critical steps in deployments, migrations, and refactoring efforts that affect real systems and real users. Taking the time to do them safely and efficiently pays dividends when you’re not scrambling to fix broken builds or track down subtle bugs that only show up in production.

If you found some value in this post, there's more! I write about high-output development processes and building maintainable systems in the AI age. You can get my posts in your inbox by subscribing below.

{{< subscribe >}}
