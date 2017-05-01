import socketCluster from 'socketcluster-client';
import codec from '../codec';

var socket = socketCluster.connect({
  port: 8000,
  codecEngine: codec()
});

socket.on('stuff', () => {});
