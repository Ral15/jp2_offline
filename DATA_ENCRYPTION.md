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

* Using Camo we have no access to this options because Camo connect automatically the Database with camo.connect() function.
  and when you clone the repository you can't access to the node_modules that we modified.

* So, the steps to encrypt the data are:

  * Do a npm install when you clone the repository in jp2_offline and express-app directories as we see in Readme.md

  * Go to /your-path/jp2_offline/express-app/node_modules/camo/lib/clients/nedbclient.js

  * Add const Crypto = require('crypto-js'); AND const Config = require('../../../../config.js'); in the file:

    ```shell
      'use strict';

      const _ = require('lodash');
                .
                .
                .
      const DatabaseClient = require('./client');
      const Crypto = require('crypto-js');
      const Config = require('../../../../config.js');
    ```
  * At function createCollection you will see a new Datastore function, add the options:

  ``` shell
    new Datastore({filename: collectionPath, autoload: true,
      afterSerialization: function (doc) {
        # Select the algorithm to encrypt the data (AES) and pass the parameters
        # that is the doc to encrypt and a DBKey used in the encryption algorithm
        var encrypted = Crypto.AES.encrypt(doc, Config.DBKey);
        var ciphertext = encrypted.toString();
        return ciphertext;
      },
      # beforeDeserialization is the inverse of afterSerialization
      beforeDeserialization: function (doc) {
        var decrypted = Crypto.AES.decrypt(doc, Config.DBKey);
        var plaintext = decrypted.toString(Crypto.enc.Utf8);

        return plaintext;
      }
    });
  ```

  * After you do this you will be able to encrypt your document Using Camo and NeDB.
