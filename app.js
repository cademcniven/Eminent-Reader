const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3069

app.use(cors())
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

var mountRoutes = require('./api')
mountRoutes(app)

app.use(express.static('html'))
app.use(express.static('css'))
app.use(express.static('js'))

app.listen(PORT, () => {
    console.log(`The Server is running at: http://localhost:${PORT}/`)
})