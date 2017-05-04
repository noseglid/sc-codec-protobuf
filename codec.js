const debug = require('debug')('sc-codec-protobuf:codec');
const { parse, Root } = require('protobufjs');
const socketClusterProto = require('./socketClusterProto');
const MessageTypes = require('./MessageTypes');
const RequestResponseMapping = require('./RequestResponseMapping');
const socketClusterEvents = require('./socketClusterEvents');

module.exports = (...protobufs) => {
  const pbRoot = new Root();
  [ ...protobufs, socketClusterProto() ].forEach(protobuf => parse(protobuf, pbRoot));

  const rrMapping = new RequestResponseMapping();
  const messageTypes = new MessageTypes(pbRoot);

  socketClusterEvents.forEach(({ event, request, response, transform }) => {
    messageTypes.addEvent(event, request, response, transform);
  });

  return {
    encode: require('./encode')(messageTypes, rrMapping),
    decode: require('./decode')(messageTypes, rrMapping),
    messageTypes,
    pbRoot
  };
};
