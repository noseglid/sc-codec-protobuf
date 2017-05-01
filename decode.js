const debug = require('debug')('sc-codec-protobuf:decode');
const { Reader } = require('protobufjs');
const { createBuffer } = require('./buffer');

module.exports = (messageTypes, rrMapping) => (encoded) => {
  const localBuffer = createBuffer(encoded);
  const reader = new Reader(localBuffer);
  const id = reader.bytes()[0];

  debug('Decoding message type: %o, (Buffer size %o)', id, localBuffer.length);

  try {
    const messageType = messageTypes.getById(id);
    if (!messageType) {
      throw new Error(`Unable to map id ${id} to any message. Do you have the same codec on server and client?`);
    }
    const message = messageType.request.id === id ? messageType.request : messageType.response;

    // Special special because they are literally strings in socketcluster protocol
    if (message.type.fullName === '.socketcluster.builtins.Ping') {
      debug('Decoded to ping');
      return '#1';
    }
    if (message.type.fullName === '.socketcluster.builtins.Pong') {
      debug('Decoded to pong');
      return '#2';
    }

    let decoded = message.type.decode(reader).toObject();
    if (message.transform.decode) {
      decoded = message.transform.decode(decoded);
    }

    debug('Decoded to: %o', decoded);

    if (undefined !== decoded.cid) {
      rrMapping.set(decoded.cid, messageType);
    }

    return decoded;

  } catch(err) {
    debug(err);
  }
};
