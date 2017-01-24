'use strict';
const debug = require('debug')('tenant-model');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const URL = 'mongodb://localhost/cdspTenant';
mongoose.connect(URL);

const tenantSchema = new Schema({
  id: String,
  name:  String,
  services: [{ name: String }],
  timestamp: Date,
  status: String,
  apikey: String,
  apiSecret: String
});

tenantSchema.index({'$**': 'text'});

const Tenant = mongoose.model('Tenant', tenantSchema);

const saveTenant = (tenant) => {
  console.log(tenant);
  tenant.timestamp = new Date();
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
exports.findTenants = findTenants;
