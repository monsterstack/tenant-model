'use strict';

const uuid = require('uuid');
const model = require('../index.js').model;
const Tenant = model.Tenant;

/**
 * Tenant model
 * Save test
 */
describe('tenant-model:get', () => {
  let id = uuid.v1();
  before((done) => {
    done();
    });

  let tenantId = '5877f5743266a020027dd532';

  it('getting test tenant', (done) => {
     model.findTenant(tenantId).then((result) => {
      done();
    }).catch((err) => {
      assert(err === null, "Failure did not occur");
      done(err);
    });
  });



  after(() => {

  });
});
