var restify = require('restify'),
    mongojs = require('mongojs');

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3600;

if ('development' == env) {
   port = process.env.PORT || 3600;
}

if ('test' == env) {
   port = process.env.PORT || 3600;
}

if ('production' == env) {
   port = process.env.PORT || 80;
}



var server = restify.createServer({
  name: 'inReachIPCService'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.listen(port, function () {
    console.log("Server listening on port " + port);
});