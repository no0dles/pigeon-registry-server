var express = require('express');
var config = require('config');
var ursa = require('ursa');
var moment = require('moment');

var middlewares = require('./middlewares');
var validator = require('./validator');
var models = require('./models');
var errors = require('./errors');

var router = express.Router();

router.get('/', function (req, res, next) {
  if (!validator.isDefined(req.query.username))
    return next(new errors.ParamError('missing.username'));

  if (!validator.matches(req.query.username, /[a-z0-9]{40}/))
    return next(new errors.ParamError('invalid.username'));

  models.User.get(req.query.username)
    .then(function (user) {
      res.json(user);
    })
    .catch(models.Errors.DocumentNotFound, function () {
      res.sendStatus(404);
    })
    .error(function (err) {
      next(err);
    });
});

router.all('*', function (req, res, next) {
  if (!validator.isDefined(req.body.username))
    return next(new errors.ParamError('missing.username'));

  if (!validator.matches(req.body.username, /[a-z0-9]{40}/))
    return next(new errors.ParamError('invalid.username'));

  if (!validator.isDefined(req.body.key))
    return next(new errors.ParamError('missing.key'));

  return next();
});

router.all('*', middlewares.signature);

router.delete('/', function (req, res, next) {
  models.User.get(req.body.username)
    .then(function (user) {
      if(user.key != req.body.key) {
        return next(new errors.ParamError('wrong.key'));
      }

      return user.delete().then(function() {
        res.status(201).send();
      });
    })
    .error(function (error) {
      next(error);
    });
});

router.all('*', function (req, res, next) {
  if (!validator.isDefined(req.body.avatar))
    return next(new errors.ParamError('missing.avatar'));

  if (!validator.isDefined(req.body.avatar.eyes))
    return next(new errors.ParamError('missing.avatar.eyes'));

  if (config.get('avatar.eyes').indexOf(req.body.avatar.eyes) == -1)
    return next(new errors.ParamError('invalid.avatar.eyes'));

  if (!validator.isDefined(req.body.avatar.nose))
    return next(new errors.ParamError('missing.avatar.nose'));

  if (config.get('avatar.nose').indexOf(req.body.avatar.nose) == -1)
    return next(new errors.ParamError('invalid.avatar.nose'));

  if (!validator.isDefined(req.body.avatar.mouth))
    return next(new errors.ParamError('missing.avatar.mouth'));

  if (config.get('avatar.mouth').indexOf(req.body.avatar.mouth) == -1)
    return next(new errors.ParamError('invalid.avatar.mouth'));

  if (!validator.isDefined(req.body.avatar.color))
    return next(new errors.ParamError('missing.avatar.color'));

  if (config.get('avatar.color').indexOf(req.body.avatar.color) == -1)
    return next(new errors.ParamError('invalid.avatar.color'));

  return next();
});

router.put('/', function (req, res, next) {
  models.User.get(req.body.username)
    .then(function (user) {
      if(user.key != req.body.key) {
        return next(new errors.ParamError('wrong.key'));
      }

      if(moment(user.date).isBefore(moment(req.body.date))) {
        return next(new errors.ParamError('old.date'));
      }

      return user.merge(req.body).save().then(function() {
        res.status(201).send();
      });
    })
    .catch(models.Errors.DocumentNotFound, function () {
      res.sendStatus(404);
    })
    .error(function (error) {
      next(error);
    });
});


router.post('/', function (req, res, next) {
  var key = ursa.coerceKey(req.body.key);

  if(!ursa.isPublicKey(key))
    return next(new errors.ParamError('invalid.key.type'));

  if(key.getModulus().length < 128)
    return next(new errors.ParamError('invalid.key.size'));

  new models.User(req.body).save()
    .then(function () {
      res.status(201).send();
    })
    .catch(models.Errors.DuplicatePrimaryKey, function () {
      next(new errors.ParamError('existing.username'));
    })
    .error(function(error) {
      next(error);
    });
});

module.exports = router;