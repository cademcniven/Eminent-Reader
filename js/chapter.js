let urlSegments = window.location.pathname.split("/")
let currentChapter = parseInt(urlSegments.pop() || urlSegments.pop()) //handle potential trailing slash
let baseUrl = urlSegments.join('/')
let novelCode = urlSegments.pop()

if (currentChapter > 1)
    document.getElementsByClassName("chapterBack")[0].href = baseUrl + '/' + (currentChapter - 1)

fetch(baseUrl + '/' + (currentChapter + 1)).then(response => {
    if (response.status === 200)
        document.getElementsByClassName("chapterForward")[0].href = baseUrl + '/' + (currentChapter + 1)
})