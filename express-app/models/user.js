"use strict";

//require document class from camo
var Document = require('camo').Document;
var bcrypt = require('bcryptjs');
const crypto = require('crypto');

//Create user model with the basic fields for testing
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

    preSave() {
      var hash = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10), null);
      this.password = hash;
    }
}

module.exports = User;
