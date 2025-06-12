/**
 * Search functionality for Study theme
 * Uses lunr.js for client-side search
 */

console.log('Search.js loaded');
console.log('Lunr available:', typeof lunr !== 'undefined');
console.log('Store available:', typeof window.store !== 'undefined');

function displayResults(results, store) {
    const searchResults = document.getElementById('results');
    if (!searchResults) {
        console.error('Search results container is missing in the DOM');
        return;
    }
    
    if (results.length) {
        let resultList = '<ul class="post-list">';
        
        // Iterate and build result list elements
        for (const n in results) {
            const item = store[results[n].ref];
            // Parse JSON strings if they're still in string format
            const title = typeof item.title === 'string' ? JSON.parse(item.title) : item.title;
            const content = typeof item.content === 'string' ? JSON.parse(item.content) : item.content;
            const description = item.description ? 
                (typeof item.description === 'string' ? JSON.parse(item.description) : item.description) : '';
            
            resultList += '<li class="post-item h-entry">';
            resultList += '<h3 class="post-title">';
            resultList += '<a href="' + item.url + '" class="p-name u-url">' + title + '</a>';
            resultList += '</h3>';
            
            resultList += '<div class="post-summary p-summary">' + 
                (description || content.substring(0, 150) + '...') + 
                '</div>';
            
            // Add metadata
            resultList += '<div class="post-meta">';
            
            // Add date if available (using current date as fallback)
            const currentDate = new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            resultList += '<time class="post-date dt-published">' + currentDate + '</time>';
            
            // Add tags
            if (item.tags && item.tags.length > 0) {
                resultList += '<div class="post-tags">';
                const tag = typeof item.tags[0] === 'string' ? 
                    JSON.parse(item.tags[0]) : item.tags[0];
                resultList += '<a class="p-category tag" href="/tags/' + 
                    tag.toLowerCase() + '/">' + tag + '</a>';
                resultList += '</div>';
            }
            
            // Estimate reading time
            const wordCount = content.split(/\s+/).length;
            const readingTime = Math.max(1, Math.round(wordCount / 200)); // Assuming 200 words per minute
            resultList += '<span class="reading-time">' + readingTime + ' min read</span>';
            
            resultList += '</div>'; // End of meta
            resultList += '</li>';
        }
        
        resultList += '</ul>';
        searchResults.innerHTML = resultList;
    } else {
        searchResults.innerHTML = '<p class="no-results">No results found. Try a different search term.</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Get search results container
    const searchResults = document.getElementById('results');
    
    if (!searchResults) {
        return;
    }
    
    // Get the query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    
    // Get search input if it exists (it won't on the search results page)
    const searchInput = document.getElementById('search-input');
    
    // If there's a query, perform search
    if (query) {
        // If search input exists, fill it
        if (searchInput) {
            searchInput.value = query;
        }
        
        // Check if lunr and the search index are available
        if (typeof lunr !== 'undefined' && window.store) {
            const idx = lunr(function () {
                this.ref('id');
                this.field('title', {
                    boost: 15
                });
                this.field('tags');
                this.field('content', {
                    boost: 10
                });

                for (const key in window.store) {
                    this.add({
                        id: key,
                        title: window.store[key].title,
                        tags: window.store[key].category,
                        content: window.store[key].content
                    });
                }
            });

            // Perform the search
            const results = idx.search(query);
            // Update the list with results
            displayResults(results, window.store);
        } else {
            searchResults.innerHTML = '<p class="error">Search functionality is not fully loaded. Please try again later.</p>';
        }
    } else if (searchResults.querySelector('.search-instructions') === null) {
        // Only update if there's no instruction message already
        searchResults.innerHTML = '<p class="search-instructions">Use the search box in the navigation bar to search for content.</p>';
    }
    
    // Add event listener to search input if it exists
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 2 && typeof lunr !== 'undefined' && window.store) {
                // Create a new URL with the updated query parameter
                const url = new URL(window.location);
                url.searchParams.set('query', query);
                
                // Update the browser history without reloading the page
                window.history.replaceState({}, '', url);
                
                const idx = lunr(function () {
                    this.ref('id');
                    this.field('title', {
                        boost: 15
                    });
                    this.field('tags');
                    this.field('content', {
                        boost: 10
                    });

                    for (const key in window.store) {
                        this.add({
                            id: key,
                            title: window.store[key].title,
                            tags: window.store[key].category,
                            content: window.store[key].content
                        });
                    }
                });

                // Perform the search
                const results = idx.search(query);
                // Update the list with results
                displayResults(results, window.store);
            } else if (query.length <= 2) {
                searchResults.innerHTML = '<p class="search-instructions">Please enter at least 3 characters to search.</p>';
            }
        });
    }
});
