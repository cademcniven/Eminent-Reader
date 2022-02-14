const webnovel = require('./webnovel')

module.exports = app => {
    app.use('/webnovel', webnovel)
}