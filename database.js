var config = require('config');
var redis = require('redis');

var client = redis.createClient({
  host: process.env['OPENSHIFT_REDIS_DB_HOST'] || config.get('redis.host'),
  port: process.env['OPENSHIFT_REDIS_DB_PORT'] || config.get('redis.port'),
  auth_pass: process.env['OPENSHIFT_REDIS_PASSWORD'] || config.get('redis.auth')
});

module.exports.redis = redis;
module.exports.client = client;

function callback(resolve, reject) {
  return function (err, response) {
    if(err) {
      reject(err);
    } else {
      resolve(response);
    }
  };
}

module.exports.set = function (key, value) {
  return new Promise(function (resolve, reject) {
    if (Array.isArray(key)) {
      client.set(key, callback(resolve, reject));
    } else {
      client.set(key, value, callback(resolve, reject));
    }
  });
};

module.exports.del = function (key) {
  return new Promise(function (resolve, reject) {
    client.del(key, callback(resolve, reject));
  });
};

module.exports.get = function (key) {
  return new Promise(function (resolve, reject) {
    client.get(key, callback(resolve, reject));
  });
};

module.exports.flushdb = function () {
  return new Promise(function (resolve, reject) {
    client.flushdb(callback(resolve, reject));
  });
};