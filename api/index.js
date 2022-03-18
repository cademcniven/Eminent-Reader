const Router = require('express-promise-router')
const fileLogic = require('../logic/fileLogic')

const router = new Router()
module.exports = router

router.get('/', async (req, res) => {
    res.status(200).render("index.html", { "novels": fileLogic.GetAllNovels() })
})

router.get('/favicon.ico', async (req, res) => {
    res.sendFile("favicon.ico", { root: '.' })
})

router.get('/android-chrome-192x192.png', async (req, res) => {
    res.sendFile("android-chrome-192x192.png", { root: '.' })
})

router.get('/android-chrome-512x512.png', async (req, res) => {
    res.sendFile("android-chrome-512x512.png", { root: '.' })
})

router.get('/apple-touch-icon.png', async (req, res) => {
    res.sendFile("apple-touch-icon.png", { root: '.' })
})

router.get('/favicon-16x16.png', async (req, res) => {
    res.sendFile("favicon-16x16.png", { root: '.' })
})

router.get('/favicon-32x32.png', async (req, res) => {
    res.sendFile("favicon-32x32.png", { root: '.' })
})

router.get('/site.webmanifest', async (req, res) => {
    res.sendFile("site.webmanifest", { root: '.' })
})