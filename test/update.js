var database = require('../database');
var helpers = require('./helpers');
var chai = require('chai');
var expect = chai.expect;

describe('update', function () {
  beforeEach(function (done) {
    database.flushdb().then(function () {
      done();
    }).catch(function (err) {
      done(err);
    });
  });

  it('existing user', function (done) {
    var key = helpers.generateKey();
    var user = helpers.dummyUser(helpers.sha1('fritz'), key);

    helpers.createDbUser(user).then(function () {
      user.avatar.eyes = 'eyes3';
      user.date = helpers.currentDate();
      user = helpers.signRequest(user, key);

      helpers.requestUpdateUser(user, 201, function (err, res) {
        helpers.expectSuccess(err, res);
        helpers.getDbUser(user.username).then(function (updatedUser) {
          expect(user.avatar.eyes).to.eql(updatedUser.avatar.eyes, 'eyes');
          done();
        });
      });
    });
  });

  it('non existing user', function (done) {
    var user = helpers.dummyUser();
    helpers.requestUpdateUser(user, 404, function (err, res) {
      helpers.expectSuccess(err, res);
      done();
    });
  });

  /*it('existing user with diffrent key', function () {

  });

  it('existing user with date older than in database', function () {

  });*/
});