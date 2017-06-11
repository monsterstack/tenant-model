'use strict';
const Schema = mongoose.Schema;

const tenantSchema = new Schema({
  name:  String,
  services: [{ name: String }],
  timestamp: Date,
  status: String,
  apiKey: String,
  apiSecret: String,
});

tenantSchema.index({'$**': 'text'});

module.exports = tenantSchema;