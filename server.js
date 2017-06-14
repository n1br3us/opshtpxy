var
    url = require('url'),
    http = require('http');

console.log ('------------------------------------------   ' );
var host = process.env.OPENSHIFT_NODEJS_IP || "localhost";
var port = process.env.OPENSHIFT_NODEJS_PORT || 80;
console.log(port + '   '+ host);
var d = require('domain').create();
d.on('error', function(err){
    // handle the error safely
    console.log('d.on error: '+err.message);
});

// catch the uncaught errors in this asynchronous or synchronous code block
d.run(function(){
    // the asynchronous or synchronous code that we want to catch thrown errors on
    http.createServer(function ( request, response ) {

        console.log('request ' + request.url);

        //-----------------------------------

            request.pause();
            var options = url.parse(request.url);
            options.headers = request.headers;
            options.method = request.method;
            options.agent = false;

            var connector = http.request(options, function(serverResponse) {
                serverResponse.pause();
                response.writeHeader(serverResponse.statusCode, serverResponse.headers);
                serverResponse.pipe(response);
                serverResponse.resume();
            });

            request.pipe(connector);
            request.resume();


        //-----------------------

    }).listen(port, host);
});
