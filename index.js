const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/mensajes', db.getMessages)
app.post('/mensaje', db.createMessage)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})


// CREATE TABLE users (
//     ID SERIAL PRIMARY KEY,
//     name VARCHAR(30),
//     email VARCHAR(30)
//   );