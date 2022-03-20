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

function UpdateScrollbar() {
    let scrollTop = window.scrollY
    let docHeight = document.body.offsetHeight
    let winHeight = window.innerHeight
    let scrollPercent = scrollTop / (docHeight - winHeight)
    let scrollPercentRounded = Math.round(scrollPercent * 100)

    document.querySelector("footer").style.background =
        `linear-gradient(to right, #498 ${scrollPercentRounded}%, #fff ${scrollPercentRounded}%)`
}