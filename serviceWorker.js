const staticCache = 'site-static'
const dynamicCache = 'site-dynamic'
const assets = [
    '/',
    '/webnovel.js',
    '/chapter.js',
    '/site.css'
]

//average chapter size seems to be ~17kb so 250,000 is ~4.25gb
const maxCacheSize = 250000

//TODO: eventually make this check what kind of thing it's deleting,
//and only delete novel chapters (so you don't delete like a font or something)
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size))
            }
        })
    })
}

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCache).then(cache => {
            let now = Date.now()

            let cachePromises = assets.map(urlToPrefetch => {
                let url = new URL(urlToPrefetch, location.href)
                url.search += (url.search ? '&' : '?') + 'cache-bust=' + now

                let request = new Request(url, { mode: 'no-cors' })
                return fetch(request).then(response => {
                    if (response.status >= 400) {
                        throw new Error(`Request for ${urlToPrefetch} failed with status ${response.statusText}`)
                    }

                    return cache.put(urlToPrefetch, response)
                }).catch(error => {
                    console.error(`Not caching ${urlToPrefetch} due to ${error}`)
                })
            })

            return Promise.all(cachePromises).then(() => {
                console.log('Pre-fetching complete')
            })
        }).catch(error => {
            console.error('Pre-fetching failed:', error)
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
                                ).then(limitCacheSize(dynamicCache, maxCacheSize))
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