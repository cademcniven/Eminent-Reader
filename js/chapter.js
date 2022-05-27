const urlSegments = window.location.pathname.split('/')
const currentChapter = parseInt(urlSegments.pop() || urlSegments.pop()) // handle potential trailing slash
const baseUrl = urlSegments.join('/')

// TODO: side effects while loading are a bad practice
if (currentChapter > 1) {
  document.getElementsByClassName('chapterBack')[0].href = baseUrl + '/' + (currentChapter - 1)
}

fetch(baseUrl + '/' + (currentChapter + 1)).then(response => {
  if (response.status === 200) {
    document.getElementsByClassName('chapterForward')[0].href = baseUrl + '/' + (currentChapter + 1)
  }
})
