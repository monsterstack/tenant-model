'use strict';
const uuid = require('node-uuid');

const Repository = require('./repository').Repository;
const mongoose = require('mongoose');

class UserRepository extends Repository {
	constructor(model) {
		super();
		this.Account = model;
	}

	save(user) {
		let _this = this;

		let userModel = new _this.User(user);
		return userModel.save();
	}

	update(user) {
		let _this = this;
		let p = new Promise((resolve, reject) => {
			_this.User.findByIdAndUpdate(user.id, { 
					$set: { 
						firstName: user.firstName
					} 
				}, (err, updated) => {
					if (err) reject(err);
					else resolve(user);
			});
		});
		return p;
	}

	findById(id) {
	  let _this = this;
    return _this.User.findOne({ _id: mongoose.Types.ObjectId(id) }).exec();
	}

	findByUsername(username) {
		let _this = this;
		return _this.User.findOne({ username: username }).exec();
	}
}

module.exports.UserRepository = UserRepository;
