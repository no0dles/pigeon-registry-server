var database = require('../database');
var helpers = require('./helpers');

describe('delete', function () {
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
      helpers.requestDeleteUser(user, 201, function (err, res) {
        helpers.expectSuccess(err, res);
      });
    });
  });

  it('non existing user', function () {
    var user = helpers.dummyUser();
    helpers.requestDeleteUser(user, 404, function (err, res) {
      helpers.expectSuccess(err, res);
    });
  });

  /*it('invalid key', function () {

  });

  it('no delete flag', function () {

  });*/

});