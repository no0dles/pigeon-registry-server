var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.use('/api', router);

module.exports = app;