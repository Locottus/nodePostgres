const multer = require('multer');
const pathImages = '/hashImages/'
const upload = multer({dest: pathImages});

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3002
const imgs = require('./images')


app.use(express.static(pathImages));
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


app.get('/incyt/api/HashImages', (request, response) => {
  response.json({ info: 'Node.js, Express, Postgresql and nginx Hash Image, receives a file, returns the hash, gets a hash, returns a file' })
})


app.get('/incyt/api/HashImages/getImage', imgs.getImage)
app.post('/incyt/api/HashImages/postImage',upload.single('image'), imgs.postImage)


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})


