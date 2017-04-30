const debug = require('debug')('socketcluster-api:codec');
const { Reader } = require('protobufjs');
const { createBuffer } = require('./buffer');

module.exports = (messageTypes, rrMapping) => (encoded) => {
  const localBuffer = createBuffer(encoded);
  const reader = new Reader(localBuffer);
  const id = reader.bytes()[0];

  debug('Decoding message of type: %o, (Buffer of size %o)', id, localBuffer.length);

  try {
    let messageType = messageTypes.getById(id);
    if (!messageType) {
      throw new Error(`Unable to map id ${id} to any message. Do you have the same codec on server and client?`);
    }

    const decoded = messageType.message.decodeDelimited(reader).toObject();
    debug('Decoded to: %o', decoded);

    if (undefined !== decoded.cid) {
      rrMapping.set(decoded.cid, messageType.message.fullName.replace(/Request$/, 'Response'));
    }
    return decoded;

    // switch (type) {
    //   case MESSAGE_TYPES.HANDSHAKE_REQUEST.type: {
    //     message = MESSAGE_TYPES.HANDSHAKE_REQUEST.message.decodeDelimited(reader);
    //     const decoded = message.toObject();
    //     debug('Decoded: %o', decoded);
    //     ridMapping[decoded.cid] = MESSAGE_TYPES.HANDSHAKE_RESPONSE;
    //     return decoded;
    //   }
  // 
  //     case MESSAGE_TYPES.HANDSHAKE_RESPONSE.type: {
  //       message = MESSAGE_TYPES.HANDSHAKE_RESPONSE.message.decodeDelimited(reader);
  //       break;
  //     }
  // 
  //     case MESSAGE_TYPES.PING.type: {
  //       return '#1';
  //     }
  // 
  //     case MESSAGE_TYPES.PONG.type: {
  //       return '#2';
  //     }
  // 
  //     case MESSAGE_TYPES.DISCONNECT.type: {
  //       message = MESSAGE_TYPES.DISCONNECT.message.decodeDelimited(reader);
  //       break;
  //     }
  // 
  //     default: {
  //       debug('Unknown message type: %o -> %o', type, reader);
  //       return null;
  //     }
  //   }
  // 
  //   const decoded = message.toObject();
  //   debug('Decoded: %o', decoded);
  //   return decoded;

  } catch(err) {
    debug(err);
  }
};
