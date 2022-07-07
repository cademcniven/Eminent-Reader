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

// add size toggle to descriptions
const novelPanels = document.querySelectorAll('.novelPanel')
novelPanels.forEach(panel => {
  panel.addEventListener('click', (e) => {
    e.currentTarget.querySelector('.novelPanelDescription').classList.toggle('truncateDescription')
  })
})

// submit search on enter press
document.getElementById('novelUrl').onkeydown = function (e) {
  if (e.key === 'Enter')
    DownloadWebnovel()
}