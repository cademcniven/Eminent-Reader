const Router = require('express-promise-router')
const fileLogic = require('../logic/fileLogic')

const router = new Router()
module.exports = router

router.get('/', async (req, res) => {
    res.status(200).render("index.html", { "novels": fileLogic.GetAllNovels() })
})