// Require document class from camo
const Document = require('camo').Document;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Create user model with the basic fields for testing
class User extends Document {
  constructor() {
    super();

    this.username = {
      type: String,
      required: true
    };
    this.password = {
      type: String,
      required: true
    };
    this.apiToken = {
      type: String,
      required: true
    };
  }

  static collectionName() {
    return 'users';
  }

  preSave() {
    var hash = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10), null);
    this.password = hash;
  }
}

module.exports = User;
