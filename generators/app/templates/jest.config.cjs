const path = require('path');
const _ = require('lodash');
const packageConfig = require('./package.json');

const aliases = _.transform(packageConfig.aliases || {}, (res, val, key) => {
  res[`^${key}(.*)$`] = `<rootDir>/${val}$1`;
}, {})

module.exports = {
  forceExit: true,
  //detectOpenHandles: true,
  preset: '@shelf/jest-mongodb',
  rootDir: path.resolve(__dirname),
  collectCoverage: true,
  moduleNameMapper: aliases,
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {},
}
