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


app.get('/incyt/api/iot/getISE1_INFR', db.getISE1_INFRA)
app.get('/incyt/api/iot/getISE2_INFR', db.getISE2_INFRA)
app.get('/incyt/api/iot/getE1MS1', db.getE1MS1)

app.post('/incyt/api/iot/ISE1_INFR', db.ISE1_INFRA)
app.post('/incyt/api/iot/ISE2_INFR', db.ISE2_INFRA)
app.post('/incyt/api/iot/E1MS1', db.E1MS1)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})


