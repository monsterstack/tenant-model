'use strict';
const mongoose = require('mongoose');

class Repository {
  isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }
}

module.exports.Repository = Repository;