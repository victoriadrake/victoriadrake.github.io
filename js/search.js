function displayResults (results, store) {
  const searchResults = document.getElementById('article-list')

  if (results.length) {
    let resultList = ''
    for (const n in results) {
      const item = store[results[n].ref]
      resultList += '<li role="none"><a role="menuitem" class="article-link" href="' + item.url + '">' + item.title + '</a>'
      resultList += '<p>' + item.content.substring(0, 150) + '...</p><p class="metadata">'
      const tagList = item.tags
      tagList.forEach(tag => {
        if (tag !== '') {
          resultList += '<a class="tag button" href="/tags/' + tag + '/">' + tag + '</a>'
        }
      })
      resultList += '</p></li>'
    }

    searchResults.innerHTML = resultList
  } else {
    document.getElementById('all-tags').classList.remove('hidden')
    searchResults.innerHTML = '<h2>¯\\_ (ツ)_/¯</h2><p>Looks like I haven\'t written about that yet! Why not <a href="/contact">ask me to?</a></p>'
  }
}

const params = new URLSearchParams(window.location.search)
const query = params.get('q')

if (query) {
  // Retain the search input in the form when displaying results
  document.getElementById('search-input').setAttribute('value', query)

  const idx = lunr(function () {
    this.ref('id')
    this.field('title', {
      boost: 15
    })
    this.field('tags')
    this.field('content', {
      boost: 10
    })

    for (const key in window.store) {
      this.add({
        id: key,
        title: window.store[key].title,
        tags: window.store[key].category,
        content: window.store[key].content
      })
    }
  })

  const results = idx.search(query)
  displayResults(results, window.store)
}