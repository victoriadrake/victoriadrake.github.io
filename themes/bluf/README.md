# BLUF Hugo Theme

A brutalist typography-driven Hugo theme.

## Features

- ✅ Bold typography with Inter Black 900 and Source Serif 4
- ✅ Reading progress indicator
- ✅ Smooth scrolling navigation
- ✅ Mobile responsive
- ✅ Code syntax highlighting
- ✅ Table of contents with active states
- ✅ Fast loading
- ✅ SEO friendly

## Installation

1. Add the theme to your Hugo site:
   ```bash
   cd your-hugo-site
   git submodule add [THEME URL] themes/bluf
   ```

2. Update your `config.toml`:
   ```toml
   theme = "bluf"
   ```

3. Copy the example config from `themes/bluf/exampleSite-config.toml`

## Content Front Matter

### Post Frontmatter
```yaml
---
title: "Your Post Title"
date: 2024-01-15
summary: "A compelling summary"
keyPoints:
  - "First key insight"
  - "Second key point"
  - "Third takeaway"
---
```

## Customization

Edit CSS variables in `assets/css/main.css` to customize colors.

## License

MIT License
