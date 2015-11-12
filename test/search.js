var helpers = require('./helpers');
var database = require('../database');

describe('search', function () {

  before(function (done) {
    database.flushdb().then(function () {
      return helpers.createDbUser(helpers.dummyUser(helpers.sha1('bar')));
    }).then(function () {
      done();
    }).catch(function (err) {
      done(err);
    });
  });

  it('invalid non existing', function (done) {
    helpers.requestSearchUser(helpers.sha1('foo'), 404, function (err, res) {
      helpers.expectSuccess(err, res);
      done();
    });
  });

  it('invalid unhashed', function (done) {
    helpers.requestSearchUser('foo', 400, function (err, res) {
      helpers.expectErrorCode('invalid.username', err, res);
      done();
    });
  });

  it('valid existing', function (done) {
    var username = helpers.sha1('bar');
    helpers.getDbUser(username).then(function (user) {
      helpers.requestSearchUser(username, 200, function (err, res) {
        helpers.expectSuccess(err, res);
        helpers.expectUserBody(err, res, user);
        done();
      });
    }).catch(function (err) {
      done(err);
    });
  });
});