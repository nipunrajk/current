require('dotenv').config()
const bcrypt = require('bcrypt')
const Joi = require('joi')
const jwt = require('jsonwebtoken')

const db = require('../database/database.js')
const { createValidator: validator } = require('../middlewares/auth.js')
const { registerSchema, loginSchema } = require('../schemas/index')

module.exports.register_post = [
  validator(registerSchema),
  async (req, res, next) => {
    try {
      // password hashing
      const { user_name, user_email, password, is_admin } = req.body
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      console.log(`Hashed password: ${hashedPassword}`)

      // insert into database
      const sql = `INSERT INTO users (user_name, user_email, password, is_admin) VALUES (?, ?, ?, ?)`
      const params = [user_name, user_email, hashedPassword, is_admin]
      await new Promise((resolve, reject) => {
        db.query(sql, params, (error, result) => {
          if (error) return reject(error)
          resolve(result)
        })
      })

      res.send('User registered successfully')
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
]

module.exports.register_get = async (req, res, next) => {
  try {
    const sql = 'SELECT * FROM users'
    const results = await new Promise((resolve, reject) => {
      db.query(sql, (error, result) => {
        if (error) return reject(error)
        resolve(result)
      })
    })

    res.status(200).json({
      success: true,
      message: 'Retrieved registered users',
      data: results,
    })
  } catch (error) {
    next(error)
  }
}

module.exports.login_post = [
  validator(loginSchema),
  async (req, res, next) => {
    try {
      const { user_name, password } = req.body

      // code to fetch user from the database
      const query = `SELECT * FROM users WHERE user_name = '${user_name}'`
      db.query(query, (error, results, fields) => {
        if (error) throw error
        if (results.length === 0) {
          return res.status(401).send('Username or password is incorrect')
        }

        const user = results[0]
        bcrypt.compare(password, user.password, (error, isMatch) => {
          if (error) throw error
          if (!isMatch)
            return res.status(401).send('Username or password is incorrect')

          const secret = process.env.ACCESS_TOKEN_SECRET || 'secret'
          const token = jwt.sign({ id: user.id }, secret)
          res.json({ message: 'Login successful', token })
        })
      })
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
]

module.exports.login_get = async (req, res, next) => {
  try {
    const user = req.user
    const userData = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users WHERE user_name = '${user.user_name}'`,
        (error, results) => {
          if (error) reject(error)
          resolve(results)
        }
      )
    })
  } catch (error) {
    next(error)
  }
}

module.exports.article_post = async (req, res, next) => {
  const author = await getAuthorNameFromToken(req.header('Authorization'))
  const date = new Date()
  const id = 'some_unique_id'

  const article = {
    id,
    header: req.header,
    content: req.body.content,
    author,
    date,
    status: 'success',
  }
  return res.status(200).json(article)
  next()
}

async function getAuthorNameFromToken(authHeader) {
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Authorization token is required',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    return decoded.username
  } catch (err) {
    return res.status(403).json({
      status: 'error',
      message: 'Invalid authorization token',
    })
  }
}

module.exports.get_articles = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const articles = await Article.find({ author: userId })
    return res.status(200).json({
      status: 'success',
      articles,
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    })
  }
}

module.exports.get_submitted_articles = async (req, res, next) => {
  try {
    const status = req.query.status
    const articles = await Article.find({ status })
    return res.status(200).json({
      status: 'success',
      articles,
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
    })
  }
}

module.exports.publish_article = async (req, res, next) => {
  const articleID = req.params.articleID

  // your code to publish the article goes here
  // Get the article with the given ID
  // const article = // code to get the article from the database
  // Update the status of the article to "published"
  // (article.status = 'published')

  // Save the updated article to the database
  // code to save the article to the database

  // Return a success message
  res.status(200).json({
    success: true,
    message: 'Article published successfully',
  })
}

module.exports.reject_article = async (req, res, next) => {
  const articleID = req.params.articleID

  // Get the article with the given ID
  const article = // code to get the article from the database
    // Update the status of the article to "rejected"
    (article.status = 'rejected')

  // Save the updated article to the database
  // code to save the article to the database

  // Return a success message
  res.status(200).json({
    success: true,
    message: 'Article rejected successfully',
  })
}
