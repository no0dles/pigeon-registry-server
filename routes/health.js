var express = require('express');

require('./users');
require('./version');

var db = require('./../database');

var router = express.Router();

router.get('/', function (req, res) {
  res.status(200).end();
});

router.get('/redis', function (req, res) {
  if(db.client.connected) {
    res.status(200).end();
  } else {
    res.status(500).end();
  }
});

module.exports = router;