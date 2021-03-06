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
		return accountModel.save();
	}

	update(account) {
		let _this = this;
		let p = new Promise((resolve, reject) => {
			_this.Account.findByIdAndUpdate(account.id, { 
					$set: { 
						accountNumber: account.accountNumber
					} 
				}, (err, updated) => {
					if (err) reject(err);
					else resolve(account);
			});
		});
		return p;
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
