const debug = require('debug')('sc-codec-protobuf:codec');
const { parse, Root, Type } = require('protobufjs');
const socketClusterProto = require('./socketClusterProto');
const MessageTypes = require('./MessageTypes');
const RequestResponseMapping = require('./RequestResponseMapping');

function parseNested(pbRoot, messageTypes, named) {
  if (named instanceof Type) {
    messageTypes.add(named);
  } else {
    for (let name in named.nested) {
      parseNested(pbRoot, messageTypes, named.nested[name]);
    }
  }
}

module.exports = (...protobufs) => {

  const messageTypes = new MessageTypes();
  const rrMapping = new RequestResponseMapping();
  const pbRoot = new Root();

  protobufs.unshift(socketClusterProto());
  protobufs.forEach(source => parse(source, pbRoot));

  parseNested(pbRoot, messageTypes, pbRoot);

  return {
    encode: require('./encode')(messageTypes, rrMapping),
    decode: require('./decode')(messageTypes, rrMapping)
  };
};
