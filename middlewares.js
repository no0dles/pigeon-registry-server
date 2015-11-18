var config = require('config');
var moment = require('moment');
var NodeRSA = require('node-rsa');

var validator = require('./validator');
var errors = require('./errors');

module.exports.checkUsername = function (req, res, next) {
  if (!validator.isDefined(req.query.username))
    return next(new errors.ParamError('missing.username'));

  if (!validator.matches(req.query.username, /[a-z0-9]{40}/))
    return next(new errors.ParamError('invalid.username'));

  return next();
};

module.exports.checkSignature = function(req, res, next) {
  if (!validator.isDefined(req.body.username))
    return next(new errors.ParamError('missing.username'));

  if (!validator.matches(req.body.username, /[a-z0-9]{40}/))
    return next(new errors.ParamError('invalid.username'));

  if (!validator.isDefined(req.body.key))
    return next(new errors.ParamError('missing.key'));

  if(!validator.isDefined(req.body.date))
    return next(new errors.ParamError('missing.date'));

  if(!validator.isDefined(req.body.validity))
    return next(new errors.ParamError('missing.validity'));

  if(!validator.isDefined(req.body.signature))
    return next(new errors.ParamError('missing.signature'));

  if(!validator.matches(req.body.date, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}/))
    return next(new errors.ParamError('unknown.date'));

  if(!validator.isInt(req.body.validity))
    return next(new errors.ParamError('invalid.validity'));

  var date = moment(req.body.date);

  if(!date.isValid())
    return next(new errors.ParamError('invalid.date'));

  if(Math.abs(moment().utc().diff(date, 'seconds')) > req.body.validity)
    return next(new errors.ParamError('expired.date'));

  if(!validator.isSigned(req.body.signature, req.body))
    return next(new errors.ParamError('invalid.signature'));

  return next();
};

module.exports.checkUserBody = function (req, res, next) {
  if (!validator.isDefined(req.body.avatar))
    return next(new errors.ParamError('missing.avatar'));

  if (!validator.isDefined(req.body.avatar.eyes))
    return next(new errors.ParamError('missing.avatar.eyes'));

  if (config.get('avatar.eyes').indexOf(req.body.avatar.eyes) == -1)
    return next(new errors.ParamError('invalid.avatar.eyes'));

  if (!validator.isDefined(req.body.avatar.nose))
    return next(new errors.ParamError('missing.avatar.nose'));

  if (config.get('avatar.nose').indexOf(req.body.avatar.nose) == -1)
    return next(new errors.ParamError('invalid.avatar.nose'));

  if (!validator.isDefined(req.body.avatar.mouth))
    return next(new errors.ParamError('missing.avatar.mouth'));

  if (config.get('avatar.mouth').indexOf(req.body.avatar.mouth) == -1)
    return next(new errors.ParamError('invalid.avatar.mouth'));

  if (!validator.isDefined(req.body.avatar.color))
    return next(new errors.ParamError('missing.avatar.color'));

  if (config.get('avatar.color').indexOf(req.body.avatar.color) == -1)
    return next(new errors.ParamError('invalid.avatar.color'));

  return next();
};

module.exports.checkUserKey = function (req, res, next) {
  var key = new NodeRSA(req.body.key);

  if(!key.isPublic())
    return next(new errors.ParamError('invalid.key.type'));

  if(key.getKeySize() < 512)
    return next(new errors.ParamError('invalid.key.size'));

  return next();
};