'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');
const Promise = require('promise');
const DB = config.db.name;
const HOST = config.db.host;

var url = 'mongodb://' + HOST + '/' + DB;
mongoose.connect(url);

var tenantSchema = new Schema({
  id: String,
  name:  String,
  services: [{ name: String }],
  timestamp: Date,
  status: String,
  apikey: String,
  apiSecret: String
});

var Tenant = mongoose.model('Tenant', tenantSchema);

const connect = (url) => {
  console.log("tenant model connect");
  let p = new Promise((reject, resolve) => {
      var dbConnString = 'mongodb://' + HOST + '/' + DB;
      console.log(url);
      mongoose.connect(url || dbConnString, function(err) {
          if (err) {
            console.log(err);
            throw err;
          }
      });
   });
  return p;
}

const saveService = (tenant) => {
  tenant.timestamp = new Date();
  return tenant.save(function(err) {
    if (err) throw err;
    console.log('Tenant created!');
  });
}

// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to');
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

exports.Tenant = Tenant;
exports.connect = connect;
exports.saveService = saveService;
