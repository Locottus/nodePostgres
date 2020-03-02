const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '172.17.250.12',
  database: 'iotgis',
  password: '',
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


const createMessage = (request, response) => {
    //pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
  const { nombre,telefono, email,msg } = request.body
    console.log('esto es un post ' + nombre + ' ' + telefono + ' ' + email + ' '+ msg);
    let cadena = 'INSERT INTO mensajes (nombre,telefono,email,mensaje) VALUES (\'' + nombre + '\', \'' + telefono + '\', \'' + email + '\', \'' + msg + '\')'  ;
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
  getMessages,
  createMessage
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