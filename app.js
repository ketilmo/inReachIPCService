var restify = require('restify'),
    mongojs = require('mongojs');

var port = process.env.PORT || 3600;

var server = restify.createServer({
  name: 'inReachIPCService'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());



server.listen(port, function () {
    console.log("Server listening on port " + port);
});