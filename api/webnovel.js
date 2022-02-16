const Router = require('express-promise-router')
const logic = require('../logic/webnovelLogic')
const fs = require('fs')

const router = new Router()
module.exports = router

router.post('/', async (req, res) => {
    logic.DownloadNovel(req.body.url)
    res.status(200).send("test")
})

router.get('/:novel', async (req, res) => {
    fs.readFile(`./novels/${req.params.novel}/metadata.json`, (error, data) => {
        if (error) {
            res.status(500).send(error)
        } else {
            res.status(200).render('novel.html', JSON.parse(data))
        }
    })
})

router.get('/:novel/:chapter', async (req, res) => {
    fs.readFile(`./novels/${req.params.novel}/${req.params.chapter}.json`, (error, data) => {
        if (error) {
            res.status(500).send(error)
        } else {
            res.status(200).render('chapter.html', JSON.parse(data))
        }
    })
})