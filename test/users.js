var should = require('should');
var assert = require('assert');
var request = require('supertest');
var crypto = require('crypto')

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

            it('a user', function (done) {
                request(app) //'http://localhost')
                    .post('/api/users')
                    .send({
                        username: 'pascal'
                    })
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