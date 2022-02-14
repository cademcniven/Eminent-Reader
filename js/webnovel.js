async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });

    return response.json();
}

function DownloadWebnovel() {
    console.log("in download web novel")

    const data = { url: 'https://ncode.syosetu.com/n4816he/' }

    postData("/webnovel", data).then(data => {
        console.log(data)
    })
}