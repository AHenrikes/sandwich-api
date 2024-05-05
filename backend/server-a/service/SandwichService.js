'use strict';

const SANDWICHNOTFOUNDERROR = { type: 'SandwichNotFoundError', message: 'Sandwich not found' }
const DATABASE_ERROR = { type: 'DatabaseError', message: 'Internal server error, database query failed' }

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // to decrypt DB API keys

const { Pool } = require('pg');
const pool = new Pool({
  user: 'user',
  host: 'database',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

// Function to validate API key
async function validateApiKey(headerApiKey) {

  const apiKeyQuery =  {
    text: 'SELECT pgp_sym_decrypt(encrypted_key::bytea, $1) as api_key FROM restaurant.api_keys',
    values: [ENCRYPTION_KEY]
  };

  let apiKeyArray = [];

  // Query the database for API keys
  try {
    const apiKeyRes = await pool.query(apiKeyQuery);
    apiKeyArray = apiKeyRes.rows.map(row => row.api_key);
  } catch (err) {
    console.error('Error executing query', err);
    throw DATABASE_ERROR;
  }

  // Check that API keys were found
  if (apiKeyArray.length === 0) {
    console.error('No API keys found in database');
    throw DATABASE_ERROR;
  }

  // Check if the request header API key is valid
  if (apiKeyArray.includes(headerApiKey)) {
    return true;
  } else {
    console.log("Invalid API key")
    throw {type: 'ApiKeyInvalidError', message: 'Invalid API key'};
  }
}

// Function adds toppings to a sandwich in DB
// Returns array of added toppings with id and name
async function addToppingsToSandwich(sandwichId, toppings) {
  let toppingResults = [];
  if (toppings) {
    // Validate toppings array
    if (!Array.isArray(toppings)) {
      throw new Error('Toppings must be an array');
    } else {
      // Validate each topping
      for (const topping of toppings) {
        const res = await pool.query({
          text: 'SELECT * FROM restaurant.toppings WHERE id = $1',
          values: [topping.id]
        });

        // Throw error if topping does not exist
        if (res.rows.length === 0) {
          throw {type: 'ToppingNotFoundError', message: `Topping ${topping.id} does not exist in the database.` };
        }

        // Add topping to sandwich
        const toppingRes = await pool.query({
          text: 'INSERT INTO restaurant.sandwich_toppings ("sandwichId", "toppingId") VALUES ($1, $2) RETURNING *',
          values: [sandwichId, topping.id]
        });
        toppingResults.push(toppingRes.rows[0]);
      }
    }
  }
  return toppingResults;
}

// Function gets toppings for a sandwich from DB
// Returns array of toppings with id and name
async function getToppingsForSandwich(sandwichId) {
  
  const toppingsQuery = {
    text: 'SELECT * FROM restaurant.sandwich_toppings WHERE "sandwichId" = $1',
    values: [sandwichId]
  }

  const toppingsRes = await pool.query(toppingsQuery);

  const toppings = [];
  for (const row of toppingsRes.rows) {
    const toppingRes = await pool.query({
      text: 'SELECT * FROM restaurant.toppings WHERE id = $1',
      values: [row.toppingId]
    });
    const topping = toppingRes.rows[0];
    toppings.push({id: topping.id, name: topping.name});
  }
  return toppings;
}

//  Add a new sandwich to the store. Needs an API key.
exports.addSandwich = async function(body, api_key) {

  await validateApiKey(api_key);

  await pool.query('BEGIN');

  try {
    const addSandwichQuery = {
      text: 'INSERT INTO restaurant.sandwiches (name, "breadType") VALUES ($1, $2) RETURNING *',
      values: [body.name, body.breadType]
    }

    const sandwichRes = await pool.query(addSandwichQuery);

    const toppingResults = await addToppingsToSandwich(sandwichRes.rows[0].id, body.toppings);

    await pool.query('COMMIT');

    console.log(sandwichRes.rows[0]);
    console.log(toppingResults);
    const sandwich = sandwichRes.rows[0];
    sandwich.toppings = toppingResults;
    return sandwich;
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    throw err;
  }
}

//  Deletes a sandwich
exports.deleteSandwich = async function(sandwichId, api_key) {

  await validateApiKey(api_key);
  
  const deleteSandwichQuery = {
    text: 'DELETE FROM restaurant.sandwiches WHERE id = $1 RETURNING *',
    values: [sandwichId]
  }

  const deleteToppingsQuery = {
    text: 'DELETE FROM restaurant.sandwich_toppings WHERE "sandwichId" = $1',
    values: [sandwichId]
  }

  return pool.query('BEGIN')
    .then(() => pool.query(deleteToppingsQuery))
    .then(() => pool.query(deleteSandwichQuery))
    .then(res => {
      if (!res.rows[0]) {
        throw SANDWICHNOTFOUNDERROR;
      }
      console.log(res.rows[0]);
      return pool.query('COMMIT')
        .then(() => res.rows[0]);
    })
    .catch(err => {
      console.error(err);
      pool.query('ROLLBACK');

      if (err === SANDWICHNOTFOUNDERROR) {
        throw SANDWICHNOTFOUNDERROR;
      } else if (err.code === '23503') {
        // Foreign key constraint error
        throw {type: 'SandwichInUseError', message: 'Conflict, sandwich is being referenced in an order'};
      } else {
        // Some other database error
        throw DATABASE_ERROR;
      }
    });
}

// Find sandwich by ID
exports.getSandwichById = async function(sandwichId) {
  
  const sandwichByIdQuery = {
    text: 'SELECT * FROM restaurant.sandwiches WHERE id = $1',
    values: [sandwichId]
  }

  try {
    const res = await pool.query(sandwichByIdQuery);
    if (!res.rows[0]) {
      throw SANDWICHNOTFOUNDERROR;
    }
    const sandwich = res.rows[0];
    sandwich.toppings = await getToppingsForSandwich(sandwichId);
    return sandwich;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Get a list of all sandwiches. Empty array if no sandwiches are found.
exports.getSandwiches = async function() {

  const allSandwichesQuery = {
    text: 'SELECT * FROM restaurant.sandwiches',
  }

  try {
    const res = await pool.query(allSandwichesQuery);
    console.log(res.rows);

    const sandwiches = res.rows;
    for (let sandwich of sandwiches) {
      sandwich.toppings = await getToppingsForSandwich(sandwich.id);
    }
    return sandwiches;
  } catch (err) {
    console.log(err.stack);
    throw err;
  }
}

//  Updates a sandwich in the store with JSON in body
exports.updateSandwich = async function(sandwichId,body,api_key) {

    await validateApiKey(api_key);

    await pool.query('BEGIN');

    try {
      const updateSandwichQuery = {
        text: 'UPDATE restaurant.sandwiches SET name = $1, "breadType" = $2 WHERE id = $3 RETURNING *',
        values: [body.name, body.breadType, sandwichId]
      }
  
      const deleteToppingsQuery = {
        text: 'DELETE FROM restaurant.sandwich_toppings WHERE "sandwichId" = $1',
        values: [sandwichId]
      }
  
      const sandwichRes = await pool.query(updateSandwichQuery);
  
      if (!sandwichRes.rows[0]) {
        throw SANDWICHNOTFOUNDERROR;
      }
  
      await pool.query(deleteToppingsQuery);
  
      const toppingResults = await addToppingsToSandwich(sandwichId, body.toppings);
  
      await pool.query('COMMIT');
  
      console.log(sandwichRes.rows[0]);
      const sandwich = sandwichRes.rows[0];
      sandwich.toppings = toppingResults;
      return sandwich;
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error(err);
      throw err;
    }
  }