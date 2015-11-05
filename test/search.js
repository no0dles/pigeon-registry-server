var assert = require('assert');
var helpers = require('./helpers');

describe('search', function () {
  before(function (done) {
    helpers.deleteAllDbUsers()
      .then(function () {
        var user = helpers.dummyUser(helpers.sha1('bar'))
        return helpers.createDbUser(user);
      })
      .then(function () {
        done();
      })
      .catch(function (err) {
        done(err)
      });
  });

  after(function (done) {
    helpers.deleteAllDbUsers()
      .then(function () {
        done();
      });
  });

  it('non existing username', function (done) {
    helpers.getUser(helpers.sha1('foo'))
      .then(function (res) {
        assert(res.statusCode == 404, res.statusCode + ' status');
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });

  it('invalid username', function (done) {
    helpers.getUser('foo')
      .then(function (res) {
        assert(res.statusCode == 400, res.statusCode + ' status');
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });

  it('for existing username', function (done) {
    helpers.getUser(helpers.sha1('bar'))
      .then(function (res) {
        assert(res.statusCode == 200, res.statusCode + ' status');
        assert(res.body.username == helpers.sha1('bar'), 'invalid username');
        assert(res.body.avatar, 'missing avatar');
        assert(res.body.avatar.eyes, 'missing avatar eyes');
        assert(res.body.avatar.nose, 'missing avatar nose');
        assert(res.body.avatar.mouth, 'missing avatar mouth');
        assert(res.body.avatar.color, 'missing avatar color');
        assert(res.body.key, 'missing key');
        assert(res.body.signature, 'missing signature');
        assert(res.body.date, 'missing date');
        assert(res.body.validity, 'missing validity');
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });
});