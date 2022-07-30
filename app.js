const express = require('express')
const cors = require('cors')
const nunjucks = require('nunjucks')
const open = require('open')
const computerName = require('computer-name')
const localtunnel = require('localtunnel')

const app = express()
const PORT = process.env.PORT || 3069

const nunjucksEnv = nunjucks.configure('html', {
  autoescape: true,
  express: app
})

nunjucksEnv.addFilter('toLocaleString', (num) => Number(num).toLocaleString('en'))
nunjucksEnv.addFilter('toLocaleDateString', (s) => {
  let date = new Date(s)
  return date.toLocaleDateString('en-US')
})
nunjucksEnv.addFilter('trim', (str) => str.trim())
nunjucksEnv.addFilter('stripWhitespace', (str) => {
  if (str)
    return str.split(' ').join('')

  return null
})
nunjucksEnv.addFilter('getRatingIsChecked', (rating, starNumber) => {
  if (rating == starNumber)
    return 'checked'

  return null
})
nunjucksEnv.addFilter('is_string', obj => {
  return typeof obj == 'string';
})
nunjucksEnv.addFilter('convertCssProperty', str => {
  return str.replaceAll('_', '-')
})

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
app.use(express.static(__dirname + '/'))
app.use('/webnovel', require('./api/webnovel'))

app.use(express.static('./css'))
app.use(express.static('./js'))
app.use(express.static('./settings'))

app.use('/fonts', express.static('./fonts'))
app.use('/img', express.static('./img'))

app.listen(PORT, () => {
  console.log(`The Server is running at: http://localhost:${PORT}/`)
})

open(`http://${computerName()}:${PORT}`)

// localtunnel({ port: PORT }).then((tunnel) => {
//   console.log(tunnel.url)
// })