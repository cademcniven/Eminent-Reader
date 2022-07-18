const Router = require('express-promise-router')
const fileLogic = require('../logic/fileLogic')

const router = new Router()
module.exports = router

router.get('/', async (req, res) => {
  res.status(200).render('index.html', {
    novels: await fileLogic.GetAllNovels(),
    userSettings: await fileLogic.GetUserSettings(),
    settings: await fileLogic.GetSettings()
  })
})

router.get('/getUserSettings', async (req, res) => {
  res.status(200).json(await fileLogic.GetUserSettings())
})

router.post('/setUserSettings', async (req, res) => {
  try {
    fileLogic.SetUserSettings(req.body)
  } catch (error) {
    res.status(500).send(error)
  }
})