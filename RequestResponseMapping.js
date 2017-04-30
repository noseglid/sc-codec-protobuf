const debug = require('debug')('sc-codec-protobuf:RequestResponseMapping');

class RequestResponseMapping {
  constructor() {
    this._mapping = {};
  }

  set(id, responseType) {
    debug('setting %o to %o', id, responseType);
    this._mapping[id] = responseType;
  }

  get(id) {
    debug(this._mapping);
    const responseType = this._mapping[id];
    if (!responseType) {
      return null;
    }

    delete this._mapping[id];
    return responseType;
  }
}

module.exports = RequestResponseMapping;
