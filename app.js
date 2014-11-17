var util = require('util');
var vm = require('vm');
var static = require('node-static');
var url = require('url');
var fs = require('fs');
var path = require('path');

var serverListenPort = 8888;
//var NodeVM = require('vm2').NodeVM; //requires node v0.11+

//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./public');

require('http').createServer(function (request, response) {
    request.addListener('end',function () {
        //
        var dostatic = 1;

        var url_parts = url.parse(request.url, true);
        var qpath = url_parts.path;
        var ext = qpath.split('.').pop();

        console.log(ext);

        var printOutException = 1; //print exception to output in php-like fashion of print error
        //Dostatic table
        // -1 direct VM in this context (essentialy EVAL)
        // -2 sandbox with access to request,response,console,module,require

        if (ext == "js") {
            console.log("JS file -> processing");
            dostatic = -2;
        }

        if (ext == "jss") {
            console.log("JS sandbox file -> processing in sandbox");
            dostatic = -1;
        }


        // Serve files!
        if (dostatic > 0) {
            file.serve(request, response);

        }

        if (dostatic == -1) {
            console.log("Launch JS for : " + qpath);

            var sandbox = { request: request, response: response }
            qpathloc = "./public" + qpath;
            fs.readFile(qpathloc, {encoding: 'utf-8'}, function (err, data) {
                if (!err) {
                    //  console.log('received data: ' + data);
                    //    response.writeHead(200, {'Content-Type': 'text/html'});
                    //    response.write(data);
                    //    response.end();
                    //	vm.runInNewContext(data, sandbox, 'myfile.vm');
                    try {
                        vm.runInThisContext(data, 'myfile.vm');
                    } catch (err) {
                        console.log(err);
                    }
                    //	console.log(util.inspect(sandbox));

                } else {
                    console.log(err);
                }

            });


        } //... -1


        if (dostatic == -2) {
            console.log("Launch JS for : " + qpath);

            var sandbox = { "console": console, "module": module, "require": require, request: request, response: response};
            qpathloc = "./public" + qpath;
            fs.readFile(qpathloc, {encoding: 'utf-8'}, function (err, data) {
                if (!err) {
                    //   console.log('received data: ' + data);
                    //    response.writeHead(200, {'Content-Type': 'text/html'});
                    //    response.write(data);
                    //    response.end();
                    try {
                        vm.runInNewContext(data, sandbox, qpath);


                    } catch (err) {
                        console.log(err);
                        if (printOutException > 0) {

                            var vDebug = "";
                            for (var prop in err) {
                                vDebug += "property: " + prop + " value: [" + err[prop] + "]\n";
                            }
                            vDebug += "toString(): " + " value: [" + err.toString() + "]";
                            response.write(vDebug);


                        }
                        response.end();
                    }
                    //	vm.runInThisContext(data,'myfile.vm');
                    //	console.log(util.inspect(sandbox));

                } else {
                    console.log(err);
                }

            });
        } //... -2

        //experimental vm2 , was running into stack exception so not used atm
        if (dostatic == -3) {
            console.log("Launch JS for : " + qpath);

            var sandbox = { request: request, response: response }
            qpathloc = "./public" + qpath;
            fs.readFile(qpathloc, {encoding: 'utf-8'}, function (err, data) {
                if (!err) {
                    //   console.log('received data: ' + data);
                    //    response.writeHead(200, {'Content-Type': 'text/html'});
                    //    response.write(data);
                    //    response.end();
                    try {
                        //	vm.runInNewContext(data, sandbox, 'myfile.vm');

                        var options = {
                            console: 'inherit',
                            sandbox: {request: request, response: response},
                            require: true,
                            requireExternal: true,
                            requireNative: ['fs', 'path']
                        };

                        var vm = new NodeVM(options);
                        var functionInSandbox = vm.run(data);


                    } catch (err) {
                        console.log(err);
                        response.end();
                    }
                    //	vm.runInThisContext(data,'myfile.vm');
                    //	console.log(util.inspect(sandbox));

                } else {
                    console.log(err);
                }

            });


        } //... -3


    }).resume();
}).listen(serverListenPort);