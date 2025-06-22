// Progress bar
if (document.getElementById('progress')) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / height) * 100;
        document.getElementById('progress').style.width = progress + '%';
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 90;
            const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Table of contents active state
const observeToc = () => {
    const toc = document.querySelector('.toc');
    if (!toc) return;
    
    const headings = document.querySelectorAll('.article h2');
    const tocLinks = document.querySelectorAll('.toc a');
    
    if (headings.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -75% 0px',
        threshold: 0.1
    };
    
    let currentActive = null;
    
    const observer = new IntersectionObserver((entries) => {
        let visibleHeadings = [];
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                visibleHeadings.push({
                    element: entry.target,
                    ratio: entry.intersectionRatio,
                    top: entry.boundingClientRect.top
                });
            }
        });
        
        // Sort by position on screen
        visibleHeadings.sort((a, b) => a.top - b.top);
        
        if (visibleHeadings.length > 0) {
            // Use the first visible heading
            const activeHeading = visibleHeadings[0].element;
            const id = activeHeading.getAttribute('id');
            
            if (currentActive !== id) {
                currentActive = id;
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        }
    }, observerOptions);
    
    headings.forEach(heading => {
        if (heading.getAttribute('id')) {
            observer.observe(heading);
        }
    });
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', observeToc);

// Add copy button to code blocks
document.addEventListener('DOMContentLoaded', () => {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        button.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            padding: 0.25rem 0.5rem;
            font-family: 'Inter', sans-serif;
            font-size: 0.75rem;
            font-weight: 600;
            background: transparent;
            color: var(--white);
            border: 1px solid var(--gray-200);
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        
        block.style.position = 'relative';
        block.appendChild(button);
        
        block.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
        });
        
        block.addEventListener('mouseleave', () => {
            button.style.opacity = '0';
        });
        
        button.addEventListener('click', async () => {
            const code = block.querySelector('code').textContent;
            await navigator.clipboard.writeText(code);
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        });
    });
});

// Detect code blocks that might need horizontal scrolling
document.addEventListener('DOMContentLoaded', function() {
    // Only on mobile
    if (window.innerWidth <= 640) {
        const codeBlocks = document.querySelectorAll('pre');
        
        codeBlocks.forEach(block => {
            const code = block.querySelector('code');
            if (!code) return;
            
            // Check if any line is particularly long
            const lines = code.textContent.split('\n');
            let hasLongLines = false;
            
            lines.forEach(line => {
                // If a line has more than 60 characters without spaces, it might need scrolling
                const longestWord = line.split(' ').reduce((a, b) => a.length > b.length ? a : b, '');
                if (longestWord.length > 60) {
                    hasLongLines = true;
                }
            });
            
            // Add class for blocks that should scroll horizontally
            if (hasLongLines) {
                block.classList.add('has-scroll');
            }
        });
    }
});

