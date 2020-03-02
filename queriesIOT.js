const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '172.16.250.12',
  database: 'herlichDB',
  password: 'postgres2020!Incyt',
  port: 5432,
})

const getUsers = (request, response) => {
  console.log('entrando a getUsers');
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    console.log('se han enviado todos los mensajes');
    response.status(200).json(results.rows)
  })
}


const createUser = (request, response) => {
  console.log('entrando a postUsers');
  const { name, email } = request.body
  console.log(name + ' ' + email);

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, result) => {
    if (error) {
      throw error
    }
    console.log('se han enviado todos los mensajes');
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}

/*
const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}
*/

module.exports = {
  getUsers,
  createUser,

}

