const http = require('http');
const debug = require('debug')('sc-codec-protobuf:server');
const socketClusterServer = require('socketcluster-server');
const codec = require('./codec');

const port = 8000;

const httpServer = http.createServer();
const scServer = socketClusterServer.attach(httpServer);
scServer.setCodecEngine(codec());

scServer.on('connection', (socket) => {
  debug('websocket connection received');
});

httpServer.listen(port, '0.0.0.0', () => {
  debug('listening on %o', port);
});
