'use strict';
const uuid = require('node-uuid');
const jwt = require('jsonwebtoken');

const Promise = require('promise');
const Repository = require('./repository').Repository;
const mongoose = require('mongoose');

// generate the JWT based apiSecret
const generateApiSecret = (tenant) => {
  var token = jwt.sign({
    auth:  'magic',
    agent: 'x-cdsp-tenant',
		name: tenant.name,
    exp:   Math.floor(new Date().getTime()/1000) + 7*24*60*60 // Note: in seconds!
  }, tenant.apiKey);  // secret is defined in the environment variable JWT_SECRET
  return token;
}

class TenantRepository extends Repository {
	constructor(model) {
		super();
		this.Tenant = model;
	}

	save(tenant) {
		let _this = this;
		tenant.timestamp = new Date();
  	let apiKey = uuid.v1();
  	tenant.apiKey = apiKey;
  	tenant.apiSecret = generateApiSecret(tenant);

		let tenantModel = new _this.Tenant(tenant);
		return tenantModel.save();
	}

	update(tenant) {
		let _this = this;
		let p = new Promise((resolve, reject) => {
			if (tenant.apiKey === undefined) {
				tenant.apiKey = uuid.v1();
			}

			if (tenant.apiSecret === undefined) {
				tenant.apiSecret = generateApiSecret(tenant);
			}
			console.log("......");
			console.log(tenant);
			console.log(".......");

			_this.Tenant.findByIdAndUpdate(tenant.id, { 
					$set: { 
						status: tenant.status, 
						services: tenant.services, 
						apiKey: tenant.apiKey, 
						apiSecret: apiSecret 
					} 
				}, (err, updated) => {
					console.log(updated);
					if (err) reject(err);
					else resolve(updated);
			});
		});
		return p;
	}

	findById(id) {
	  let _this = this;
    return _this.Tenant.findOne({ _id: mongoose.Types.ObjectId(id) }).exec();
	}

	findByName(name) {
		let _this = this;
		return _this.Tenant.findOne({ name: name }).exec();
	}

	findByApiKey(apiKey) {
		let _this = this;
		return _this.Tenant.findOne({ apiKey: apiKey }).exec();
	}

	page(query, limit, offset) {
    let _this = this;
    return _this.Tenant.paginate(query, { offset: offset, limit: limit });
  }
}

module.exports.TenantRepository = TenantRepository;
