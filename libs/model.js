'use strict';
const debug = require('debug')('tenant-model');
const mongoose = require('mongoose');

// Use bluebird
mongoose.Promise = require('bluebird');

const uuid = require ('uuid');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const assert = require('assert');
const config = require('config');

const mPage = require('mongoose-paginate');

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

// Plugins
mongoose.plugin(mPage);
mongoose.plugin(require('meanie-mongoose-to-json'));

// When successfully connected
mongoose.connection.on('connected', () => {
  debug('Mongoose default connection open to');
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// Repositories
const TenantRepository = require('./tenantRepository').TenantRepository;

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

const applicationSchema = Schema({
    name: String,
    apiKey: String,
    apiSecret: String,
    scope: [String],
    timestamp: Date,
});

tenantSchema.index({'$**': 'text'});

const Tenant = mongoose.model('Tenant', tenantSchema);
const Application = mongoose.model('Application', applicationSchema);

Tenant.repo = new TenantRepository(Tenant);


// @TODO: Make Repository Classes for this logic
const saveApplication = (application) => {
  return Application.repo.save(application);
}

const findApplication = (id) => {
  return Application.repo.findById(id);
}

const findApplicationByApiKey = (apiKey) => {
  return Application.repo.findApiKey(apiKey);
}

const findApplicationByName = (name) => {
  return Application.repo.findByName(name);
}

const findApplications = (search, page, size, sort) => {
  let p = new Promise((resolve, reject) => {
    let sortDir = 1;
    if(sort === 'desc') {
      sortDir = -1
    } else if(sort === 'asc') {
      sortDir = 1;
    }

    let myPage = parseInt(page) + 1;

    Application.paginate({$text: {$search: search}}, {page: myPage, limit: parseInt(size), sort: {
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

const allApplications = (page, size, sort) => {
  let p = new Promise((resolve, reject) => {
    let sortDir = 1;
    if(sort === 'desc') {
      sortDir = -1
    } else if(sort === 'asc') {
      sortDir = 1;
    }

    let myPage = parseInt(page) + 1;

    Application.paginate({}, {page: myPage, limit: parseInt(size), sort: {
      name: sortDir
    }}, (err, applications) => {
      if(err) {
        reject(err);
      } else {
        resolve({
          elements: applications.docs || [],
          page: {
            page: parseInt(page),
            size: applications.limit,
            total: applications.total
          }
        });
      }
    });
  });

  return p;
}

const saveTenant = (tenant) => {
  return Tenant.repo.save(tenant);
}

const findTenant = (id) => {
  return Tenant.repo.findById(id);
}

const findTenantByApiKey = (apiKey) => {
  return Tenant.repo.findApiKey(apiKey);
}

const findTenantByName = (name) => {
  return Tenant.repo.findByName(name);
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

exports.Tenant = Tenant;
exports.saveTenant = saveTenant;
exports.findTenant = findTenant;
exports.findTenantByApiKey = findTenantByApiKey;
exports.findTenants = findTenants;
exports.findTenantByName = findTenantByName;
exports.allTenants = allTenants;

exports.Application = Application;
exports.saveApplication = saveApplication;
exports.findApplication = findApplication;
exports.findApplicationByApiKey = findApplicationByApiKey;
exports.findApplications = findApplications;
exports.findAppicationByName = findApplicationByName;
exports.allApplications = allApplications;
