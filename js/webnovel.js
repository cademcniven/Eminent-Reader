/**************************************************** 
 * Download novel
 ****************************************************/
async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  })

  return response.json()
}

function DownloadWebnovel() {
  postData('/webnovel', {
    url: document.getElementById('novelUrl').value
  }).then(data => {
    console.log(data)
  })

  document.getElementById('novelUrl').value = ''
}

/**************************************************** 
 * Submit search on enter press
 ****************************************************/
document.getElementById('novelUrl').onkeydown = function (e) {
  if (e.key === 'Enter')
    DownloadWebnovel()
}

/**************************************************** 
 * Close all other open details when opening a detail
 ****************************************************/
const details = document.querySelectorAll('details')

details.forEach((targetDetail) => {
  targetDetail.addEventListener('click', () => {
    details.forEach((detail) => {
      if (detail !== targetDetail) {
        detail.removeAttribute('open')
      }
    })
  })
})

/**************************************************** 
 * Sort Stuff
 ****************************************************/
const library = document.getElementById('library')
const novelPanels = document.getElementsByClassName('novelPanel')
const sortSelect = document.getElementById('sortField')
const sortDirection = document.getElementById('sortDirection')

var sortField
var isDescending = true

const sortNovels = () => {
  let novels = Array.from(novelPanels)
  let sorted

  if (sortField == 'title' || sortField == 'category')
    sorted = novels.sort(sortText(isDescending))
  else
    sorted = novels.sort(sortInt(isDescending))

  if (isDescending)
    sorted = sorted.reverse()

  sorted.forEach(e => {
    library.appendChild(e)
  })
}

const sortInt = () => {
  return (a, z) => a.dataset[sortField] - z.dataset[sortField]
}

const sortText = () => {
  return (a, z) => a.dataset[sortField].localeCompare(z.dataset[sortField])
}

sortSelect.addEventListener('change', event => {
  sortField = event.target.value
  sortNovels()
})

sortDirection.addEventListener('click', event => {
  isDescending = !isDescending
  sortNovels()
})