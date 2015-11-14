var logentries = require('le_node');
var winston = require('winston');
var config = require('config');

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
      port: 10458
    })
  ],
  exitOnError: false
});

var token = process.env.LE_TOKEN || config.get('logentries.token');
if(token) {
  logger.transports.add(
    new winston.transports.Logentries({
      token: token
    })
  );
}

logger.stream = {
  write: function(message, encoding){
    logger.info(message);
  }
};

module.exports = logger;