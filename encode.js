const debug = require('debug')('socketcluster-api:codec');
const { Writer } = require('protobufjs');
const { createBuffer } = require('./buffer');

module.exports = (messageTypes, rrMapping) => (plain) => {
  try {
    debug('encoding %o', plain);

    let type = null;
    if (plain.event === '#handshake') {
      type = messageTypes.getByName('.socketcluster.builtins.HandshakeRequest');
    }

    if (plain.rid) {
      debug(rrMapping);
      const responseType = rrMapping.get(plain.rid);
      if (!responseType) {
        debug('Unexpected rid received: %o', plain);
        throw new Error(`Unexpected rid recieved ${plain.rid}`);
      }

      debug('resolved rid type to %o', responseType);
      type = messageTypes.getByName(responseType);
    }

    if (plain.event === '#disconnect') {
      type = messageTypes.getByName('.socketcluster.builtins.Disconnect');
    }

    if ('String' === plain.constructor.name) {
      if ('#1' === plain) {
        type = messageTypes.getByName('.socketcluster.builtins.Ping');
        plain = {};
      }

      if ('#2' === plain) {
        type = messageTypes.getByName('.socketcluster.builtins.Pong');
        plain = {};
      }
    }

    const writer = new Writer().bytes(createBuffer([ type.id ]));

    if (type.message) {
      const err = type.message.verify(plain);
      if (null !== err) {
        debug('Object does not fit protobuf of type %o (%o). Object: %o', type.message.constructor.name, err, plain);
        throw new Error(`Invalid message: ${err}`);
      }
      type.message.encodeDelimited(type.message.create(plain), writer);
    }

    return writer.finish();
  } catch (err) {
    debug(err);
  }
}
