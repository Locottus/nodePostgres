const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./queriesagua');
const port = 3000;

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

app.get('/incyt/api/sosagua/getalertsmaster', db.getAlertsMaster)
app.get('/incyt/api/sosagua/getalertsdetail', db.getAlertsDetail)
app.get('/incyt/api/sosagua/getalertsdetailreport', db.getAlertsDetailReport)
app.get('/incyt/api/sosagua/getdepartamentos', db.getDepartamentos)
app.get('/incyt/api/sosagua/getmunicipios', db.getMunicipios)
app.get('/incyt/api/sosagua/getnecesidad', db.getNecesidad)
app.post('/incyt/api/sosagua/createalerts', db.createAlerts)



app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

