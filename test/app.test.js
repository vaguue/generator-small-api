const fs = require('fs-extra');
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

describe('generator-koa-esm-api:model', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/model')) 
      .inTmpDir(function (dir) {
        fs.copySync(path.join(__dirname, '../generators/app/templates'), dir)
      })
      .withOptions({ force: true })
      .withPrompts({ name: 'testModel' });
  });

  it('creates files', () => {
    assert.file(['models/testModel.js']);
  });
});

describe('generator-koa-esm-api:route', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/route')) 
      .inTmpDir(function (dir) {
        fs.copySync(path.join(__dirname, '../generators/app/templates'), dir)
      })
      .withOptions({ force: true })
      .withPrompts({ name: 'testRoute' });
  });

  it('creates files', () => {
    assert.file(['routes/testRoute.js']);
  });
});
