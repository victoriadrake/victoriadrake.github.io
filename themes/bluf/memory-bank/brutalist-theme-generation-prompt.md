# Hugo Theme Generation Prompt: Modern Brutalist Blog

This prompt creates a Hugo theme that prioritizes bold typography, functional brutalism, and exceptional performance.

## Core Requirements

Create a complete Hugo theme for a personal blog/portfolio site with the following specifications:

### Technical Foundation
- **Static Site Generator**: Hugo (v0.84.0+)
- **CSS**: Vanilla CSS with CSS variables, no frameworks
- **JavaScript**: Minimal vanilla JS, progressive enhancement
- **Fonts**: Google Fonts integration (Inter, Source Serif 4, JetBrains Mono)
- **Performance**: Lighthouse score 95+ on all metrics
- **Responsive**: Mobile-first, works from 320px to 4K
- **Browser Support**: Modern browsers + Safari iOS
- **IndieWeb Compatible**: Microformats2 markup

### Content Structure
- **Post Types**: Blog posts with tags (not categories)
- **Frontmatter**: Support for `title`, `date`, `tags[]`, `summary`, `featured`, `keyPoints[]`
- **Sections**: Homepage, Posts list, Individual posts, Search page
- **Navigation**: Fixed header with progress indicator on posts
- **Footer**: Author info, social links, copyright

### Key Features

#### 1. Homepage
- Brutalist grid layout with posts as rectangular blocks
- Most recent post displayed larger (2x size)
- Featured posts highlighted with subtle indicator
- Maximum 6 posts shown, link to full posts page
- Animated entrance effects (fade in + scale)

#### 2. Posts List Page
- Same brutalist grid layout
- Tag-based filtering with button UI
- "Load More" functionality (not pagination)
- Show/hide posts client-side with counts
- Posts display: number, first tag, title, date, reading time

#### 3. Individual Post Page
- Typography-focused layout
- Optional table of contents (sticky sidebar on desktop)
- Tag display with icon mapping
- Previous/Next post navigation (brutalist blocks)
- Related posts section (3 posts based on tags)
- Reading progress bar
- Key points or sections navigation

#### 4. Search Functionality
- Client-side search using Lunr.js
- Dedicated search page
- Real-time filtering as user types
- Highlight matching terms
- Results in same grid style as posts

### Interactive Elements
- **Hover States**: All interactive elements scale/invert
- **Tag Colors**: Different accent colors per tag type
- **Progress Indicators**: Reading progress bar
- **Smooth Scrolling**: For anchor links
- **Mobile Menu**: None - always visible navigation

## Design Aesthetic

### Visual Language: Brutalist Minimalism

#### Typography Hierarchy
```
Headings: Inter Black 900 - Massive, compressed, dramatic
Body: Source Serif 4 - Classic, readable, elegant  
Code: JetBrains Mono - Technical, precise
Scale: Extreme contrasts (6rem → 1rem)
```

#### Color Palette
```
Primary: Pure black (#000000) and white (#FFFFFF)
Grays: Minimal range (#F4F4F4, #E5E5E5, #A0A0A0, #666666)
Accents: Single bright color per content type
- Technical: Cyan (#00D4FF)
- Leadership: Pink (#FF0066) 
- Career: Green (#00FF88)
Responsive: Light and dark mode with media queries
```

#### Layout Principles
- **Grid System**: Strict rectangular blocks with -2px margin overlap
- **Borders**: Heavy 2-4px black borders, 8px for major sections
- **Spacing**: Generous whitespace, mathematical ratios
- **Animations**: Subtle scale transforms, no rotation/skew
- **Shadows**: Only on hover, stark black offsets

#### Brutalist Elements
- Raw, undecorated form follows function
- Thick borders instead of subtle shadows  
- Monospace numbers and metadata
- All caps for labels and categories
- Stark contrast, no gradients
- Geometric shapes only
- Typography as primary design element

### Component Patterns

#### Grid Posts
```
┌─────────────────────────┐
│ 001          TECHNICAL  │ (metadata bar)
│                         │
│ Post Title Goes Here    │ (Inter 900)
│ In Large Bold Type      │
│                         │
│ January 2024    5 min   │ (bottom meta)
└─────────────────────────┘
```

#### Hover State
- Background inverts to black
- Text inverts to white
- Colored bottom border appears (6px)
- Subtle scale transform (1.02)
- Z-index elevation with shadow

#### Mobile Adaptations
- Single column grid
- Reduced type sizes but maintain hierarchy
- Full-width code blocks
- Stack navigation elements
- Maintain border weights

### Philosophical Approach
1. **Content First**: Design serves readability
2. **Honest Materials**: Show the structure, hide nothing
3. **Functional Beauty**: Every element has purpose
4. **Digital Brutalism**: Embrace the medium's constraints
5. **Anti-Trend**: Timeless over fashionable

## Implementation Notes

### File Structure
```
themes/bluf/
├── archetypes
│   └── default.md
├── assets
│   ├── css
│   │   └── main.css
│   └── js
│       ├── lunr.min.js
│       └── main.js
├── layouts
│   ├── _default
│   │   ├── baseof.html
│   │   ├── list.html
│   │   ├── page.html
│   │   ├── search.html
│   │   └── single.html
│   ├── index.html
│   ├── partials
│   │   ├── extra_head.html
│   │   ├── footer.html
│   │   ├── header.html
│   │   ├── head.html
│   │   ├── search.html
│   │   └── search-index.html
│   ├── shortcodes
│   │   ├── img.html
│   │   ├── md.html
│   │   └── readfile.html
│   └── taxonomy
│       ├── list.html
│       └── term.html
├── memory-bank
│   └── brutalist-theme-generation-prompt.md
├── README.md
├── static
│   ├── icons
│   └── social
└── theme.toml
```

### Performance Optimizations
- Minify CSS/JS in production
- Lazy load images
- Preconnect to font servers
- Use CSS containment
- Minimize reflows/repaints

### Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast AAA compliant

### SEO Considerations
- Meta descriptions
- Open Graph tags
- JSON-LD structured data
- XML sitemap
- RSS feed

## Success Metrics
- Page load under 1 second
- Time to interactive under 2 seconds  
- Zero layout shift
- 100% keyboard navigable
- Works without JavaScript
- Prints beautifully
