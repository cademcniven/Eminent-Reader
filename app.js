const express = require('express')
const cors = require('cors')
const nunjucks = require('nunjucks')

const app = express()
const PORT = process.env.PORT || 3069

nunjucks.configure('html', {
    autoescape: true,
    express: app
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

var index = require('./api/index')
var webnovel = require('./api/webnovel')
app.use('/', index)
app.use('/webnovel', webnovel)

app.use(express.static('css'))
app.use(express.static('js'))

app.listen(PORT, () => {
    console.log(`The Server is running at: http://localhost:${PORT}/`)
})