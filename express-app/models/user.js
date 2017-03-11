"use strict";

//require document class from camo
var Document = require('camo').Document;

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


    //aqui se puede hashear
    // preSave() {
    // 	this.password
    // }
}

module.exports = User;