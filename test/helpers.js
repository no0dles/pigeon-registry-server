var crypto = require('crypto');
var ursa = require('ursa');
var config = require('config');
var moment = require('moment');
var request = require('supertest');
var models = require('../models');

var app = require('../app');

function generateKey(keySize) {
  var keys = ursa.generatePrivateKey(keySize || 1024);
  return {
    'public': keys.toPublicPem('binary'),
    'private': keys.toPrivatePem('binary')
  };
};

module.exports.generateKey = generateKey;

function sha1(input) {
  var shasum = crypto.createHash('sha1');
  shasum.update(input);
  return shasum.digest('hex');
};

module.exports.sha1 = sha1;

function sign(obj, key) {
  var sign = crypto.createSign(config.get('signature.algorithm'));
  sign.update(JSON.stringify(obj));
  return sign.sign(key.private, 'base64');
};

module.exports.sign = sign;

function promiseRequest(request) {
  return new Promise(function (resolve, reject) {
    request.end(function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

module.exports.dummyUser = function (username, key, eyes, nose, mouth, color, validity, date) {
  var key = (key ? key : generateKey());
  return signRequest({
    username: username || sha1('foobar'),
    avatar: {
      eyes: eyes || 'eyes1',
      nose: nose || 'nose2',
      mouth: mouth || 'mouth1',
      color: color || '#8CC152'
    },
    key: key.public,
    validity: validity || 60,
    date: date || moment().utc().format('YYYY-MM-DDTHH:mm:ssZ'),
  }, key);
};

module.exports.createDbUser = function (user) {
  return new models.User(user).save();
};

module.exports.deleteDbUser = function (username) {
  return models.User.get(username).delete();
};

module.exports.deleteAllDbUsers = function () {
  return models.User.run().then(function (result) {
    var promises = [];

    for(var i = 0; i < result.length; i++) {
      promises.push(result[i].delete());
    }

    return Promise.all(promises);
  })
};

function signRequest(req, key) {
  req.signature = sign(req, key);
  return req;
};

module.exports.signRequest = signRequest;

module.exports.createUser = function (body) {
  return promiseRequest(
    request(app)
      .post('/api/users/')
      .send(body)
  );
};

module.exports.getUser = function (username) {
  return promiseRequest(
    request(app)
      .get('/api/users?username=' + username)
      .send()
  );
};