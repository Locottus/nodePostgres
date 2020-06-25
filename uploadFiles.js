const Pool = require('pg').Pool

//PROD
const pool = new Pool({
  user: 'postgres',
  host: '172.17.250.12',
  database: 'hashFiles',
  password: 'postgres2020!Incyt',
  port: 5432,
})

//DEV
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'hashFiles',
//   password: 'Guatemala1',
//   port: 5432,
// })


//var stamm = 'http://localhost:3002';//DEV
var stamm = 'https://arcgis-web.url.edu.gt';//PROD

var filePath = '/incyt/api/HashFiles/uploads/';
  

const grabaCatalogo = (request) => {
  //pool.query('insert into fileCatalog (fieldname,originalname,encoding,mimetype,destination,filename,path,size)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [name, email], (error, results) => {
  const { fieldname, originalname, encoding, mimetype, destination, filename, path, size } = request.file;
  const origen = request.query.origen;
  var i = originalname.indexOf('.');
  var ext = originalname.substring(i, originalname.length);
  var webName = filename + ext;
  //console.log('esto es un post ' + fieldname + ' ' + originalname + ' ' + encoding + ' '+ mimetype + ' '+ destination + ' '+ filename + ' '+ path + ' '+ size );
  //console.log('origen del archivo: ' + origen);
  pool.query('insert into fileCatalog (fieldname,originalname,encoding,mimetype,destination,filename,path,size,origen,extension,webname)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11)',
    [fieldname, originalname, encoding, mimetype, destination, filename, stamm + filePath + webName, size, origen, ext, webName], (error, results) => {
      if (error) {
        throw error
      }
      //response.status(201).send(`User added with ID: ${results.body}`);
      //response.status(201).send(`{'msg':'OK'}`);
      //console.log("no hubo error");
    })


    //renombramos el archivo para que tenga extension
    var fs = require('fs');
    fs.rename('uploads/' + filename, 'uploads/' + webName , function(err) {
        if ( err ) console.log('ERROR: ' + err);
    });

}

const grabaCatalogoEstatico = (request) => {
  console.log(request.file);
  //pool.query('insert into fileCatalog (fieldname,originalname,encoding,mimetype,destination,filename,path,size)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [name, email], (error, results) => {
  const { fieldname, originalname, encoding, mimetype, destination, filename, path, size } = request.file;
  const origen = request.query.origen;
  
  var i = originalname.indexOf('.');
  var ext = originalname.substring(i, originalname.length);
  var webName = filename + ext;
  console.log('esto es un post ' + fieldname + ' ' + originalname + ' ' + encoding + ' '+ mimetype + ' '+ destination + ' '+ filename + ' '+ path + ' '+ size );
  console.log('origen del archivo: ' + origen);
  pool.query('insert into fileCatalog (fieldname,originalname,encoding,mimetype,destination,filename,path,size,origen,extension,webname)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11)',
    [fieldname, originalname, encoding, mimetype, destination, filename,
       stamm + filePath + originalname, size, origen, ext, webName], (error, results) => {
      if (error) {
        throw error;
      }
      //response.status(201).send(`User added with ID: ${results.body}`);
      //response.status(201).send(`{'msg':'OK'}`);
      //console.log("no hubo error");
    })


    
    //renombramos el archivo para que tenga extension
    var fs = require('fs');
    fs.rename('uploads/' + filename, 'uploads/' + originalname , function(err) {
        if ( err ) console.log('ERROR: ' + err);
    });

}


const getFile = (request, response) => {
  const imageName = request.query.imageName;
  console.log(imageName);
  response.status(200).json(request.file);

}


const postFile = (request, response) => {
  console.log(request.file);
  grabaCatalogo(request);
  response.status(201).send(request.file);
}



const postStaticFile = (request, response) => {
  console.log(request.file);
  grabaCatalogoEstatico(request);
  var url =  '{ "url" : "' +stamm +   filePath + request.file.originalname + '"}';
  response.status(201).send(JSON.parse(url));
}


module.exports = {
  getFile,
  postFile,
  //getStaticFile,
  postStaticFile
}
