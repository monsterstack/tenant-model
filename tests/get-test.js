'use strict';

const uuid = require('uuid');
const assert = require('chai').assert;
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

  let tenantId = '5877f555426a1e1ffca3528b';

  it('getting test tenant', (done) => {
     model.findTenant(tenantId).then((result) => {
      assert(result, result);
      console.log(result);
      done();
    }).catch((err) => {
      assert(err === null, "Failure did not occur");
      done();
       });
    });



  after(() => {

  });
});
