var validator = require('validator');
var crypto = require('crypto');
var config = require('config');
var clone = require('clone');

validator.extend('isDefined', function (obj) {
  return obj !== undefined && obj != null && obj != '';
});

validator.extend('isSigned', function (signature, obj) {
  var verifier = crypto.createVerify(config.get('signature.algorithm'));

  var content = clone(obj, false, 1);
  delete content['signature'];

  verifier.update(JSON.stringify(content));

  return verifier.verify(obj.key, signature, 'base64');
});

module.exports = validator;