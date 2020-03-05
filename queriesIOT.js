const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '172.16.250.12',
  database: 'iotgis',
  password: 'postgres2020!Incyt',
  port: 5432,
})


const getMessages = (request, response) => {
  pool.query('SELECT * FROM mensajes ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    console.log('se han enviado todos los mensajes');
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
  getMessages,
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
