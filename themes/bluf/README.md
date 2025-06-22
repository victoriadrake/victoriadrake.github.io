# Victoria Hugo Theme

A modern, typography-driven Hugo theme inspired by victoria.dev.

## Features

- ✅ Bold typography with Inter Black 900 and Source Serif 4
- ✅ Reading progress indicator
- ✅ Smooth scrolling navigation
- ✅ Category-based styling (Leadership, Technical, Career)
- ✅ Mobile responsive
- ✅ Code syntax highlighting
- ✅ Table of contents with active states
- ✅ Fast loading
- ✅ SEO friendly

## Installation

1. Add the theme to your Hugo site:
   ```bash
   cd your-hugo-site
   git submodule add https://github.com/yourusername/victoria-theme themes/victoria
   ```

2. Update your `config.toml`:
   ```toml
   theme = "victoria"
   ```

3. Copy the example config from `themes/victoria/exampleSite-config.toml`

## Content Front Matter

### Basic Post
```yaml
---
title: "Your Post Title"
date: 2024-01-15
category: "Technical" # or "Leadership" or "Career"
readingTime: 8
summary: "A compelling summary"
keyPoints:
  - "First key insight"
  - "Second key point"
  - "Third takeaway"
---
```

### Leadership Post with Sections
```yaml
---
title: "Leadership Post"
category: "Leadership"
sections:
  - title: "First Section"
  - title: "Second Section"
  - title: "Third Section"
---
```

## Customization

Edit CSS variables in `assets/css/main.css` to customize colors:

```css
:root {
    --accent-leadership: #FF0066;
    --accent-technical: #00D4FF;
    --accent-career: #00FF88;
}
```

## License

MIT License
