'use strict';

var utils = require('../utils/writer.js');
var Sandwich = require('../service/SandwichService');

module.exports.addSandwich = function addSandwich (req, res, next) {
  var body = req.swagger.params['body'].value;
  var api_key = req.swagger.params['api_key'].value;
  Sandwich.addSandwich(body,api_key)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (error) {
      next(error);
    });
};

module.exports.deleteSandwich = function deleteSandwich (req, res, next) {
  var sandwichId = req.swagger.params['sandwichId'].value;
  var api_key = req.swagger.params['api_key'].value;
  Sandwich.deleteSandwich(sandwichId,api_key)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (error) {
      next(error);
    });
};

module.exports.getSandwichById = function getSandwichById (req, res, next) {
  var sandwichId = req.swagger.params['sandwichId'].value;
  Sandwich.getSandwichById(sandwichId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (error) {
      next(error);
    });
};

module.exports.getSandwiches = function getSandwiches (req, res, next) {
  Sandwich.getSandwiches()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (error) {
      next(error);
    });
};

module.exports.updateSandwich = function updateSandwich (req, res, next) {
  var sandwichId = req.swagger.params['sandwichId'].value;
  var body = req.swagger.params['body'].value;
  var api_key = req.swagger.params['api_key'].value;
  Sandwich.updateSandwich(sandwichId,body,api_key)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (error) {
      next(error);
    });
};
