'use strict';
const uuid = require('node-uuid');

const Repository = require('./repository').Repository;
const mongoose = require('mongoose');

class AccountRepository extends Repository {
	constructor(model) {
		super();
		this.Account = model;
	}

	save(account) {
		let _this = this;

		let accountModel = new _this.Account(account);
		return applicationModel.save();
	}

	findById(id) {
	  let _this = this;
    return _this.Account.findOne({ _id: mongoose.Types.ObjectId(id) }).exec();
	}

	findByAccountNumber(accountNumber) {
		let _this = this;
		return _this.Account.findOne({ accountNumber: accountNumber }).exec();
	}
}

module.exports.AccountRepository = AccountRepository;
