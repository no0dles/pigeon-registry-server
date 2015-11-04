var moment = require('moment');

var validator = require('./validator');
var errors = require('./errors');

module.exports.signature = function(req, res, next) {
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