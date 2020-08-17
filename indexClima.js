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

app.get('/incyt/api/sms', (request, response) => {
  response.json({ info: 'Node.js, Express, nginx  and Postgres API #SMS ' })
})

app.get('/incyt/api/sms/getSMS', db.getSMS)
app.post('/incyt/api/sms/postSMS', db.postSMS)



app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

