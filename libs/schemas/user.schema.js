'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
  firstname: String,
  lastname: String,
  fullname: String,
  password: String,
  username: String,
  accountId: String,
  phoneNumber: String,
  locale: String,
  email: String,
  role: String,
  tenantId: String
});

module.exports = userSchema;