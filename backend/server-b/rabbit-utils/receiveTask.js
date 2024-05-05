#!/usr/bin/env node
// Process tasks from the work queue
// in our case an order for a sandwich

'use strict';

var amqp = require('amqplib');
const sendTask = require('./sendTask');

// Randomly decide if the chef makes a good sandwich
function makeGoodSandwich() {
  // Not a very talented chef, since half of the sandwiches fail
  // Reasoning: equal class probabilities for testing purposes
  return Math.random() >= 0.5;
}

module.exports.getTask = function(rabbitHost, queueName){
  amqp.connect('amqp://' + rabbitHost).then(function(conn) {
    process.once('SIGINT', function() { conn.close(); });
    return conn.createChannel().then(function(ch) {
      var ok = ch.assertQueue(queueName, {durable: true});
      ok = ok.then(function() { ch.prefetch(1); });
      ok = ok.then(function() {
        ch.consume(queueName, doWork, {noAck: false});
        console.log(new Date(), " [*] Waiting for messages. To exit press CTRL+C");
      });
      return ok;

      function doWork(msg) {
        var body = msg.content.toString();
        console.log(" [x] Received '%s'", body);

        // Parse the message body from string to JavaScript object
        var obj = JSON.parse(body);

        // We use a function to decide if the sandwich is good or bad. Good sandwich
        // is ready for the customer and bad means it failed.
        obj.status = makeGoodSandwich() ? 'ready' : 'failed';

        setTimeout(function() {
          sendTask.addTask('rapid-runner-rabbit', 'handled-orders', obj);
          console.log(new Date(), " [x] Done");
          ch.ack(msg);
        }, 10000);
      }
    });
  }).catch(console.warn);
}
