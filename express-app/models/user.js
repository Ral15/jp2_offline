"use strict";

//require document class from camo
var Document = require('camo').Document;

//Create user model with the basic fields for testing
class User extends Document {
    constructor() {
        super();

        this.firstName = String;
        this.lastName = String;
        this.email = String;
        this.password = String;
    }

    static collectionName() {
        return 'users';
    }
}

module.exports = User;