const { isNode } = require('./detect');

function createBuffer(input) {
  if (isNode()) {
    // Running in node
    return Buffer.from(input);
  } else {
    // Running in browser
    return new Uint8Array(input);
  }
}

module.exports = {
  createBuffer
};
