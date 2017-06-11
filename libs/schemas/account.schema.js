'use strict';
const Schema = mongoose.Schema;

const accountSchema = Schema({
    accountNumber: String,
    tenantId: String,
});

module.exports = accountSchema;