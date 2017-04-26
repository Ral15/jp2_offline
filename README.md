# jp2_offline

This application was build together with [Juan Pablo II online](https://github.com/erikiado/jp2_online).

# Table of contents

1. [System Requirements](#system)
2. [For Developers](#developers)
  1. [Quick Start](#quick)
  2. [Build the application](#build)
  3. [Test](#test)
3. [For users](#user)

# System Requirements

# For Developers

## Quick start

```shell
  # Clone the Quick Start repository
  $ git clone https://github.com/Ral15/jp2_offline/

  # Go into the express app
  $ cd jp2_offline/express-app

  # Install the dependencies and run
  $ npm install

  # Return to the repository
  $ cd ..

  # Install the dependencies and run
  $ npm install && npm start
```

## Build the application

To Build the application we used Electron Packager.
To create the executable just do:

```shell
  npm build
```

This creates a executable for windows x64. To changes architecture and operating system you can run

```shell
  # To create the same executable
  electron-packager . "San Juan Pablo II" --platform=win32 --arch=x64
```

with this command you can change the operating system and the architecture, you can see
[Electron-packager](https://github.com/electron-userland/electron-packager) for more information

## Test

To test the application

* In jp2_offline/config.js:

```shell

  DEBUG: false,
  ENV: 'testing'

```

* In your command line:

```shell

  # To run all test
  npm test

  # To run a specific test
  npm test test/your-test.js

```

* To create a test, in directory test there is a file called base-test.js You can implement your test with this little guide.

* To use eslint:

 ```shell
  npm run lint
 ```

# For users

You can download the latest version of this application in the [online version](http://138.197.197.47/)
