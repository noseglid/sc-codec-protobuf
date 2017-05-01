const debug = require('debug')('sc-codec-protobuf:encode');
const { Writer } = require('protobufjs');
const { createBuffer } = require('./buffer');

module.exports = (messageTypes, rrMapping) => (plain) => {
  try {

    debug('Encoding %o', plain);
    let messageType = null;
    let message = null;

    if ('String' === plain.constructor.name) {

      if ('#1' === plain) {
        messageType = messageTypes.getByEvent('#ping');
        message = messageType.request;
        plain = {};
      }
      if ('#2' === plain) {
        messageType = messageTypes.getByEvent('#ping');
        message = messageType.response;
        plain = {};
      }

    } else if (plain.event) {
      messageType = messageTypes.getByEvent(plain.event);
      message = messageType.request;
    } else if (plain.rid) {
      messageType = rrMapping.get(plain.rid);
      if (!messageType) {
        debug('Unexpected rid received: %o', plain);
        throw new Error(`Unexpected rid recieved ${plain.rid}`);
      }
      message = messageType.response;
    } else {
      throw new Error('No Protbuf spec.');
    }

    debug('Resolved encoding to type: %o (id: %o)', message.type.fullName, message.id);

    const writer = new Writer().bytes(createBuffer([ message.id ]));

    if (message.type) {

      if (message.transform.encode) {
        plain = message.transform.encode(plain);
      }

      const err = message.type.verify(plain);
      if (null !== err) {
        debug('Object does not fit protobuf of type %o (%o). Object: %o', message.type.constructor.name, err, plain);
        throw new Error(`Invalid message: ${err}`);
      }

      message.type.encode(message.type.create(plain), writer);
    }

    return writer.finish();
  } catch (err) {
    debug(err);
  }
};
