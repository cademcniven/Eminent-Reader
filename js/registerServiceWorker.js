if ('serviceWorker' in navigator) {
    const registration = navigator.serviceWorker.register('/serviceWorker.js')
        .then((reg) => console.log('service worker registered', reg))
        .catch((err) => console.log('service worker not registered', err))
}
else {
    console.log("This browser does not support service workers")
}