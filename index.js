var app = require('./app');

var server = app.listen(app.get('port'), app.get('address'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});