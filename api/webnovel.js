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
    console.log("in novel route")

    fs.readFile(`./novels/${req.params.novel}/metadata.json`, (error, data) => {
        if (error) {
            res.status(500).send(error)
        } else {
            res.status(200).render('novel.html', JSON.parse(data))
        }
    })
})