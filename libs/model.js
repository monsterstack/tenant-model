'use strict';
const debug = require('debug')('tenant-model');
const mongoose = require('mongoose');
const mPage = require('mongoose-paginate');
mongoose.plugin(require('meanie-mongoose-to-json'));

const oldMpage = mPage.paginate;

mPage.paginate = (query, options) => {
  return oldMpage(query, options).then((results) => {
    if (results.docs) {
      results.elements = results.docs;
      delete results.docs;
    }

    return results;
  });
};

mongoose.plugin(mPage);

const uuid = require ('uuid');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const assert = require('assert');
const config = require('config');

// Use bluebird
mongoose.Promise = require('bluebird');

const URL = `mongodb://${config.db.host}:${config.db.port}/cdspTenant`;
mongoose.connect(URL);

const tenantSchema = new Schema({
  name:  String,
  services: [{ name: String }],
  timestamp: Date,
  status: String,
  apiKey: String,
  apiSecret: String,
});

tenantSchema.index({'$**': 'text'});

const Tenant = mongoose.model('Tenant', tenantSchema);
Tenant.repo = new TenantRepository(Tenant);

const applicationSchema = Schema({
    name: String,
    apiKey: String,
    apiSecret: String,
    scope: [String],
    timestamp: Date,
});

const Application = mongoose.model('Application', applicationSchema);

// @TODO: Make Repository Classes for this logic
const saveApplication = (application) => {
  application.timestamp = new Date();
  let apiKey = uuid.v1();
  let apiSecret = generateApiSecret(apiKey);

  let p = new Promise((resolve, reject) => {
    let applicationModel = new Application(application);
    applicationModel.save((err) => {
      if (err) reject(err);
      else
        resolve(applicationModel);
    })
  });

  return p;
}

const saveTenant = (tenant) => {
  return Tenant.repo.save(tenant);
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
    let sortDir = 1;
    if(sort === 'desc') {
      sortDir = -1
    } else if(sort === 'asc') {
      sortDir = 1;
    }

    let myPage = parseInt(page) + 1;

    Tenant.paginate({}, {page: myPage, limit: parseInt(size), sort: {
      name: sortDir
    }}, (err, tenants) => {
      if(err) {
        reject(err);
      } else {
        resolve({
          elements: tenants.docs || [],
          page: {
            page: parseInt(page),
            size: tenants.limit,
            total: tenants.total
          }
        });
      }
    });
  });

  return p;
}

const findTenants = (search, page, size, sort) => {
  let p = new Promise((resolve, reject) => {
    let sortDir = 1;
    if(sort === 'desc') {
      sortDir = -1
    } else if(sort === 'asc') {
      sortDir = 1;
    }

    let myPage = parseInt(page) + 1;

    Tenant.paginate({$text: {$search: search}}, {page: myPage, limit: parseInt(size), sort: {
      name: sortDir
    }}, (err, tenants) => {
      if(err) {
        reject(err);
      } else {
        resolve({
          elements: tenants.docs || [],
          page: {
            page: parseInt(page),
            size: tenants.limit,
            total: tenants.total
          }
        });
      }
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
exports.findTenantByName = findTenantByName;
exports.allTenants = allTenants;

exports.Application = Application;
exports.saveApplication = saveApplication;
