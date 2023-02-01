const express = require('express')
const { applyBodyParser } = require('./middlewares/index')
const cookieParser = require('cookie-parser')

const connection = require('./database/database')

const app = express()

const bodyParser = require('./middlewares/index')
const routers = require('./routes/index')
const authRouter = require('./routes/authRoutes')

app.use(express.json())
app.use(cookieParser())
applyBodyParser(app)

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

// routes
app.use('/', routers)
app.use('/', authRouter)

// cookies
app.get('/set-cookies', (req, res) => {
  // res.setHeader('Set-Cookie', 'newUser=true')
  res.cookie('newUser', false, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
  res.send('you got the cookies')
})

app.get('/get-cookies', (req, res) => {
  const cookies = req.cookies
  console.log(cookies)
  res.json(cookies)
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
