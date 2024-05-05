'use strict';

const { Pool } = require('pg');
const pool = new Pool({
  user: 'user',
  host: 'database',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

exports.addOrder = function(order) {
  order.status = "received";

  const query = {
    text: 'INSERT INTO restaurant.orders ("sandwichId", status) VALUES ($1, $2) RETURNING *',
    values: [order.sandwichId, order.status],
  }

  return pool.query(query)
    .then(res => {
      console.log(res.rows[0]);
      return res.rows[0];
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
}

exports.getOrderById = function(orderId) {
  const query = {
    text: 'SELECT * FROM restaurant.orders WHERE id = $1',
    values: [orderId],
  }

  return pool.query(query)
  .then(res => {
    if (res.rows.length === 0) {
      console.log("Order not found.");
      throw { type: 'OrderNotFoundError', message: 'Order not found' };
    }
    return res.rows[0];
  })
  .catch(err => {
    console.log(err.stack);
    throw err;
  });

}

exports.getOrders = function() {
  const query = {
    text: 'SELECT * FROM restaurant.orders',
  }

  return pool.query(query)
    .then(res => res.rows)
    .catch(err => {
      console.log(err.stack);
      throw err;
    });
}

//  Update the status of an order
exports.updateOrderStatus = function(orderId, status) {
  const query = {
    text: 'UPDATE restaurant.orders SET status = $1 WHERE id = $2 RETURNING *',
    values: [status, orderId],
  }

  return pool.query(query)
    .then(res => {
      if (res.rows.length === 0) {
        console.log("Order not found.");
        throw { type: 'OrderNotFoundError', message: 'Order not found' };
      }
      return res.rows[0];
    })
    .catch(err => {
      console.log(err.stack);
      throw err;
    });
}
