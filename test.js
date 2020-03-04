const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 4000

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


app.get('/incyt/api/test', (request, response) => {
  response.json({ info: 'Node.js, Express, Postgresql and nginx TEST API PORT 4K' })
})


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})


