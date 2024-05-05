'use strict';

var utils = require('../utils/writer.js');
var Toppings = require('../service/ToppingsService')

module.exports.getToppings = function getToppings (req, res, next) {
  Toppings.getToppings()
    .then(toppings => {
      if (toppings.length > 0) {
        utils.writeJson(res, toppings, 200);
      } else {
        utils.writeJson(res, [], 404);
      }
    })
    .catch(function (error) {
      console.log("error", error);
      utils.writeJson(res, error);
    });
};