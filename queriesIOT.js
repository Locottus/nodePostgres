const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '172.17.250.12',
  database: 'iotgis',
  password: 'postgres2020!Incyt',
  port: 5432,
})


const getISE1_INFRA = (request, response) => {
  const minutos = request.query.minutos;
  //select * from e1ms1 where fecha_recepcion > (current_timestamp - (100000 * interval '1 minute'))
  pool.query('SELECT * FROM polls_ise1_infra where fecha_recepcion > (current_timestamp - (' + minutos + ' * interval \'1 minute\')) ', (error, results) => {
    if (error) {
      throw error
    }
    //console.log('se han enviado todos los mensajes');
    response.status(200).json(results.rows)
  })
}

const getISE2_INFRA = (request, response) => {
  const minutos = request.query.minutos;
  pool.query('SELECT * FROM polls_ise2_infra  where fecha_recepcion > (current_timestamp - (' + minutos + ' * interval \'1 minute\')) ', (error, results) => {
    if (error) {
      throw error
    }
    //console.log('se han enviado todos los mensajes');
    response.status(200).json(results.rows)
  })
}

const getE1MS1 = (request, response) => {
  const minutos = request.query.minutos;
  pool.query('SELECT * FROM polls_e1ms1  where fecha_recepcion > (current_timestamp - (' + minutos + ' * interval \'1 minute\')) ', (error, results) => {
    if (error) {
      throw error
    }
    //console.log('se han enviado todos los mensajes');
    response.status(200).json(results.rows)
  })
}


const ISE1_INFRA = (request, response) => {
  //console.log(request.body);
  var err = false;
  for (var i = 0; i < request.body.length; i++) {
    //console.log('posicion del arreglo numero: ' + i);
    var { infrasonido_1, infrasonido_2, infrasonido_3, infrasonido_4, audible_1, mpu_gxe, mpu_gye, mpu_gze, mpu_axe, mpu_aye, mpu_aze, mpu_rotx, mpu_roty, mpu_rotz, posicion, fecha_recepcion } = request.body[i];
    pool.query('INSERT INTO polls_ise1_infra (infrasonido_1, infrasonido_2, infrasonido_3, infrasonido_4, audible_1, mpu_gxe, mpu_gye, mpu_gze, mpu_axe, mpu_aye, mpu_aze, mpu_rotx, mpu_roty, mpu_rotz, posicion, fecha_recepcion ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)',
      [infrasonido_1, infrasonido_2, infrasonido_3, infrasonido_4, audible_1, mpu_gxe, mpu_gye, mpu_gze, mpu_axe, mpu_aye, mpu_aze, mpu_rotx, mpu_roty, mpu_rotz, posicion, fecha_recepcion], (error, results) => {
        if (error) {
          //throw error
          err = true;
        }
      });
  }
  response.status(201).send({ 'msg': 'OK', 'error': err });
}

const ISE2_INFRA = (request, response) => {
  //console.log(request.body);
  var err = false;
  for (var i = 0; i < request.body.length; i++) {
    //console.log('posicion del arreglo numero: ' + i);
    var { infrasonido_1, infrasonido_2, infrasonido_3, infrasonido_4, audible_1, mpu_gxe, mpu_gye, mpu_gze, mpu_axe, mpu_aye, mpu_aze, mpu_rotx, mpu_roty, mpu_rotz, posicion, fecha_recepcion } = request.body[i];
    pool.query('INSERT INTO polls_ise2_infra (infrasonido_1, infrasonido_2, infrasonido_3, infrasonido_4, audible_1, mpu_gxe, mpu_gye, mpu_gze, mpu_axe, mpu_aye, mpu_aze, mpu_rotx, mpu_roty, mpu_rotz, posicion, fecha_recepcion ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)',
      [infrasonido_1, infrasonido_2, infrasonido_3, infrasonido_4, audible_1, mpu_gxe, mpu_gye, mpu_gze, mpu_axe, mpu_aye, mpu_aze, mpu_rotx, mpu_roty, mpu_rotz, posicion, fecha_recepcion], (error, results) => {
        if (error) {
          //throw error
          err = true;
        }
      });
  }
  response.status(201).send({ 'msg': 'OK', 'error': err });
}



const E1MS1 = (request, response) => {
  //console.log(request.body);
  var err = false;
  for (var i = 0; i < request.body.length; i++) {
    //console.log('posicion del arreglo numero: ' + i);
    var { infrasonido_1, infrasonido_2, infrasonido_3, infrasonido_4, audible_1, mpu_gxe, mpu_gye, mpu_gze, mpu_axe, mpu_aye, mpu_aze, mpu_rotx, mpu_roty, mpu_rotz, posicion, fecha_recepcion } = request.body[i];
    pool.query('INSERT INTO polls_e1ms1 (infrasonido_1, infrasonido_2, infrasonido_3, infrasonido_4, audible_1, mpu_gxe, mpu_gye, mpu_gze, mpu_axe, mpu_aye, mpu_aze, mpu_rotx, mpu_roty, mpu_rotz, posicion, fecha_recepcion ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)',
      [infrasonido_1, infrasonido_2, infrasonido_3, infrasonido_4, audible_1, mpu_gxe, mpu_gye, mpu_gze, mpu_axe, mpu_aye, mpu_aze, mpu_rotx, mpu_roty, mpu_rotz, posicion, fecha_recepcion], (error, results) => {
        if (error) {
          //throw error
          err = true;
        }
      });
  }
  response.status(201).send({ 'msg': 'OK', 'error': err });
}


module.exports = {
  getISE1_INFRA,
  getISE2_INFRA,
  getE1MS1,
  ISE1_INFRA,
  ISE2_INFRA,
  E1MS1
}



//website source (y)
//https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/
