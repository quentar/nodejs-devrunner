nodejs-devrunner
================

Development tool. Serve static files and execute .JS files along the way , can be configured to run them in local context or in sandbox with more or less limitations.
Not meant for production usage of any kind due to unsafe manner of executing files,
but rather tool to speed up development of scripts.

# Installation #

```
git clone git@github.com:quentar/nodejs-devrunner.git
cd cd nodejs-devrunner && npm install
```

_Note_: If you don't have RethinkDB installed, you can follow [these instructions to get it up and running](http://www.rethinkdb.com/docs/install/). 


# Running the application #

Running the app is as simple as:

```
node app
```

Be sure to change the port number, default is 8888 . 

# Access served files #

http://localhost:8888/hello.txt   - this serves raw file


http://localhost:8888/hello.js    - evaluates the file
