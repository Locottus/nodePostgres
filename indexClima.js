const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./queriesClima');
const port = 3004;

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

app.get('/incyt/api/clima', (request, response) => {
  response.json({ info: 'Node.js, Express, nginx  and Postgres API #CLIMA ' })
})

app.get('/incyt/api/clima/getestaciones', db.getestaciones)
app.get('/incyt/api/clima/getanios', db.getyears)
app.get('/incyt/api/clima/getmeses', db.getmeses)
//app.get('/incyt/api/clima/getmes', db.getSMS)
//app.post('/incyt/api/clima/postSMS', db.postSMS)



app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

