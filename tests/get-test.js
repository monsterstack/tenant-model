'use strict';

const uuid = require('uuid');
const model = require('../index.js').model;
const Tenant = model.Tenant;

describe('tenant-model:get', () => {
  let tenantId;
  before((done) => {
    let tenant = {

    };

    let tenantModel = new Tenant(tenant);
    tenantModel.save().then((result) => {
      tenantId = result.id;
      done();
    }).catch((err) => {
      done(err);
    });
  });


  it('getting test tenant', (done) => {
     model.findTenant(tenantId).then((result) => {
       if(result.id === tenantId)
          done();
       else
          done(new Error('Expected Id in saved tenant'));
    }).catch((err) => {
      assert(err === null, "Failure did not occur");
      done(err);
    });
  });



  after(() => {

  });
});
