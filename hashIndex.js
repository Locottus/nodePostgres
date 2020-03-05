const multer = require('multer');
const pathImages = 'uploads/'
const upload = multer({ 
  dest: pathImages 
});


// const upload = multer({
//   storage: storage, limits: {
//     fileSize: 1024 * 1024 * 10
//   }
// })


const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3002
const f = require('./uploadFiles')


app.use('/incyt/api/HashFiles/uploads',express.static(pathImages));
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, pathImages);
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toISOString() + file.originalname);
//   }
// });

// const fileFilter = (req,file,cb)=>{
//   if(file.mimetype === 'image/jpeg'|| filemimetype === 'img/png'){
//     //accept file
//     cb(null,true);
//   }else{
//   //reject file
//   cb(null,false);
//   }
//};



app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/incyt/api/HashFiles', (request, response) => {
  response.json({ info: 'Node.js, Express, Postgresql and nginx Hash Image, receives a file, returns the hash, gets a hash, returns a file' })
})


app.get('/incyt/api/HashFiles/getFile', f.getFile)
app.post('/incyt/api/HashFiles/postFile', upload.single('file'), f.postFile)


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})


