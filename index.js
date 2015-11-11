var app = require('./app');

for(var key in process.env) {
  console.log(key + ': ' + process.env[key]);
}

var server = app.listen(app.get('port'), app.get('address'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});