// Optional: Add visual scroll indicators
document.addEventListener('DOMContentLoaded', function() {
    const scrollableElements = document.querySelectorAll('pre.has-scroll');
    
    scrollableElements.forEach(elem => {
        elem.addEventListener('scroll', function() {
            const maxScroll = this.scrollWidth - this.clientWidth;
            const currentScroll = this.scrollLeft;
            
            if (currentScroll > 0) {
                this.classList.add('scrolled-left');
            } else {
                this.classList.remove('scrolled-left');
            }
            
            if (currentScroll < maxScroll - 5) {
                this.classList.add('can-scroll-right');
            } else {
                this.classList.remove('can-scroll-right');
            }
        });
        
        // Initial check
        elem.dispatchEvent(new Event('scroll'));
    });
});

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchToggle = document.getElementById('search-toggle');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchToggle || !searchContainer || !searchInput || !searchResults) return;
    
    let searchIndex;
    let searchData = window.store || {};
    
    // Initialize Lunr.js index
    const initializeSearch = () => {
        if (typeof lunr === 'undefined') {
            console.warn('Lunr.js not loaded, search functionality disabled');
            return;
        }
        
        searchIndex = lunr(function() {
            this.field('title', { boost: 10 });
            this.field('content');
            this.field('tags', { boost: 5 });
            this.ref('id');
            
            Object.keys(searchData).forEach(key => {
                this.add({
                    id: key,
                    title: searchData[key].title,
                    content: searchData[key].content,
                    tags: searchData[key].tags ? searchData[key].tags.join(' ') : ''
                });
            });
        });
    };
    
    // Toggle search box
    const toggleSearch = () => {
        const isActive = searchContainer.classList.contains('active');
        
        if (isActive) {
            closeSearch();
        } else {
            openSearch();
        }
    };
    
    const openSearch = () => {
        searchContainer.classList.add('active');
        searchInput.focus();
        document.body.style.overflow = 'hidden';
    };
    
    const closeSearch = () => {
        searchContainer.classList.remove('active');
        searchResults.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
        document.body.style.overflow = '';
    };
    
    // Perform search
    const performSearch = (query) => {
        if (!searchIndex || query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }
        
        try {
            const results = searchIndex.search(query + '*');
            displayResults(results, query);
        } catch (e) {
            console.warn('Search error:', e);
            searchResults.classList.remove('active');
        }
    };
    
    // Clean and decode text content
    const cleanText = (text) => {
        if (!text) return '';
        
        // Remove quotes that wrap the entire string
        let cleaned = text.toString().replace(/^["']|["']$/g, '');
        
        // Decode HTML entities
        const txt = document.createElement('textarea');
        txt.innerHTML = cleaned;
        cleaned = txt.value;
        
        // Handle unicode escapes
        cleaned = cleaned.replace(/\\u[\dA-F]{4}/gi, (match) => {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
        
        // Handle common escaped characters
        cleaned = cleaned.replace(/\\"/g, '"')
                        .replace(/\\'/g, "'")
                        .replace(/\\n/g, ' ')
                        .replace(/\\t/g, ' ')
                        .replace(/\\\\/g, '\\');
        
        return cleaned;
    };
    
    // Display search results
    const displayResults = (results, query) => {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
            searchResults.classList.add('active');
            return;
        }
        
        results.slice(0, 10).forEach(result => {
            const item = searchData[result.ref];
            if (!item) return;
            
            const resultElement = document.createElement('a');
            resultElement.className = 'search-result-item';
            resultElement.href = item.url;
            
            // Clean and decode the content
            const cleanTitle = cleanText(item.title);
            const cleanContent = cleanText(item.content);
            
            // Highlight search terms
            const highlightedTitle = highlightText(cleanTitle, query);
            const highlightedExcerpt = highlightText(
                cleanContent.substring(0, 150) + '...', 
                query
            );
            
            // Format tags nicely
            let tagsHtml = '<span>Article</span>';
            if (item.tags && item.tags.length > 0) {
                const cleanTags = item.tags.map(tag => cleanText(tag));
                const tagElements = cleanTags.slice(0, 3).map(tag => 
                    `<span class="search-tag">${tag}</span>`
                ).join('');
                tagsHtml = tagElements;
            }
            
            resultElement.innerHTML = `
                <div class="search-result-title">${highlightedTitle}</div>
                <div class="search-result-excerpt">${highlightedExcerpt}</div>
                <div class="search-result-meta">
                    ${tagsHtml}
                </div>
            `;
            
            searchResults.appendChild(resultElement);
        });
        
        searchResults.classList.add('active');
    };
    
    // Highlight search terms in text
    const highlightText = (text, query) => {
        if (!query || query.length < 2) return text;
        
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    };
    
    // Escape regex special characters
    const escapeRegex = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };
    
    // Event listeners
    searchToggle.addEventListener('click', toggleSearch);
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        performSearch(query);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchContainer.classList.contains('active')) {
            closeSearch();
        }
        
        // Cmd/Ctrl + K to open search
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (!searchContainer.classList.contains('active')) {
                openSearch();
            }
        }
    });
    
    // Click outside to close
    document.addEventListener('click', (e) => {
        if (searchContainer.classList.contains('active') && 
            !searchContainer.contains(e.target) && 
            !searchToggle.contains(e.target)) {
            closeSearch();
        }
    });
    
    // Initialize search (Lunr.js should be loaded locally)
    initializeSearch();
});

// Subscribe Modal Functions
function openSubscribeModal() {
    const modal = document.getElementById('subscribe-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSubscribeModal() {
    const modal = document.getElementById('subscribe-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Subscribe modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('subscribe-modal');
    
    if (modal) {
        // Close modal when clicking outside of it
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSubscribeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeSubscribeModal();
            }
        });
    }
});
