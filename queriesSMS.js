const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '172.17.250.12',
  database: 'sms',
  password: 'postgres2020!Incyt',
  port: 5432,
})

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'sosagua',
//   password: 'Guatemala1',
//   port: 5432,
// })



const getSMS = (request, response) => {
   const fecha = request.query.fecha;//fecha en formato YYYY-MM-DD
   var q = 'select sms from sms where fecha between \''+ fecha  +' 00:00:00\'' +
   ' and \''+ fecha +' 23:59:00\' ' + 
   ' order by fecha asc ';
  pool.query(q, (error, results) => {
    if (error) {
      //throw error
      response.status(500).send('{"msg":"' + error + '"}');
    }
    console.log('#SOSAGUA GET Method cubo1');
    response.status(200).json(results.rows)
  })
}


const postSMS = (request, response) => {
    var jtxt = JSON.stringify(request.body);
    console.log(jtxt);
    //var origen = request.body.source;
  
  let cadena = 'INSERT INTO sms (sms) VALUES (\'' +  jtxt  + '\')'  ;
  console.log(cadena);
pool.query(cadena, (error, results) => {
  if (error) {
    response.status(500).send('{"msg":"' + error + '"}');
}
  //response.status(201).send(`User added with ID: ${results.body}`);
  response.status(201).send(`{'msg':'OK'}`);
})
}


module.exports = {
    getSMS,
    postSMS
  }
  
  