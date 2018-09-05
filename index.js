const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const util = require('util');
// const routes = require('./routes');

// const { PORT } = require('../config');
const validateConfig = require('./src/validate-config');
const controllers = require('./src/web/controllers');

require('colors');

const app = express();

try {
  validateConfig();
} catch (e) {
  console.error('Failed to start:'.red, e.message);
  console.error('  See the readme for configuration information');
  process.exit(1);
}
console.log('Config is valid'.cyan);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log('Request:'.cyan, req.method, util.inspect(req.url).magenta);
  console.log(' Headers:'.cyan, util.inspect(req.headers));
  console.log(' Body:'.cyan, util.inspect(req.body));
  console.log(' Query:'.cyan, util.inspect(req.query));
  next();
});
app.use('/github/openid', controllers);

// routes(app);
// app.listen('8090');
// console.log(`Listening on ${PORT}`.cyan);

module.exports.handler = serverless(app, {
    request (request, event, context) {
        // Transfer context from Lambda Event to HTTP request object
        request.context = event.requestContext;
    },
});
