
var querystring = require("querystring");
var http = require('../api/ml-http');
var utils = require('../api/utils');


const serverPort = 80;

function handleRequest(request, response){
    console.log("\n\n\n\n=======================================================================");
    utils.reverseText("Receiving request...");

    var domain = request.headers.host;
    var method = request.method;
    var url = request.url;

    
    utils.reverseText("Path: " + method + " " + url);
    console.log(utils.prettify(request.headers));

    response.statusCode = 200 ;
    response.write(getMockResponse());
    response.end();
}

function requestHandler(request, response){
    var url = request.url;
    if((url.startsWith("/ping"))){
        response.statusCode = 200;
        response.write("pong");
        response.end();
    }else if(url.startsWith("/config/http-middleware")){
        sendReverseConfig(request, response);
    }else{
        handleRequest(request, response);
    }
}

function sendReverseConfig(request, response){
    var reverseConfig = new Object();
    console.log(reverseConfig);
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(reverseConfig));
}

function getMockResponse(){
    return "{status: 'deleted'}";
}


function initialize(){        
    var server = http.createServer(requestHandler);
    server.listen(serverPort, function(){
        console.log("\n\nServer listening on: http://localhost:%s", serverPort);
    });
}

initialize();
