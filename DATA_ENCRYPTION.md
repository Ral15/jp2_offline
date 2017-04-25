# Data Encryption

For this application we used NeDB as Database and Camo as ODM.

# Table of contents

1. [NeDB](#nedb)
2. [Camo](#camo)
3. [Encryption of the data](#encryption)

# NeDB

* NeDB Embedded persistent or in memory database for Node.js, nw.js, Electron and browsers, 100% JavaScript, no binary dependency. API is a subset of MongoDB's and it's plenty fast.

* More information in [NeDB](https://github.com/louischatriot/nedb).

# Camo

* Camo was created for two reasons: to bring traditional-style classes to MongoDB JavaScript, and to support NeDB as a backend (which is much like the SQLite-alternative to Mongo).

* More information in [Camo](https://github.com/scottwrobinson/camo)

# Encryption of the data

* To encrypt the database, NeDB gives options in the new Datastore({}) function. For encryption are afterSerialization and
  beforeDeserialization. in the link of NeDB describes a little bit more this functions.

* Using Camo we have no access to this options because Camo connect automatically the Database with a fuctions.

* So the steps to encrypt the data are:

  * Do a npm install when you clone the repository in jp2_offline and express-app directories as we see in [Readme.md](https://github.com/Ral15/jp2_offline/README.md)

  * Go to /your-path/jp2_offline/node_modules/camo/lib/clients/nedbclient.js

  * Add const Crypto = require('crypto-js'); in the file:

    ```shell
      'use strict';

      const _ = require('lodash');
                .
                .
                .
      const DatabaseClient = require('./client');
      const Crypto = require('crypto-js');
    ```
  * At function createCollection you will see a new Datastore function, add the options:

  ``` shell
    new Datastore({filename: collectionPath, autoload: true,
      afterSerialization: function (doc) {
        var encrypted = Crypto.AES.encrypt(doc, DBKey);
        var ciphertext = encrypted.toString();
        return ciphertext;
      },
      beforeDeserialization: function (doc) {
        var decrypted = Crypto.AES.decrypt(doc, DBKey);
        var plaintext = decrypted.toString(Crypto.enc.Utf8);

        return plaintext;
      }
    });
  ```
