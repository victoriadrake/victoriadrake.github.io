/* webmention.js - Simplified version for Study theme

Simple thing for embedding webmentions from webmention.io into a page, client-side.
(c)2018-2020 fluffy (http://beesbuzz.biz)
Modified for Study theme

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
  'use strict'

  // Only initialize if the webmentions container exists
  window.addEventListener('load', function () {
    const container = document.getElementById('webmentions')
    if (!container) {
      // No container, so do nothing
      return
    }

    // Function to get configuration from script tag
    function getCfg(key, dfl) {
      const scriptTag = document.querySelector('script[src*="webmention.js"]')
      return scriptTag ? (scriptTag.getAttribute('data-' + key) || dfl) : dfl
    }

    const refurl = getCfg('page-url', window.location.href.replace(/#.*$/, ''))
    const addurls = getCfg('add-urls', undefined)
    const maxWebmentions = getCfg('max-webmentions', 30)
    const mentionSource = getCfg('prevent-spoofing') ? 'wm-source' : 'url'
    const sortBy = getCfg('sort-by', 'published')
    const sortDir = getCfg('sort-dir', 'up')

    // Escape HTML entities
    function entities(text) {
      return text.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&quot;')
    }

    // Format the date
    function formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Strip the protocol off a URL
    function stripurl(url) {
      return url.substr(url.indexOf('//'))
    }

    // Deduplicate multiple mentions from the same source URL
    function dedupe(mentions) {
      const filtered = []
      const seen = {}

      mentions.forEach(function (r) {
        // Strip off the protocol (i.e. treat http and https the same)
        const source = stripurl(r.url)
        if (!seen[source]) {
          filtered.push(r)
          seen[source] = true
        }
      })

      return filtered
    }

    // Format webmentions as HTML
    function formatWebmentions(mentions) {
      if (mentions.length === 0) {
        return '<p>No webmentions yet.</p>'
      }

      let html = '<h2>Webmentions</h2><ul class="webmentions-list">'
      
      mentions.forEach(function (m) {
        html += '<li class="webmention-item">'
        
        // Author info
        html += '<div class="webmention-author">'
        if (m.author && m.author.photo) {
          html += '<img src="' + entities(m.author.photo) + '" alt="' + 
            (m.author.name ? entities(m.author.name) : 'Avatar') + '" class="webmention-author-img">'
        }
        
        html += '<div class="webmention-author-info">'
        if (m.author && m.author.name) {
          html += '<span class="webmention-author-name">' + entities(m.author.name) + '</span>'
        } else {
          html += '<span class="webmention-author-name">' + entities(m.url.split('/')[2]) + '</span>'
        }
        
        if (m.published) {
          html += '<span class="webmention-date">' + formatDate(m.published) + '</span>'
        }
        html += '</div></div>'
        
        // Content
        if (m.content && m.content.text) {
          html += '<div class="webmention-content">' + entities(m.content.text) + '</div>'
        }
        
        // Source link
        html += '<a href="' + m[mentionSource] + '" class="webmention-source">View source</a>'
        
        html += '</li>'
      })
      
      html += '</ul>'
      return html
    }

    // Fetch webmentions from API
    function fetchWebmentions() {
      const pages = [stripurl(refurl)]
      if (addurls) {
        addurls.split('|').forEach(function (url) {
          pages.push(stripurl(url))
        })
      }

      let apiURL = 'https://webmention.io/api/mentions.jf2?per-page=' + maxWebmentions + 
        '&sort-by=' + sortBy + '&sort-dir=' + sortDir

      pages.forEach(function (path) {
        apiURL += '&target[]=' + encodeURIComponent('http:' + path) +
          '&target[]=' + encodeURIComponent('https:' + path)
      })

      // Fetch data from API
      fetch(apiURL)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          if (data && data.children) {
            const mentions = dedupe(data.children)
            container.innerHTML = formatWebmentions(mentions)
          }
        })
        .catch(error => {
          console.error('Error fetching webmentions:', error)
          container.innerHTML = '<p>Error loading webmentions.</p>'
        })
    }

    // Start fetching webmentions
    fetchWebmentions()
  })
})()
