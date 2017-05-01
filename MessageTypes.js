const debug = require('debug')('sc-codec-protobuf:MessageTypes');

class MessageTypes {
  constructor(pbRoot) {
    this._pbRoot = pbRoot;
    this._idIndex = 0;
    this._byEvent = {};
    this._byId = {};
  }

  addEvent(event, request, response, transform) {
    const immutable = {
      transform: transform,
      request: {
        event: event,
        transform: {
          encode: transform && transform.request && transform.request.encode,
          decode: transform && transform.request && transform.request.decode
        },
        type: this._pbRoot.lookupType(request),
        id: this._idIndex++
      }
    };

    if (response) {
      // Not always required, e.g. `#disconnect`
      immutable.response = {
        event: event,
        transform: {
          encode: transform && transform.response && transform.response.encode,
          decode: transform && transform.response && transform.response.decode
        },
        type: this._pbRoot.lookupType(response),
        id: this._idIndex++
      };
      this._byId[immutable.response.id] = immutable;
    }

    this._byId[immutable.request.id] = immutable;
    this._byEvent[event] = immutable;
  }

  getByEvent(event) {
    if (!this._byEvent[event]) {
      throw new Error(`No message types registered for event '${event}'.`);
    }

    return this._byEvent[event];
  }

  getById(id) {
    if (!this._byId[id]) {
      throw new Error(`No message types registered for id '${id}'.`);
    }

    return this._byId[id];
  }
}

module.exports = MessageTypes;
