const debug = require('debug')('sc-codec-protobuf:RequestResponseMapping');

class RequestResponseMapping {
  constructor() {
    this._mapping = {};
  }

  set(id, responseType) {
    this._mapping[id] = responseType;
  }

  get(id) {
    const responseType = this._mapping[id];
    if (!responseType) {
      return null;
    }

    delete this._mapping[id];
    return responseType;
  }
}

module.exports = RequestResponseMapping;
