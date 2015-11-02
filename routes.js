var express = require('express');

var models = require('./models');
var middlewares = require('./middlewares');

var router = express.Router();

router.get('/', function(req, res, next) {
    req.checkQuery('username', 'missing.username').notEmpty();
    //req.checkQuery('username', 'invalid.username').len(40, 40);

    var errors = req.validationErrors();
    if (errors) {
        return res.json(errors);
    }

    models.User.get(req.query.username).then(function (user) {
        res.json(user);
    }).catch(models.Errors.DocumentNotFound, function() {
        res.sendStatus(404);
    })
    .error(function(error) {
        next(error);
    });
});

router.all('*', middlewares.signature);

router.post('/', function (req, res, next) {
    req.checkBody('username', 'missing.username').notEmpty();
    req.checkBody('avatar', 'missing.avatar').notEmpty();
    req.checkBody('avatar.eyes', 'missing.avatar.eyes').notEmpty();
    req.checkBody('avatar.nose', 'missing.avatar.nose').notEmpty();
    req.checkBody('avatar.mouth', 'missing.avatar.mouth').notEmpty();
    req.checkBody('avatar.color', 'missing.avatar.color').notEmpty();
    req.checkBody('key', 'missing.key').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.json(errors);
    }

    new models.User(req.body.data).save().then(function () {
        res.send(201);
    })
    .error(function(error) {
        next(error);
    });
});

module.exports = router;