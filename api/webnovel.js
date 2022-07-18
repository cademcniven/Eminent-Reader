const Router = require('express-promise-router')
const webnovelLogic = require('../logic/webnovelLogic')
const fileLogic = require('../logic/fileLogic')

const fs = require('fs').promises

const router = new Router()
module.exports = router

router.post('/', async (req, res) => {
  await webnovelLogic.DownloadNovel(req.body.url)
  res.status(200).send('test')
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

router.get('/chapterCount/:novel', async (req, res) => {
  try {
    let file = fs.readFile(`./novels/${req.params.novel}/metadata.json`).then(resp => {
      res.status(200).send({ chapters: JSON.parse(resp)['chapters'] })
    })

  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/:novel', async (req, res) => {
  try {
    res.status(200).render('novel.html', {
      metaData: JSON.parse(await fs.readFile(`./novels/${req.params.novel}/metadata.json`)),
      settings: await fileLogic.GetSettings()
    })
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

router.post('/:novel/category', async (req, res) => {
  try {
    fs.readFile(`./novels/${req.params.novel}/metadata.json`).then(resp => {
      return JSON.parse(resp)
    }).then(metaData => {
      metaData.category = req.body.category
      fs.writeFile(`./novels/${req.params.novel}/metadata.json`, JSON.stringify(metaData))
      res.status(200)
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/:novel/rating', async (req, res) => {
  try {
    fs.readFile(`./novels/${req.params.novel}/metadata.json`).then(resp => {
      return JSON.parse(resp)
    }).then(metaData => {
      metaData.rating = req.body.rating
      fs.writeFile(`./novels/${req.params.novel}/metadata.json`, JSON.stringify(metaData))
      res.status(200)
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/:novel/review', async (req, res) => {
  try {
    fs.readFile(`./novels/${req.params.novel}/metadata.json`).then(resp => {
      return JSON.parse(resp)
    }).then(metaData => {
      metaData.review = req.body.review
      fs.writeFile(`./novels/${req.params.novel}/metadata.json`, JSON.stringify(metaData))
      res.status(200)
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/:novel/:chapter', async (req, res) => {
  try {
    res.status(200).render('chapter.html', {
      novel: JSON.parse(await fs.readFile(`./novels/${req.params.novel}/metadata.json`)),
      chapter: JSON.parse(await fs.readFile(`./novels/${req.params.novel}/${req.params.chapter}.json`)),
      userSettings: JSON.parse(await fs.readFile(`./settings/userSettings.json`))
    })
  } catch (error) {
    res.status(500).send(error)
  }
})