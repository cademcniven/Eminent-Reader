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

// submit search on enter press
document.getElementById('novelUrl').onkeydown = function (e) {
  if (e.key === 'Enter')
    DownloadWebnovel()
}

//close all other open details when opening a detail
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