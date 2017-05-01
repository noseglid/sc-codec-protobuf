module.exports = [
  {
    event: '#handshake',
    request: '.socketcluster.builtins.HandshakeRequest',
    response: '.socketcluster.builtins.HandshakeResponse'
  },

  {
    event: '#disconnect',
    request: '.socketcluster.builtins.Disconnect'
  },

  {
    event: '#ping',
    request: '.socketcluster.builtins.Ping',
    response: '.socketcluster.builtins.Pong'
  },

  {
    event: '#subscribe',
    request: '.socketcluster.builtins.SubscribeRequest',
    response: '.socketcluster.builtins.SubscribeResponse',
    transform: {
      request: {
        encode: (object) => {
          const cloned = JSON.parse(JSON.stringify(object));
          cloned.data.data = JSON.stringify(object.data.data);
          return cloned;
        },
        decode: (object) => {
          const cloned = JSON.parse(JSON.stringify(object));
          cloned.data.data = JSON.parse(object.data.data);
          return cloned;
        }
      }
    }
  },

  {
    event: '#unsubscribe',
    request: '.socketcluster.builtins.Unsubscribe'
  }
];
