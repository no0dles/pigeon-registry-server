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

  it('existing user', function () {
    var user = helpers.dummyUser();
    helpers.createDbUser(user).then(function () {
      user.avatar.eyes = 'eyes3';
      user.date = helpers.currentDate();

      helpers.requestUpdateUser(user, 201, function (err, res) {
        helpers.expectSuccess(err, res);
        var updatedUser = helpers.getDbUser(user.username);
        expect(user.avatar.eyes).to.eql(updatedUser.avatar.eyes, 'eyes');
      });
    });
  });

  it('non existing user', function () {
    var user = helpers.dummyUser();
    helpers.requestUpdateUser(user, 404, function (err, res) {
      helpers.expectSuccess(err, res);
    });
  });

  /*it('existing user with diffrent key', function () {

  });

  it('existing user with date older than in database', function () {

  });*/
});