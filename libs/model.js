'use strict';
const debug = require('debug')('tenant-model');
const mongoose = require('mongoose');

mongoose.plugin(require('meanie-mongoose-to-json'));

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

// Schemas
const TenantSchema = require('./schemas/tenant.schema');
const UserSchema = require('./schemas/user.schema');
const AccountSchema = require('./schemas/account.schema');
const ApplicationSchema = require('./schemas/application.schema');

// Repositories
const TenantRepository = require('./tenantRepository').TenantRepository;
const ApplicationRepository = require('./applicationRepository').ApplicationRepository;
const AccountRepository = require('./accountRepository').AccountRepository;
const UserRepository = require('./userRepository').UserRepository;

const URL = `mongodb://${config.db.host}:${config.db.port}/cdspTenant`;
mongoose.connect(URL);

const Tenant = mongoose.model('Tenant', TenantSchema);
const Application = mongoose.model('Application', ApplicationSchema);
const Account = mongoose.model('Account', AccountSchema);
const User = mongoose.model('User', UserSchema);

Application.repo = new ApplicationRepository(Application);
Tenant.repo = new TenantRepository(Tenant);
Account.repo = new AccountRepository(Account);
User.repo = new UserRepository(User);

const merge = (obj, obj2, fields) => {
  fields.forEach((field) => {
    obj[field] = obj2[field];
  });

  return obj;
}

// @TODO: Make Repository Classes for this logic
const saveAccount = (account) => {
  return Account.repo.save(account);
}

const updateAccount = (account) => {
  return Account.repo.update(account);
}

const findAccount = (id) => {
  return Account.repo.findById(id);
}

const findAccountByAccountNumber = (accountNumber) => {
  return Account.repo.findByAccountNumber(accountNumber);
}

const saveUser = (user) => {
  return User.repo.save(user);
}

const updateUser = (user) => {
  return User.repo.update(user);
}

const findUserByUsername = (username) => {
  return User.repo.findByUsername(username);
}

const findUser = (id) => {
  return User.repo.findById(id);
}

const saveApplication = (application) => {
  return Application.repo.save(application);
}

const updateApplication = (application) => {
  return Application.repo.update(application);
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

const updateTenant = (tenant) => {
  return Tenant.repo.update(tenant);
}

const findTenant = (id) => {
  return Tenant.repo.findById(id);
}

const findTenantByApiKey = (apiKey) => {
  return Tenant.repo.findByApiKey(apiKey);
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

exports.Tenant = Tenant;
exports.saveTenant = saveTenant;
exports.updateTenant = updateTenant;
exports.findTenant = findTenant;
exports.findTenantByApiKey = findTenantByApiKey;
exports.findTenants = findTenants;
exports.findTenantByName = findTenantByName;
exports.allTenants = allTenants;

exports.Application = Application;
exports.saveApplication = saveApplication;
exports.updateApplication = updateApplication;
exports.findApplication = findApplication;
exports.findApplicationByApiKey = findApplicationByApiKey;
exports.findApplications = findApplications;
exports.findApplicationByName = findApplicationByName;
exports.allApplications = allApplications;

exports.Account = Account;
exports.saveAccount = saveAccount;
exports.updateAccount = updateAccount;
exports.findAccount = findAccount;
exports.findAccountByAccountNumber = findAccountByAccountNumber;

exports.User = User;
exports.findUserByUsername = findUserByUsername;
exports.findUser = findUser;
exports.saveUser = saveUser;
exports.updateUser = updateUser;

exports.merge = merge;