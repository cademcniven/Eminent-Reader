const express = require('express')
const cors = require('cors')
const nunjucks = require('nunjucks')

const app = express()
const PORT = process.env.PORT || 3069

const nunjucksEnv = nunjucks.configure('html', {
  autoescape: true,
  express: app
})

nunjucksEnv.addFilter('toLocaleString', (num) => Number(num).toLocaleString('en'))

app.use(cors())
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())
app.engine('html', nunjucks.render)
app.set('view_engine', 'html')

app.use('/', require('./api/index'))
app.use('/webnovel', require('./api/webnovel'))

app.use(express.static('./css'))
app.use(express.static('./js'))
app.use("/fonts", express.static('./fonts'))
app.use("/img", express.static('./img'))

app.listen(PORT, () => {
  console.log(`The Server is running at: http://localhost:${PORT}/`)
})
