var assert = require('assert');
var helpers = require('./helpers');


describe('create', function () {
  beforeEach(function (done) {
    helpers.deleteAllDbUsers()
      .then(function () {
        done();
      });
  });

  it('dummy user', function (done) {
    helpers.createUser(helpers.dummyUser())
      .then(function(res) {
        assert(res.statusCode == 201);
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });

  it('unique username', function (done) {
    helpers.createUser(helpers.dummyUser(helpers.sha1('foo')))
      .then(function(res) {
        assert(res.statusCode == 201, '[1] ' + res.statusCode + ' statusCode ');

        return helpers.createUser(helpers.dummyUser(helpers.sha1('foo')))
          .then(function(res) {
            assert(res.statusCode == 400, '[2] ' + res.statusCode + ' statusCode ');

            done();
          });
      })
      .catch(function (err) {
        done(err);
      });
  });
});