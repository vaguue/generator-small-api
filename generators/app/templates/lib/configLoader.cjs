module.exports = function(source) {
  return `module.exports=JSON.parse('${JSON.stringify(this.getOptions())}')`;
};
