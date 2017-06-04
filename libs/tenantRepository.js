'use strict';
const uuid = require('node-uuid');

const Promise = require('promise');
const ApiSecretFactory = require('./apiSecretFactory');
const Repository = require('./repository').Repository;
const mongoose = require('mongoose');

class TenantRepository extends Repository {
	constructor(model) {
		super();
		this.Tenant = model;

		this.apiSecretFactory = new ApiSecretFactory();
	}

	save(tenant) {
		let _this = this;
		tenant.timestamp = new Date();
  	let apiKey = uuid.v1();
  	tenant.apiKey = apiKey;
  	tenant.apiSecret = this.apiSecretFactory.createTenantApiSecret(tenant);

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
				tenant.apiSecret = _this.apiSecretFactory.createTenantApiSecret(tenant);
			}

			tenant.timestamp = new Date();
			_this.Tenant.findByIdAndUpdate(tenant.id, { 
					$set: { 
						status: tenant.status, 
						services: tenant.services, 
						apiKey: tenant.apiKey, 
						apiSecret: tenant.apiSecret 
					} 
				}, (err, updated) => {
					if (err) reject(err);
					else resolve(tenant);
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
