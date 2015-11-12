var express = require('express');
var moment = require('moment');

var middlewares = require('./middlewares');
var errors = require('./errors');
var db = require('./database');

var router = express.Router();

router.get('/', middlewares.checkUsername, function (req, res, next) {
  db.get(req.query.username)
    .then(function (user) {
      if(user) {
        res.append('Content-Type', 'application/json');
        res.send(user).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(function (err) {
      next(err);
    });
});

router.all('*', middlewares.checkSignature);

router.delete('/', function (req, res, next) {
  db.get(req.body.username)
    .then(function (user) {
      if(!user) {
        res.status(404).end();
        return;
      }

      if(user.key != req.body.key) {
        next(new errors.ParamError('wrong.key'));
        return;
      }

      //TODO: add delete flag

      return db.del(req.body.username)
        .then(function () {
          res.status(201).end();
        });
    })
    .catch(function (err) {
      next(err);
    });
});

router.all('*', middlewares.checkUserBody);

router.put('/', function (req, res, next) {
  db.get(req.body.username)
    .then(function (user) {
      if(!user) {
        res.status(404).end();
        return;
      }

      if(user.key != req.body.key) {
        next(new errors.ParamError('wrong.key'));
        return;
      }

      if(moment(user.date).isBefore(moment(req.body.date))) {
        next(new errors.ParamError('old.date'));
        return;
      }

      return db.set(req.body.username, JSON.stringify(req.body))
        .then(function () {
          res.status(201).end();
        });
    })
    .catch(function (err) {
      next(err);
    });
});

router.post('/', middlewares.checkUserKey, function (req, res, next) {
  db.set([req.body.username, JSON.stringify(req.body), 'NX'])
    .then(function (status) {
      if(status == "OK") {
        res.status(201).end();
      } else {
        next(new errors.ParamError('existing.username'));
      }
    })
    .catch(function (err) {
      next(err);
    });
});

module.exports = router;