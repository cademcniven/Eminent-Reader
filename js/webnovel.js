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

/**************************************************** 
 * Hide Category Checkboxes
 ****************************************************/
const hideReading = document.getElementById('hideReading')
const hideFinished = document.getElementById('hideFinished')
const hideDropped = document.getElementById('hideDropped')
const hideOnHold = document.getElementById('hideOnHold')
const hideWantToRead = document.getElementById('hideWantToRead')

const reading = document.getElementsByClassName('reading')
const finished = document.getElementsByClassName('finished')
const dropped = document.getElementsByClassName('dropped')
const onHold = document.getElementsByClassName('onhold')
const wantToRead = document.getElementsByClassName('wanttoread')

hideReading.addEventListener('change', () => {
  for (let elem of reading)
    elem.parentElement.toggleAttribute('hidden')
})

hideFinished.addEventListener('change', () => {
  for (let elem of finished)
    elem.parentElement.toggleAttribute('hidden')
})

hideDropped.addEventListener('change', () => {
  for (let elem of dropped)
    elem.parentElement.toggleAttribute('hidden')
})

hideOnHold.addEventListener('change', () => {
  for (let elem of onHold)
    elem.parentElement.toggleAttribute('hidden')
})

hideWantToRead.addEventListener('change', () => {
  for (let elem of wantToRead)
    elem.parentElement.toggleAttribute('hidden')
})