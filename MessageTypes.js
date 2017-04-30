const debug = require('debug')('sc-codec-protobuf:MessageTypes');

class MessageTypes {
  constructor() {
    this._idIndex = 0;
    this._typesByName = {};
    this._typesById = {};
  }

  add(message) {
    if (this._typesByName[message.fullName]) {
      throw new Error(`${message.fullName} already registered.`);
    }

    const immutable = { id: this._idIndex, message };
    this._typesByName[message.fullName] = immutable;
    this._typesById[this._idIndex] = immutable;
    this._idIndex++;
  }

  getByName(name) {
    return this._typesByName[name];
  }

  getById(id) {
    return this._typesById[id];
  }
}

module.exports = MessageTypes;
