const express = require('express')
const routers = express.Router()

const { authenticateToken } = require('../middlewares/auth')

routers.get('/', (req, res) => {
  console.log('hello second')
})

// demo data
const posts = [
  {
    username: 'Kyle',
    title: 'Post 1',
  },
  {
    username: 'Jim',
    title: 'Post 2',
  },
]

routers.get('/v1/articles?', (req, res) => {
  const { status, tag } = req.query
  const filteredArticles = articles.filter((article) => {
    return article.status === status && article.tags.includes(tag)
  })
  return res.json({ articles: filteredArticles })
})

routers.get('/api/v1/articles/:articleID', (req, res) => {
  const { articleID } = req.params

  const article = articles.find((article) => article.id === parseInt(articleID))

  if (!article) {
    return res
      .status(404)
      .json({ error: `Article with ID ${articleID} not found` })
  }

  return res.json({ article })
})

routers.get('/v1/posts', authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user_name))
})

module.exports = routers
