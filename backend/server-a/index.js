'use strict';

require('dotenv').config();

var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    cors = require('cors');

var app = require('connect')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = 8080;

const receiveTask = require('./rabbit-utils/receiveTask')

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

app.use(cors());

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Add a middleware to handle Swagger validation errors aka invalid types
  app.use(function (err, req, res, next) {
    if (err) {
      // Wrong types of parameters land here because of swagger handling it.
      if (err.status === 400 && err.name === 'ValidationError') {
          console.error('Validation error: ', err.message);
          res.writeHead(400);
      } else if (err.type === 'OrderNotFoundError') {
        res.writeHead(404);
      } else if (err.type === 'ToppingNotFoundError') {
        res.writeHead(404);
      } else if (err.type === 'SandwichNotFoundError') {
        res.writeHead(404);
      } else if (err.type === 'ApiKeyInvalidError') {
        res.writeHead(401);
      } else if (err.type === 'SandwichInUseError') {
        res.writeHead(409);
      } else if (err.type === 'DatabaseError') {
        res.writeHead(500);
      }
      // Add error message to the response
      res.write(JSON.stringify({message: err.message}));
      res.end();
    } else {
      next(err);
    }
  });

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  receiveTask.getTask('rapid-runner-rabbit', 'handled-orders');

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

});
