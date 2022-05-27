async function postData (url = '', data = {}) {
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

// TODO: this doesn't seem to do anything useful?
function DownloadWebnovel () {
  postData('/webnovel', {
    url: document.getElementById('novelUrl').value
  }).then(data => {
    console.log(data)
  })
}
