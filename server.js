var http = require('http');
var app = require('./app');
var server = http.createServer(app);

server.listen(app.get('port'), function(){
  app.sockets = require('./socket.server')(server);
  console.log("Express server listening on port " + app.get('port'));
});

console.log('Server running at http://0.0.0.0:8000/');
