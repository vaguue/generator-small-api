const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-koa-esm-api:app', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({ appname: 'test-app' });
  });

  it('creates files', () => {
    assert.file(['app.js']);
  });
});
