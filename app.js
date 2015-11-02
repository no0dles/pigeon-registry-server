var express = require('express');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var config = require('config');

var routes = require('./routes');

var app = express();

app.set('port', config.get('web_port'));

app.use(bodyParser.json());
app.use(validator({
    errorFormatter: function (param, msg, value) {
        return {
            param : param,
            code   : msg
        };
    }
}));
app.use('/api/users', routes);

module.exports = app;