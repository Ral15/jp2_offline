"use strict";

//require document class from camo
var Document = require('camo').Document;

//Create user model with the basic fields for testing
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
}

module.exports = User;