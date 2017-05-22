'use strict';

const should = require('should');
const uuid = require('uuid');
const model = require('../index.js').model;
const Tenant = model.Tenant;

describe('tenant-model:save', () => {
  let id = uuid.v1();
  before((done) => {
    done();
  });

  let tenant = {
    id: id,
    name: 'CCHSConnectedHome',
    timestamp: new Date(),
    apikey : 'newKey',
    apiSecret: 'newSecret',
    status: 'Active',
    services: [{name: 'DiscoveryService'}]
  };

  it('Saving test tenant', (done) => {
    var tenantModel = new Tenant(tenant);
     model.saveTenant(tenantModel).then((result) => {
       result.should.have.property('id');
       result.should.have.property('status');
       result.should.have.property('apiKey');
       result.should.have.property('apiSecret');
       result.should.have.property('status');
       result.should.have.property('services');
       done();
    }).catch((err) => {
      done(err);
    });
  });

  after(() => {

  });
});
