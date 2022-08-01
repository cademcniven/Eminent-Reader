const urlSegments = window.location.pathname.split('/')
const currentChapter = parseInt(urlSegments.pop() || urlSegments.pop()) // handle potential trailing slash
const baseUrl = urlSegments.join('/')

if (currentChapter > 1) {
  document.getElementsByClassName('chapterBack')[0].href = baseUrl + '/' + (currentChapter - 1)
}

fetch(baseUrl + '/' + (currentChapter + 1)).then(response => {
  if (response.status === 200) {
    document.getElementsByClassName('chapterForward')[0].href = baseUrl + '/' + (currentChapter + 1)
  }
})

let chapterHeader = document.getElementsByClassName("chapterHeader")[0];
chapterHeader.addEventListener("mouseover", () => {
  document.getElementsByClassName("chapterTitle")[0].style.display = "block";
})

chapterHeader.addEventListener("mouseleave", () => {
  document.getElementsByClassName("chapterTitle")[0].style.display = "none";
})

screen.orientation.lock('portrait')