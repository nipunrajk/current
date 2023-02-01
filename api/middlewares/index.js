const bodyParser = require('body-parser')

const applyBodyParser = (app) => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
}

module.exports = {
  applyBodyParser,
}
