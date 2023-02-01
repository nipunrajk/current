const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'mozilor@nipun',
  connectionLimit: 10,
  database: 'reader_app',
})
connection.connect()

// connection.query('SELECT * FROM users', (error, result) => {
//   console.log(error)
//   console.log(mysql.format(result))
// })

connection.connect(function (err) {
  if (err) throw err
  console.log('connected!')
})

module.exports = connection
