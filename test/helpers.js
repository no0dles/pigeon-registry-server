var crypto = require('crypto');
var chai = require('chai');
var faker = require('faker');
var expect = chai.expect;
var NodeRSA = require('node-rsa');
var config = require('config');
var moment = require('moment');
var request = require('supertest');

var app = require('../app');
var database = require('../database');

faker.seed(100);

function generateKey(keySize) {
  var key = new NodeRSA({b: keySize || 1024});
  return {
    'public': key.exportKey('public'),
    'private': key.exportKey('private')
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

module.exports.dummyUser = function (username, key, eyes, nose, mouth, color, validity, date) {
  var key = (key ? key : generateKey());
  return signRequest({
    username: username || sha1(faker.internet.userName()),
    avatar: {
      eyes: eyes || 'eyes1',
      nose: nose || 'nose2',
      mouth: mouth || 'mouth1',
      color: color || '#8CC152'
    },
    key: key.public,
    validity: validity || 60,
    date: date || module.exports.currentDate(),
  }, key);
};

module.exports.currentDate = function () {
  return moment().utc().format('YYYY-MM-DDTHH:mm:ssZ');
};

module.exports.createDbUser = function (user) {
  return database.set(user.username, JSON.stringify(user));
};

module.exports.getDbUser = function (username) {
  return database.get(username).then(function (user) {
    return JSON.parse(user);
  });
};

module.exports.deleteDbUser = function (username) {
  return database.del(username);
};

function signRequest(req, key) {
  delete req.signature;
  req.signature = sign(req, key);
  return req;
};

module.exports.signRequest = signRequest;

module.exports.requestSearchUser = function (username, statusCode, callback) {
  return request(app)
    .get('/api/users?username=' + username)
    .send()
    .expect(statusCode)
    .end(callback);
};

module.exports.requestCreateUser = function (body, statusCode, callback) {
  return request(app)
    .post('/api/users/')
    .send(body)
    .expect(statusCode)
    .end(callback);
};

module.exports.requestUpdateUser = function (body, statusCode, callback) {
  return request(app)
    .put('/api/users/')
    .send(body)
    .expect(statusCode)
    .end(callback);
};

module.exports.requestDeleteUser = function (body, statusCode, callback) {
  return request(app)
    .delete('/api/users/')
    .send(body)
    .expect(statusCode)
    .end(callback);
};

module.exports.expectSuccess = function (err, res) {
  expect(res).to.be.an('object', 'res');
  expect(res.body).to.be.an('object', 'body');
  expect(res.body.code).to.be.an('undefined', 'body.code');
  expect(err).to.be.a('null', 'err');
};

module.exports.expectErrorCode = function (code, err, res) {
  expect(err).to.be.a('null', 'err');
  expect(res).to.be.an('object', 'res');
  expect(res.body).to.be.an('object', 'body');
  expect(res.body.code).to.be.an('string', 'body.code');
  expect(res.body.code).to.eql(code, 'body.code');
};

module.exports.expectUserBody = function (err, res, user) {
  expect(res.body.username).to.be.a('string', 'username');
  expect(res.body.avatar).to.be.an('object', 'avatar');
  expect(res.body.avatar.eyes).to.be.a('string', 'avatar.eyes');
  expect(res.body.avatar.nose).to.be.a('string', 'avatar.nose');
  expect(res.body.avatar.mouth).to.be.a('string', 'avatar.mouth');
  expect(res.body.avatar.color).to.be.a('string', 'avatar.color');
  expect(res.body.key).to.be.a('string', 'key');
  expect(res.body.signature).to.be.a('string', 'signature');
  expect(res.body.date).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/, 'date');
  expect(res.body.validity).to.be.a('number', 'validity');
  expect(res.body).to.eql(user, 'body');
};