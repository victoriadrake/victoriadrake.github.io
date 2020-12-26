(function () {
  function displaySearchResults (results, store) {
    var searchResults = document.getElementById('article-list')

    if (results.length) {
      var resultList = ''

      for (var i in results) {
        var item = store[results[i].ref]
        resultList += '<li role="none"><a role="menuitem" class="article-link" href="' + item.url + '">' + item.title + '</a>'
        resultList += '<p>' + item.content.substring(0, 150) + '...</p><p class="metadata">'
        console.log(item.tags.split('|'))
        var tagList = item.tags.split('|')
        for (var n in tagList) {
          if (tagList[n] !== '') {
            resultList += '<a class="tag button" href="/tags/' + tagList[n] + '/">' + tagList[n] + '</a>'
          }
        }
        resultList += '</p></li>'
      }

      searchResults.innerHTML = resultList
    } else {
      document.getElementById('all-tags').classList.remove('hidden')
      searchResults.innerHTML = '<h2>¯\\_ (ツ)_/¯</h2><p>Looks like I haven\'t written about that yet! Why not <a href="/contact">ask me to?</a></p>'
    }
  }

  function getQueryVariable (variable) {
    var query = window.location.search.substring(1)
    var vars = query.split('&')
    console.log(vars)

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'))
      }
    }
  }

  var searchTerm = getQueryVariable('query')

  if (searchTerm) {
    document.getElementById('search-box').setAttribute('value', searchTerm)
    document.getElementById('article-list').innerHTML = '<p>Searching...</p>'

    var idx = lunr(function () {
      this.field('id')
      this.field('title', {
        boost: 15
      })
      this.field('tags')
      this.field('content', {
        boost: 10
      })

      for (var key in window.store) { // Add the data to lunr
        this.add({
          id: key,
          title: window.store[key].title,
          tags: window.store[key].category,
          content: window.store[key].content
        })
      }
    })
    var results = idx.search(searchTerm)
    displaySearchResults(results, window.store)
  }
})()