var express = require('express');
var bodyParser = require('body-parser');
var config = require('config');
var morgan = require("morgan");

var users = require('./routes/users');
var version = require('./routes/version');
var health = require('./routes/health');

var errors = require('./errors');
var log = require('./log');

var app = express();


app.log = log;

app.set('address', process.env['OPENSHIFT_NODEJS_IP'] || config.get('express.address'));
app.set('port', process.env['OPENSHIFT_NODEJS_PORT'] || config.get('express.port'));

app.set('trust proxy', function (ip) {
  if (ip === process.env['OPENSHIFT_NODEJS_IP']) return true;
  else return false;
});

app.use(morgan("combined", { "stream": log.stream }));
app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/version', version);
app.use('/api/health', health);

app.use(function (req, res) {
  res.status(404).end();
});

app.use(function(err, req, res, next) {
  if(err instanceof errors.ParamError) {
    app.log.warn(err.message);
    res.status(400).json({
      code: err.message
    });
  } else {
    app.log.error(err.stack);
    res.status(500).json({
       code: 'server.error'
    });
  }

  next();
});

module.exports = app;