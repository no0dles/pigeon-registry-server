var winston = require('winston');

require('winston-papertrail').Papertrail;

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'error',
      handleExceptions: true,
      json: false,
      colorize: true
    }),
    new winston.transports.Papertrail({
      host: 'logs3.papertrailapp.com',
      port: 10458,
      colorize: true,
      logFormat: function(level, message) {
        return '[' + level + '] ' + message;
      }
    })
  ],
  exitOnError: false
});

logger.stream = {
  write: function(message, encoding){
    logger.info(message);
  }
};

module.exports = logger;