/**
 * Search functionality for Study theme
 * Uses lunr.js for client-side search
 */

function displayResults(results, store) {
    const searchResults = document.getElementById('results');
    if (!searchResults) {
        console.error('Search results container is missing in the DOM');
        return;
    }
    
    if (results.length) {
        let resultList = '<ul class="search-results-list">';
        
        // Iterate and build result list elements
        for (const n in results) {
            const item = store[results[n].ref];
            resultList += '<li class="search-result-item">';
            resultList += '<a href="' + item.url + '" class="search-result-link">';
            
            resultList += '<div class="search-result-content">';
            resultList += '<h3 class="search-result-title">' + item.title + '</h3>';
            resultList += '<p class="search-result-summary">' + 
                (item.description || item.content.substring(0, 150) + '...') + 
                '</p>';
            
            // Add metadata (tags, reading time)
            resultList += '<div class="search-result-meta">';
            if (item.tags && item.tags.length > 0) {
                resultList += '<a class="tag" href="/tags/' + 
                    item.tags[0].toLowerCase() + '/">' + 
                    item.tags[0].toLowerCase() + '</a>';
            }
            
            // Estimate reading time (rough approximation)
            const wordCount = item.content.split(/\s+/).length;
            const readingTime = Math.max(1, Math.round(wordCount / 200)); // Assuming 200 words per minute
            resultList += '<span class="reading-time">' + readingTime + ' min read</span>';
            resultList += '</div>'; // End of meta
            
            resultList += '</div>'; // End of content
            resultList += '</a>';
            resultList += '</li>';
        }
        
        resultList += '</ul>';
        searchResults.innerHTML = resultList;
    } else {
        searchResults.innerHTML = '<p class="no-results">No results found. Try a different search term.</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize search on the search page
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('results');
    
    if (!searchInput || !searchResults) {
        return;
    }
    
    // Get the query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    
    // If there's a query, fill the search input and perform search
    if (query) {
        searchInput.value = query;
        
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
    } else {
        searchResults.innerHTML = '<p class="search-instructions">Enter a search term above to find content on this site.</p>';
    }
    
    // Listen for input changes for real-time search (optional)
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
});
