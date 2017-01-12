'use strict';
const assert = require('chai').assert;
const model = require('../index.js').model;
const db = model.r;

/**
 * Discovery model
 * Test connection to Data Store.
 */
describe('tenant-model:connect', () => {
  before((done) => {
    done();
  });

  it('creates db when connected', () => {

    model.connect('mongodb://localhost/testDB').then((db) => {
      assert(db != null, 'db is not null');
    }).catch((err) => {
      assert(err === null, 'connect did not fail');
    });
  });

  after(() => {

  });

});
