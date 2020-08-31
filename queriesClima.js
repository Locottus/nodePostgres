const Pool = require('pg').Pool

// const pool = new Pool({
//   user: 'postgres',
//   host: '172.17.250.12',
//   database: 'sms',
//   password: 'postgres2020!Incyt',
//   port: 5432,
// })

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'clima',
  password: 'Guatemala1',
  port: 5432,
})


const meses = [
  {
      "mes": "Enero",
      "id": "1",
  },
  {
      "mes": "Febrero",
      "id": "2",
  },
  {
      "mes": "Marzo",
      "id": "3",
  },
  {
      "mes": "Abril",
      "id": "4",
  },
  {
      "mes": "Mayo",
      "id": "5",
  },
  {
      "mes": "Junio",
      "id": "6",
  },
  {
      "mes": "Julio",
      "id": "7",
  },
  {
      "mes": "Agosto",
      "id": "8",
  },
  {
      "mes": "Septiembre",
      "id": "9",
  },
  {
      "mes": "Octubre",
      "id": "10",
  },
  {
      "mes": "Noviembre",
      "id": "11",
  },
  {
      "mes": "Diciembre",
      "id": "12",
  },
];



const getestaciones = (request, response) => {
   //const fecha = request.query.fecha;//fecha en formato YYYY-MM-DD
  var q = 'select distinct estacion,longitud,latitud,zona_vida from historico_estaciones order by estacion asc'  ;
  pool.query(q, (error, results) => {
    if (error) {
      response.status(500).send('{"msg":"' + error + '"}');
    }
    console.log('#CLIMA GET Method ALL STATIONS');
    response.status(200).json(results.rows);
  })
}

const getmeses = (request, response) => {
  console.log("ENTRANDO A GET MESES");
  response.status(200).json(meses);
}


const getyears = (request, response) => {
 var q = 'select distinct year from historico_estaciones order by year desc'  ;
 pool.query(q, (error, results) => {
   if (error) {
     response.status(500).send('{"msg":"' + error + '"}');
   }
   console.log('#CLIMA GET Method ALL years');
   response.status(200).json(results.rows);
 })
}


const getdata = (request, response) => {
  const yyyy1 = request.query.yyyy1;
  const yyyy2 = request.query.yyyy2;
  //const mm1 = request.query.mm1;
  //const mm2 = request.query.mm2;
  const estacion = request.query.estacion;
  var q = 'select * from historico_estaciones where estacion = \'' + estacion + '\' and year between ' + yyyy1 + ' and ' +yyyy2  ;
  console.log(q);
  pool.query(q, (error, results) => {
    if (error) {
      response.status(500).send('{"msg":"' + error + '"}');
    }
    console.log('#CLIMA GET data requested');
    response.status(200).json(results.rows);
  })
 }


module.exports = {
  getestaciones,
  getyears,
  getmeses,
  getdata
  }
  
  