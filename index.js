const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dbIOT = require('./queriesIOT');
const port = 3000;
const APIROUTE = '/incyt/api';

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//metodo root
app.get(APIROUTE, (request, response) => {
  console.log('accessing route api');
  response.json({ info: 'Node.js, Express, Nginx and Postgres API' })
})


//METODOS PARA IOT VULCANOLOGIA
app.get(APIROUTE + '/iotGet', () => {
  console.log('entrando al get de IOT');
  dbIOT.getUsers;
});

app.post(APIROUTE + '/iotPost', () => {
  console.log('entrando al post de IOT');
  dbIOT.createUser;
});


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})


// CREATE TABLE users (
//     ID SERIAL PRIMARY KEY,
//     name VARCHAR(30),
//     email VARCHAR(30),
//     unique(email)
//   );