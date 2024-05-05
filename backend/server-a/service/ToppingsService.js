'use strict';

const { Pool } = require('pg');
const pool = new Pool({
  user: 'user',
  host: 'database',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

//  GET v1/toppings
//  Gets all the toppings from the database
//  returns an array of toppings (id, name)
exports.getToppings = function() {
  const query = {
    text: 'SELECT * FROM restaurant.toppings',
  }

  return pool.query(query)
    .then(res => {
      return res.rows;
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
}
