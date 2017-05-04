const { isNode } = require('./detect');

module.exports = () => {
  if (isNode()) {
    const path = require('path');
    return require('fs').readFileSync(path.join(__dirname, 'socketCluster.proto'), 'utf8');
  } else {
    return require('./socketCluster.proto');
  }
};
