'use strict';
const debug = require('debug')('tenant-model');
const mongoose = require('mongoose');
const uuid = require ('uuid');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const URL = 'mongodb://localhost/cdspTenant';
mongoose.connect(URL);

const tenantSchema = new Schema({
  id: String,
  name:  String,
  services: [{ name: String }],
  timestamp: Date,
  status: String,
  apiKey: String,
  apiSecret: String
});

tenantSchema.index({'$**': 'text'});

const Tenant = mongoose.model('Tenant', tenantSchema);

const saveTenant = (tenant) => {
  tenant.timestamp = new Date();
  let apiKey = uuid.v1();
  console.log(apiKey);
  tenant.apiKey = apiKey;
  tenant.apiSecret = generateApiSecret(apiKey);
  let p = new Promise((resolve, reject) => {
    let tenantModel = new Tenant(tenant);
    tenantModel.save((err) => {
      if(err) reject(err);
      else {
        resolve(tenantModel);
      }
    });
  });

  return p;
}

const findTenant = (id) => {
  let p = new Promise((resolve, reject) => {
    Tenant.findById(mongoose.Types.ObjectId(id), (err, doc) => {
      if(err) reject(err);
      else {
        resolve(doc);
      }
    });
  });
  return p;
}

const findTenantByApiKey = (apiKey) => {
  let p = new Promise((resolve, reject) => {
    Tenant.findOne({ 'apiKey': apiKey }, (err, doc) => {
      if(err) reject(err);
      else {
        resolve(doc);
      }
    });
  });
  return p;
}

const findTenantByName = (name) => {
  let p = new Promise((resolve, reject) => {
    Tenant.findOne({ 'name': name }, (err, doc) => {
      if(err) reject(err);
      else {
        resolve(doc);
      }
    });
  });
  return p;
}

const allTenants = (page, size, sort) => {
  let p = new Promise((resolve, reject) => {
    Tenant.find().limit(size).skip(page*size).sort({
      name: sort
    }).exec((err, tenants) => {
      Tenant.count().exec((err, count) => {
        if(err) {
          reject(err);
        } else {
          resolve({
            elements: tenants,
            page: {
              page: page,
              size: size,
              totalCount: count
            }
          });
        }
      });
    });
  });

  return p;
}

const findTenants = (search, page, size, sort) => {
  let p = new Promise((resolve, reject) => {
    Tenant.find({$text: {$search: search}}).limit(size).skip(page*size).sort({
      name: sort
    }).exec((err, tenants) => {
      Tenant.count().exec((err, count) => {
        if(err) {
          reject(err);
        } else {
          resolve({
            elements: tenants,
            page: {
              page: page,
              size: size,
              totalCount: count
            }
          });
        }
      });
    });
  });

  return p;
}

// generate the JWT based apiSecret
const generateApiSecret = (apiKey) => {
  var token = jwt.sign({
    auth:  'magic',
    agent: 'x-cdsp-tenant',
    exp:   Math.floor(new Date().getTime()/1000) + 7*24*60*60 // Note: in seconds!
  }, apiKey);  // secret is defined in the environment variable JWT_SECRET
  return token;
}

// When successfully connected
mongoose.connection.on('connected', () => {
  debug('Mongoose default connection open to');
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

exports.Tenant = Tenant;
exports.saveTenant = saveTenant;
exports.findTenant = findTenant;
exports.findTenantByApiKey = findTenantByApiKey;
exports.findTenants = findTenants;
exports.allTenants = allTenants;
