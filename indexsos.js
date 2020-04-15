const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queriessos')
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

app.get('/incyt/api/sosagua', (request, response) => {
  response.json({ info: 'Node.js, Express, nginx  and Postgres API #SOSAGUA ' })
})

app.get('/incyt/api/sos/getalertsmaster', db.getAlertsMaster)
app.get('/incyt/api/sos/getalertsdetail', db.getAlertsDetail)
app.get('/incyt/api/sos/getdepartamentos', db.getDepartamentos)
app.get('/incyt/api/sos/getmunicipios', db.getMunicipios)
app.get('/incyt/api/sos/getnecesidad', db.getNecesidad)
app.post('/incyt/api/sosagua/createalerts', db.createAlerts)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

