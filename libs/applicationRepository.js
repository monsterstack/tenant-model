'use strict';
const uuid = require('node-uuid');
const jwt = require('jsonwebtoken');
const Promise = require('promise');
const ApiSecretFactory = require('./apiSecretFactory');

const Repository = require('./repository').Repository;
const mongoose = require('mongoose');

class ApplicationRepository extends Repository {
	constructor(model) {
		super();
		this.Application = model;
		this.apiSecretFactory = new ApiSecretFactory();
	}

	save(application) {
		let _this = this;
		application.timestamp = new Date();
  	let apiKey = uuid.v1();
  	application.apiKey = apiKey;
  	application.apiSecret = _this.apiSecretFactory.createApplicationApiSecret(application);

		let applicationModel = new _this.Application(application);
		return applicationModel.save();
	}

	update(application) {
		let _this = this;
		let p = new Promise((resolve, reject) => {
			if (application.apiKey === undefined) {
				application.apiKey = uuid.v1();
			}

			if (application.apiSecret === undefined) {
				application.apiSecret = _this.apiSecretFactory.createApplicationApiSecret(application);
			}

			application.timestamp = new Date();
			_this.Application.findByIdAndUpdate(application.id, { 
					$set: { 
						status: application.status, 
						scope: application.scope, 
						apiKey: application.apiKey, 
						apiSecret: application.apiSecret 
					} 
				}, (err, updated) => {
					if (err) reject(err);
					else resolve(application);
			});
		});
		return p;
	}

	findById(id) {
	  let _this = this;
    return _this.Application.findOne({ _id: mongoose.Types.ObjectId(id) }).exec();
	}

	findByName(name) {
		let _this = this;
		return _this.Application.findOne({ name: name }).exec();
	}

	findByApiKey(apiKey) {
		let _this = this;
		return _this.Application.findOne({ apiKey: apiKey }).exec();
	}

	page(query, limit, offset) {
    let _this = this;
    return _this.Application.paginate(query, { offset: offset, limit: limit });
  }
}

module.exports.ApplicationRepository = ApplicationRepository;
