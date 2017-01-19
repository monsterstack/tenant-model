'use strict';

const uuid = require('uuid');
const assert = require('chai').assert;
const model = require('../index.js').model;
const Tenant = model.Tenant;

/**
 * Tenant model
 * Save test
 */
describe('tenant-model:save', () => {
  let id = uuid.v1();
  before((done) => {
    done();
    });

  let tenant = {
    id: id,
    name: 'CCHSConnectedHome',
    apikey : 'newKey',
    apiSecret: 'newSecret',
    status: 'Active',
    services: [{name: 'DiscoveryService'}]
  };

  it('Saving test tenant', (done) => {
<<<<<<< HEAD
    var tenantModel = new Tenant(tenant);
     model.saveTenant(tenantModel).then((result) => {
=======
     model.saveService(tenant).then((result) => {
>>>>>>> 31b9aecf763f6cc6d744c688c51a08ee652a9e26
      console.log("save");
      console.log(result);
      assert(result, "Tenant was saved");
      done();
    }).catch((err) => {
      console.log(err);
      assert(err === null, "Failure did not occur");
      done();
       });
    });



  after(() => {

  });
});
