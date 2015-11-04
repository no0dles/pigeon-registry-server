var should = require('should');
var assert = require('assert');
var request = require('supertest');
var crypto = require('crypto');
var moment = require('moment');
var Promise = require('bluebird');
var ursa = require('ursa');
var config = require('config');

var models = require('../models');
var app = require('../app');

describe('api', function() {
  describe('users', function () {
    describe('search', function () {
      it('for non existing username', function (done) {
        var shasum = crypto.createHash('sha1');
        shasum.update("foo");

        request(app) //'http://localhost')
            .get('/api/users?username=' + shasum.digest('hex'))
            .send()
            .expect(404)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                done();
            });
      });

      it('for existing username', function () {

      });
    });

    describe('create', function () {
      beforeEach(function (done) {
        models.User.run().then(function (result) {
          var promises = [];

          for(var i = 0; i < result.length; i++) {
            promises.push(result[i].delete());
          }

          Promise.all(promises).then(function () {
            done();
          });
        })
      });

      it('a user', function (done) {
        var shasum = crypto.createHash('sha1');
        shasum.update("pascal");

        var keys = ursa.generatePrivateKey(1024);

        var body = {
          username: shasum.digest('hex'),
          avatar: {
            eyes: 'eyes1',
            nose: 'nose2',
            mouth: 'mouth1',
            color: '#8CC152'
          },
          key: keys.toPublicPem('binary'),
          validity: 60,
          date: moment().utc().format('YYYY-MM-DDTHH:mm:ssZ'),
        };

        var sign = crypto.createSign(config.get('signature.algorithm')).update(JSON.stringify(body));

        body.signature = sign.sign(keys.toPrivatePem('binary'), 'base64');

        request(app)
            .post('/api/users/')
            .send(body)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                console.log(res.body);

                done();
            });
      });
    });
  });
});