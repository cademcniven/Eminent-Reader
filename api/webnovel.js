const Router = require('express-promise-router')
const webnovelLogic = require('../logic/webnovelLogic')

const fs = require('fs').promises

const router = new Router()
module.exports = router

router.post('/', async (req, res) => {
  await webnovelLogic.DownloadNovel(req.body.url)
  res.status(200).send('test')
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
    res.status(200).render('novel.html', JSON.parse(await fs.readFile(`./novels/${req.params.novel}/metadata.json`)))
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/:novel/:chapter', async (req, res) => {
  try {
    res.status(200).render('chapter.html', {
      novel: JSON.parse(await fs.readFile(`./novels/${req.params.novel}/metadata.json`)),
      chapter: JSON.parse(await fs.readFile(`./novels/${req.params.novel}/${req.params.chapter}.json`))
    })
  } catch (error) {
    res.status(500).send(error)
  }
})