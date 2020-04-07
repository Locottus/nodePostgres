const Pool = require('pg').Pool
// const pool = new Pool({
//   user: 'postgres',
//   host: '172.17.250.12',
//   database: 'iotgis',
//   password: 'postgres2020!Incyt',
//   port: 5432,
// })

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sosagua',
  password: 'Guatemala1',
  port: 5432,
})

const getAlerts = (request, response) => {
  pool.query('select f.id,f.sos, m.point_x, m.point_y from fase1 f, municipios m where f.municipio = m.id ', (error, results) => {
    if (error) {
      throw error
    }
    console.log('#SOSAGUA GET Method Fase1');
    response.status(200).json(results.rows)
  })
}


const getMunicipios = (request, response) => {
  pool.query('select * from  municipios  ', (error, results) => {
    if (error) {
      throw error
    }
    console.log('#SOSAGUA GET Method Municipios');
    response.status(200).json(results.rows)
  })
}


const getSos = (request, response) => {
  pool.query('select * from  sos  ', (error, results) => {
    if (error) {
      throw error
    }
    console.log('#SOSAGUA GET Method SOS');
    response.status(200).json(results.rows)
  })
}

const createAlerts = (request, response) => {
    //pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
  const { twitjson,twitstring,origen,municipio,sos } = request.body
    console.log('esto es un post ' + twitjson + ' ' + twitstring + ' ' + origen + ' ' + municipio + ' '+ sos);
    let cadena = 'INSERT INTO fase1 (twitjson,twitstring,origen) VALUES (\'' + twitjson + '\', \'' + twitstring + '\', \'' + origen + '\', \'' + municipio + '\', \'' + sos + '\')'  ;
    console.log(cadena);
  pool.query(cadena, (error, results) => {
    if (error) {
      throw error
    }
    //response.status(201).send(`User added with ID: ${results.body}`);
    response.status(201).send(`{'msg':'OK'}`);
  })
}


module.exports = {
  getAlerts,
  getMunicipios,
  getSos,
  createAlerts
}

