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

router.post('/:novel/category', async (req, res) => {
  try {
    let file = fs.readFile(`./novels/${req.params.novel}/metadata.json`).then(resp => {
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

router.get('/:novel/category', async (req, res) => {
  try {
    let file = fs.readFile(`./novels/${req.params.novel}/metadata.json`).then(resp => {
      JSON.parse(resp)
    }).then(metaData => {
      res.status(200).send({ category: metaData.category })
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/:novel/rating', async (req, res) => {
  try {
    let file = fs.readFile(`./novels/${req.params.novel}/metadata.json`).then(resp => {
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

router.get('/:novel/rating', async (req, res) => {
  try {
    let file = fs.readFile(`./novels/${req.params.novel}/metadata.json`).then(resp => {
      JSON.parse(resp)
    }).then(metaData => {
      res.status(200).send({ rating: metaData.rating })
    })
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