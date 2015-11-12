var helpers = require('./helpers');
var database = require('../database');

describe('create', function () {

  beforeEach(function (done) {
    database.flushdb().then(function () {
      done();
    }).catch(function (err) {
      done(err);
    });
  });

  it('valid user', function (done) {
    var user = helpers.dummyUser();
    helpers.requestCreateUser(user, 201, function (err, res) {
      helpers.expectSuccess(err, res);
      done();
    });
  });

  it('user with existing username', function (done) {
    var user = helpers.dummyUser(helpers.sha1('foo'));
    helpers.requestCreateUser(user, 201, function (err, res) {
      helpers.expectSuccess(err, res);
      helpers.requestCreateUser(user, 400, function (err, res) {
        helpers.expectErrorCode('existing.username', err, res);
        done();
      })
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