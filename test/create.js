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
        assert(!res.body.code, res.body.code + ' code');
        assert(res.statusCode == 201, res.statusCode + ' statusCode ');

        done();
      })
      .catch(function (err) {
        done(err);
      });
  });

  it('invalid existing username', function (done) {
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

  /*
  describe('username', function () {
    describe('invalid', function () {
      it('unhashed', function () {
        //TODO
      });

      it('special characters', function () {
        //TODO
      });

      it('integer value', function () {
        //TODO
      });

      it('boolean value', function () {
        //TODO
      });
    });
  });

  describe('key', function () {
    describe('invalid', function () {
      it('private key', function () {
        //TODO
      });

      it('random string value', function () {
        //TODO
      });

      it('integer value', function () {
        //TODO
      });

      it('boolean value', function () {
        //TODO
      });
    });

    it('512 bit key', function () {
      //TODO
    });

    it('1024 bit key', function () {
      //TODO
    });

    it('2048 bit key', function () {
      //TODO
    });

    it('4096 bit key', function () {
      //TODO
    });

    it('8192 bit key', function () {
      //TODO
    });
  });*/
});