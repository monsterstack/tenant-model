'use strict';
const uuid = require('node-uuid');
const jwt = require('jsonwebtoken');

const Repository = require('./repository').Repository;
const mongoose = require('mongoose');

// generate the JWT based apiSecret
const generateApiSecret = (apiKey) => {
  var token = jwt.sign({
    auth:  'magic',
    agent: 'x-cdsp-app',
    exp:   Math.floor(new Date().getTime()/1000) + 7*24*60*60 // Note: in seconds!
  }, apiKey);  // secret is defined in the environment variable JWT_SECRET
  return token;
}

class ApplicationRepository extends Repository {
	constructor(model) {
		super();
		this.Application = model;
	}

	save(application) {
		let _this = this;
		application.timestamp = new Date();
  	let apiKey = uuid.v1();
  	application.apiKey = apiKey;
  	application.apiSecret = generateApiSecret(apiKey);

		let applicationModel = new _this.Application(application);
		return applicationModel.save();
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
