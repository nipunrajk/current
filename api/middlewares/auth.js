const jwt = require('jsonwebtoken')

function createValidator(schema) {
  return function (req, res, next) {
    const { error } = schema.validate(req.body, {
      abortEarly: true,
      allowUnknown: true,
    })
    if (!error) {
      return next()
    }

    return res.status(400).send({
      message: 400,
      status: error.message,
    })
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.header['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  const content = req.body.content
  if (token == null || !content) {
    return res.status(400).json({
      status: 'error',
      message: 'Token and content are required',
    })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'error',
        message: 'Invalid authorization token',
      })
    }
    req.user = user
    next()
  })
}

// module.exports = createValidator
module.exports = { createValidator, authenticateToken }
