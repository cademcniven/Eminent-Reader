const staticCache = 'site-static'
const dynamicCache = 'site-dynamic'
const assets = [
    '/',
    '/webnovel.js',
    '/chapter.js',
    '/site.css'
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCache).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener('activate', event => {
    event.waitUntil(
        //delete caches that are a different version
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCache)
                .map(key => caches.delete(key))
            )
        })
    )
})

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(res => {
            return res || fetch(event.request).then(fetchRes => {
                return caches.open(dynamicCache).then(cache => {
                    //cache pages/resources that get used while online
                    cache.put(event.request.url, fetchRes.clone())

                    //if the user goes to a novel page, ie /webnovel/xxxxx,
                    //cache all the chapters of that novel
                    const pattern = new URLPattern({ pathname: '/webnovel/:id' })
                    if (pattern.test(event.request.url)) {

                        let urlParts = event.request.url.split('/')
                        let novelId = urlParts.pop() || urlParts.pop()

                        fetch(`/webnovel/chapterCount/${novelId}`)
                            .then(resp => resp.json())
                            .then(json => {
                                let urls = []
                                for (let i = 1; i < json.chapters; i++)
                                    urls.push(`${event.request.url}/${i}`)

                                Promise.all(
                                    urls.map(url => {
                                        fetch(url)
                                            .then(response => cache.put(url, response))
                                            .catch(error => console.error(error))
                                    })
                                )
                            }).catch(error => {
                                console.error("error:", error)
                            })
                    }

                    return fetchRes
                })
            })
        }).catch(error => {
            console.error('Fetching failed:', error)
            throw error
        })
    )
})