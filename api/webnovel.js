const Router = require('express-promise-router')
const logic = require('../logic/webnovelLogic')

const router = new Router()
module.exports = router

router.post('/', async (req, res) => {
    console.log("in /webnovel post")
    logic.DownloadNovel(req.body.url)
    res.status(200).send("test")
})