'use strict';
const should = require('should');
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
       result.should.have.property('id', tenantId);
       done();
    }).catch((err) => {
      done(err);
    });
  });



  after(() => {

  });
});
