const { Router } = require('express')

const authController = require('../handler/auth_handler')
const {
  authenticateToken: authenticateToken,
} = require('../middlewares/auth.js')

const authRouter = Router()

authRouter.get('/v1/register', authController.register_get)
authRouter.post('/v1/register', authController.register_post)

authRouter.get('/v1/login', authController.login_get)
authRouter.post('/v1/login', authController.login_post)

authRouter.post('/v1/article', authenticateToken, authController.article_post)
authRouter.get(
  '/v1/:userId/articles',
  authenticateToken,
  authController.get_articles
)
authRouter.get(
  '/v1/articles',
  authenticateToken,
  authController.get_submitted_articles
)
authRouter.post(
  '/v1/articles/:articleID/publish',
  authenticateToken,
  authController.publish_article
)

authRouter.post(
  '/v1/articles/:articleID/reject',
  authenticateToken,
  authController.reject_article
)

module.exports = authRouter
