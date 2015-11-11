var express = require('express');
var bodyParser = require('body-parser');
var config = require('config');

var routes = require('./routes');
var errors = require('./errors');

var app = express();

app.set('address', process.env['OPENSHIFT_NODEJS_IP'] || config.get('express.address'));
app.set('port', process.env['OPENSHIFT_NODEJS_PORT'] || config.get('express.port'));

app.use(bodyParser.json());

app.use('/api/users', routes);

app.use(function(err, req, res, next) {
    if(err instanceof errors.ParamError) {
        res.status(400).json({
            code: err.message
        });
    } else {
        console.log(err);
        console.log(err.stack);

        res.status(500).json({
           code: 'server.error'
        });
    }

    next();
});

module.exports = app;