const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const lib = require('./geopostLib');
const port = 3005;

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

app.get('/incyt/api/geopost', (request, response) => {
  response.json({ info: 'Node.js, Express, nginx  and Postgres API Geopost Guatemala ' });
})

app.get('/incyt/api/geopost/CoordenadasAGeopost', lib.CoordenadasAGeopost);
app.get('/incyt/api/geopost/GeopostACoordenadas', lib.GeopostACoordenadas);


app.listen(port, () => {
  console.log(`App running on port ${port}.`);
})

