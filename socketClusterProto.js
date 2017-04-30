const { isNode } = require('./detect');

module.exports = () => {
  if (isNode()) {
    return require('fs').readFileSync('./socketCluster.proto', 'utf8');
  } else {
    return require('./socketCluster.proto');
  }
};
