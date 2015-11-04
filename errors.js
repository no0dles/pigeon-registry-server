function ParamError(message) {
  Error.captureStackTrace(this, ParamError);
  this.message = message;
}

ParamError.prototype = new Error();
ParamError.name = "ParamError";

module.exports.ParamError = ParamError;