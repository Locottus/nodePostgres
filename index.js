const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queriesIOT')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/incyt/api', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/incyt/api/mensajes', db.getMessages)
app.post('/incyt/api/mensaje', db.createMessage)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})


