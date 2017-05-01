function isNode() {
  return process && process.versions && process.versions.node;
}

module.exports = {
  isNode
};
