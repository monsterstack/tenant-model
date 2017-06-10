'use strict';
const uuid = require('node-uuid');

const Repository = require('./repository').Repository;
const mongoose = require('mongoose');

class UserRepository extends Repository {
	constructor(model) {
		super();
		this.User = model;
	}

	save(user) {
		let _this = this;

		let userModel = new _this.User(user);
		return userModel.save();
	}

	update(user) {
		let _this = this;
		let p = new Promise((resolve, reject) => {
			_this.findById(user.id).then((found) => {
				if (found) {
					found.firstname = user.firstname;
					found.lastname = user.lastname;
					found.username = user.username;
					found.password = user.password;
					found.role = user.role;
					found.email = user.email;
					found.phoneNumber = user.phoneNumber;
					resolve(found);
				} else {
					resolve(user);
				}
			}).catch((err) => {
				reject(err);
			})
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
