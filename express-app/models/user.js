// Require document class from camo
const Document = require('camo').Document;

// Create user model with the basic fields for testing
class User extends Document {
  constructor() {
    super();

    this.username = String;
    this.password = String;
    this.apiToken = String;
  }

  static collectionName() {
    return 'users';
  }
}

module.exports = User;
