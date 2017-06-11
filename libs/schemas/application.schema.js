'use strict';
const Schema = mongoose.Schema;

const applicationSchema = Schema({
    name: String,
    locale: String,
    apiKey: String,
    apiSecret: String,
    scope: [String],
    timestamp: Date,
    accountId: String,
    tenantId: String,
});

module.exports = applicationSchema;
