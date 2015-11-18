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

  it('existing user', function (done) {
    var key = helpers.generateKey();
    var user = helpers.dummyUser(helpers.sha1('foo'), key);

    helpers.createDbUser(user).then(function () {
      user.delete = true;
      user = helpers.signRequest(user, key);

      helpers.requestDeleteUser(user, 201, function (err, res) {
        helpers.expectSuccess(err, res);
        done();
      });
    });
  });

  it('without flag', function (done) {
    var user = helpers.dummyUser();
    helpers.createDbUser(user).then(function () {
      helpers.requestDeleteUser(user, 400, function (err, res) {
        helpers.expectErrorCode('invalid.delete', err, res);
        done();
      });
    });
  });

  it('non existing user', function (done) {
    var key = helpers.generateKey();
    var user = helpers.dummyUser(helpers.sha1('notexisting'), key);
    user.delete = true;
    user = helpers.signRequest(user, key);

    helpers.requestDeleteUser(user, 404, function (err, res) {
      helpers.expectSuccess(err, res);
      done();
    });
  });

  /*it('invalid key', function () {

  });

  it('no delete flag', function () {

  });*/

});