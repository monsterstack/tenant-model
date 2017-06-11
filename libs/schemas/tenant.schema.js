'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tenantSchema = new Schema({
  name:  String,
  services: [String],
  timestamp: Date,
  status: String,
  apiKey: String,
  apiSecret: String,
});

tenantSchema.index({'$**': 'text'});

module.exports = tenantSchema;