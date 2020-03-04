const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queriesIOT')
const port = 3001

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

app.get('/incyt/api/iot', (request, response) => {
  response.json({ info: 'Node.js, Express,nginx and Postgres API IOT' })
})

app.get('/incyt/api/iot/mensajes', db.getMessages)
app.post('/incyt/api/iot/mensaje', db.createMessage)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})


