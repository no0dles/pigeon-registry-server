var express = require('express');
var package = require('./../package.json');

var router = express.Router();

router.get('/', function (req, res) {
  res.json({
    version: package.version
  });
});

module.exports = router;