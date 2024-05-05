'use strict';

var utils = require('../utils/writer.js');
var Order = require('../service/OrderService');

var sendTask = require('../rabbit-utils/sendTask.js')
var receiveTask = require('../rabbit-utils/receiveTask.js')

module.exports.addOrder = function addOrder (req, res, next) {
  var order = req.swagger.params['order'].value;
  console.log("POSTing order: ", order);
  Order.addOrder(order)
  .then(function (response) {
    utils.writeJson(res, response, 200);
    console.log("palauttaa", response);
    // Let's add the order to a queue
    sendTask.addTask("rapid-runner-rabbit", "received-orders", response);

  })
  .catch(function (response) {
    console.log("error", response);
    utils.writeJson(res, response, 400);
  });
};


module.exports.getOrderById = function getOrderById (req, res, next) {
  var orderId = req.swagger.params['orderId'].value;
  Order.getOrderById(orderId)
    .then(function (response) {
      // Handle success
      utils.writeJson(res, response, 200);
    })
    .catch(function (error) {
      // Handle error not found error from service
      if (error.type === 'OrderNotFoundError') {
        utils.writeJson(res, { error: error.message }, 404);
      }
    });
};

module.exports.getOrders = function getOrders (req, res, next) {
  Order.getOrders()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      console.log("error", response);
      utils.writeJson(res, response);
    });
};
