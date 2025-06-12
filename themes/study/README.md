# Study Theme for Hugo

A cozy, text-based theme inspired by a mid-century study with leather chairs, rich woods, and green plants. This theme is designed to provide a comfortable reading experience for technically-inclined readers.

## Features

- **Text-focused design**: Prioritizes content readability with careful typography
- **Responsive layout**: Looks great on mobile, tablet, and desktop
- **Light and dark mode**: Automatically adapts to device settings
- **SEO friendly**: Includes all necessary meta tags for search engines and social media
- **IndieWeb compatible**: Uses Microformats2 markup
- **Search functionality**: Built-in search feature
- **Table of contents**: Automatically generated for posts with multiple headings
- **Related posts**: Shows related content based on tags
- **Webmentions support**: Integration with webmention.io
- **Category-specific tag colors**: Visual distinction between different content categories

## Installation

1. Clone this repository to your Hugo site's themes directory:
   ```
   git clone https://github.com/yourusername/study.git themes/study
   ```

2. Add the theme to your site's configuration:
   ```yaml
   theme: study
   ```

## Configuration

### Site Parameters

Add these parameters to your `config.yaml` or `hugo.yaml` file:

```yaml
params:
  description: "Your site description"
  author:
    name: "Your Name"
    image: "/images/profile.jpg"
  logo: "/images/logo.svg"
  social:
    - name: "GitHub"
      url: "https://github.com/yourusername"
      icon: "/icons/github.svg"
    - name: "Twitter"
      url: "https://twitter.com/yourusername"
      icon: "/icons/twitter.svg"
    - name: "Email"
      url: "mailto:your@email.com"
      icon: "/icons/email.svg"
  useToc: true  # Enable table of contents
  domain: "yourdomain.com"  # For webmentions
```

### Menus

Configure the navigation menu in your `config.yaml`:

```yaml
menu:
  main:
    - name: "Home"
      url: "/"
      weight: 1
    - name: "Blog"
      url: "/blog/"
      weight: 2
    - name: "About"
      url: "/about/"
      weight: 3
```

## Content Structure

The theme supports the following content types:

- **Posts**: Regular blog posts in `/content/posts/`
- **Pages**: Static pages like About in `/content/`

### Front Matter

Example front matter for posts:

```yaml
---
title: "Post Title"
date: 2025-01-01
description: "Optional description or subtitle"
tags: ["tag1", "tag2"]
image: "/images/featured-image.jpg"  # For social media cards
---
```

## Customization

### CSS Variables

The theme uses CSS variables for easy customization. You can override these in your own CSS file:

```css
:root {
  --primary-bg: #f8f5f0;
  --primary-text: #2a2118;
  --accent-1: #e86124;
  /* See styles.css for all variables */
}
```

### Tag Colors

Tag colors are defined in `tags.css`. You can customize the colors for specific tags by adding CSS rules:

```css
[href$='/tags/your-tag/'] {
  background-color: #yourcolor;
}
```

## Credits

- Created by [Your Name](https://yoursite.com)
- Inspired by [victoria.dev](https://victoria.dev)
- Uses [Lunr.js](https://lunrjs.com/) for search functionality

## License

This theme is released under the MIT License. See the [LICENSE](LICENSE) file for details.
