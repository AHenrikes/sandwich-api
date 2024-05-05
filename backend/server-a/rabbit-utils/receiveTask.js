#!/usr/bin/env node
// Process tasks from the work queue

'use strict';

var amqp = require('amqplib');
const OrderService = require('../service/OrderService');

module.exports.getTask = function(rabbitHost, queueName){
  amqp.connect('amqp://' + rabbitHost).then(function(conn) {
    process.once('SIGINT', function() { conn.close(); });
    return conn.createChannel().then(function(ch) {
      var ok = ch.assertQueue(queueName, {durable: true});
      ok = ok.then(function() { ch.prefetch(1); });
      ok = ok.then(function() {
        ch.consume(queueName, doWork, {noAck: false});
        console.log(" [*] Waiting for messages. To exit press CTRL+C");
      });
      return ok;

      function doWork(msg) {
        var body = msg.content.toString();
        console.log(" [x] Received '%s'", body);
        
        var order = JSON.parse(body);

        // Get the status of the received order
        let status = "unable to read status";
        try {
          status = order.status; // read status
        } catch (error) {
          console.error('Order status not found:', error);
        }

        // We expect a ready or failed status
        if (status == 'ready' || status == 'failed') {
          // Update order state in db
          OrderService.updateOrderStatus(order.id, order.status)
          .then(() => {
            console.log('Order status updated');
          })
          .catch(err => {
            console.error('Failed to update order status:', err);
          });
        } else {
          // Do nothing
          console.log('Invalid order status: ' + status);
          // The order will be left in the previous valid status
        }

        var secs = body.split('.').length - 1;
        //console.log(" [x] Task takes %d seconds", secs);
        setTimeout(function() {
          console.log(" [x] Done");
          ch.ack(msg);
        }, secs * 1000);
      }
    });
  }).catch(console.warn);
}
