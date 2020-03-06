const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '172.17.250.12',
  database: 'iotgis',
  password: 'postgres2020!Incyt',
  port: 5432,
})


const getISE1_INFR = (request, response) => {
  const minutos = request.query.minutos;
  //select * from e1ms1 where fecha_recepcion > (current_timestamp - (100000 * interval '1 minute'))
  pool.query('SELECT * FROM ISE1_INFR where fecha_recepcion > (current_timestamp - ('+ minutos +' * interval \'1 minute\')) ', (error, results) => {
    if (error) {
      throw error
    }
    //console.log('se han enviado todos los mensajes');
    response.status(200).json(results.rows)
  })
}

const getISE2_INFR = (request, response) => {
  const minutos = request.query.minutos;
  pool.query('SELECT * FROM ISE2_INFR  where fecha_recepcion > (current_timestamp - ('+ minutos +' * interval \'1 minute\')) ', (error, results) => {
    if (error) {
      throw error
    }
    //console.log('se han enviado todos los mensajes');
    response.status(200).json(results.rows)
  })
}

const getE1MS1 = (request, response) => {
  const minutos = request.query.minutos;
  pool.query('SELECT * FROM E1MS1  where fecha_recepcion > (current_timestamp - ('+ minutos +' * interval \'1 minute\')) ', (error, results) => {
    if (error) {
      throw error
    }
    //console.log('se han enviado todos los mensajes');
    response.status(200).json(results.rows)
  })
}


const ISE1_INFR = (request, response) => {
  const { infrasonido_1,infrasonido_2, infrasonido_3,infrasonido_4,infrasonido_5,posicion,fecha_recepcion } = request.body
  //console.log('esto es un post ' + infrasonido_1 + ' ' + infrasonido_2 + ' ' + infrasonido_3 + ' '+ infrasonido_4 + ' '+ infrasonido_5 + ' '+ posicion + ' '+ fecha_recepcion);
  pool.query('INSERT INTO ISE1_INFR (infrasonido_1,infrasonido_2, infrasonido_3,infrasonido_4,infrasonido_5,posicion,fecha_recepcion) VALUES ($1, $2, $3, $4, $5, $6, $7)',
   [infrasonido_1,infrasonido_2, infrasonido_3,infrasonido_4,infrasonido_5,posicion,fecha_recepcion], (error, results) => {
    if (error) {
      throw error
    }
    //response.status(201).send(`User added with ID: ${results.body}`);
    response.status(201).send(`{'msg':'OK'}`);
  })
}

const ISE2_INFR = (request, response) => {
const { infrasonido_1,infrasonido_2, infrasonido_3,infrasonido_4,infrasonido_5,posicion,fecha_recepcion } = request.body
//console.log('esto es un post ' + infrasonido_1 + ' ' + infrasonido_2 + ' ' + infrasonido_3 + ' '+ infrasonido_4 + ' '+ infrasonido_5 + ' '+ posicion + ' '+ fecha_recepcion);
pool.query('INSERT INTO ISE2_INFR (infrasonido_1,infrasonido_2, infrasonido_3,infrasonido_4,infrasonido_5,posicion,fecha_recepcion) VALUES ($1, $2, $3, $4, $5, $6, $7)',
 [infrasonido_1,infrasonido_2, infrasonido_3,infrasonido_4,infrasonido_5,posicion,fecha_recepcion], (error, results) => {
  if (error) {
    throw error
  }
  response.status(201).send(`{'msg':'OK'}`);
})
}



const E1MS1 = (request, response) => {
  const { infrasonido_1,infrasonido_2,infrasonido_3,infrasonido_4,audible_1, MPU_gxe,MPU_gye,MPU_gze,MPU_axe,MPU_aye,MPU_aze,MPU_rotx,MPU_roty,MPU_rotz,posicion,fecha_recepcion  } = request.body
  //console.log('esto es un post ' + infrasonido_1+ ' ' +infrasonido_2+ ' ' +infrasonido_3+ ' ' +infrasonido_4+ ' ' +audible_1+ ' ' + MPU_gxe+ ' ' +MPU_gye+ ' ' +MPU_gze+ ' ' +MPU_axe+ ' ' +MPU_aye+ ' ' +MPU_aze+ ' ' +MPU_rotx+ ' ' +MPU_roty+ ' ' +MPU_rotz+ ' ' +posicion+ ' ' +fecha_recepcion );
  pool.query('INSERT INTO E1MS1 (infrasonido_1,infrasonido_2,infrasonido_3,infrasonido_4,audible_1, MPU_gxe,MPU_gye,MPU_gze,MPU_axe,MPU_aye,MPU_aze,MPU_rotx,MPU_roty,MPU_rotz,posicion,fecha_recepcion ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)',
   [infrasonido_1,infrasonido_2,infrasonido_3,infrasonido_4,audible_1, MPU_gxe,MPU_gye,MPU_gze,MPU_axe,MPU_aye,MPU_aze,MPU_rotx,MPU_roty,MPU_rotz,posicion,fecha_recepcion ], (error, results) => {
    if (error) {
      throw error
    }
    //response.status(201).send(`User added with ID: ${results.body}`);
    response.status(201).send(`{'msg':'OK'}`);
  })
  }
  

module.exports = {
  getISE1_INFR,
  getISE2_INFR,
  getE1MS1,
  ISE1_INFR,
  ISE2_INFR,
  E1MS1
}



// create table mensajes(
//     id serial PRIMARY KEY,
//        nombre text  not null,
//        telefono text  not null,
//        email text not null,
//        mensaje text not null,
//        fechaCreacion timestamp default CURRENT_TIMESTAMP
//     );
    



//website source (y)
//https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/
