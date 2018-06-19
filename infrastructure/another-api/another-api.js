
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
    var mlauthConfig = new Object();
    var MLAUTH_CONFIG_FILTER_EXTERNAL_DEFAULT_VALUE = true;
    var MLAUTH_CONFIG_FILTER_INTERNAL_DEFAULT_VALUE = false;
    var MLAUTH_CONFIG_FILTER_INTERNAL_SILENT_DEFAULT_VALUE = true;
    var MLAUTH_CONFIG_INTERCEPTOR_EXTERNAL_DEFAULT_VALUE = false;
    var MLAUTH_CONFIG_INTERCEPTOR_INTERNAL_DEFAULT_VALUE = false;
    if(process.env.MLAUTH_CONFIG_FILTER_EXTERNAL_ENABLED == "false"){
        MLAUTH_CONFIG_FILTER_EXTERNAL_DEFAULT_VALUE = false;
    }
    if(process.env.MLAUTH_CONFIG_FILTER_INTERNAL_ENABLED == "true"){
        MLAUTH_CONFIG_FILTER_INTERNAL_DEFAULT_VALUE = true;
    }
    if(process.env.MLAUTH_CONFIG_FILTER_INTERNAL_SILENT_ENABLED == "false"){
        MLAUTH_CONFIG_FILTER_INTERNAL_SILENT_DEFAULT_VALUE = false;
    }
    if(process.env.MLAUTH_CONFIG_INTERCEPTOR_EXTERNAL_ENABLED == "true"){
        MLAUTH_CONFIG_INTERCEPTOR_EXTERNAL_DEFAULT_VALUE = true;
    }
    if(process.env.MLAUTH_CONFIG_INTERCEPTOR_INTERNAL_ENABLED == "true"){
        MLAUTH_CONFIG_INTERCEPTOR_INTERNAL_DEFAULT_VALUE = true;
    }
    mlauthConfig["filter.external"] = MLAUTH_CONFIG_FILTER_EXTERNAL_DEFAULT_VALUE;
    mlauthConfig["filter.internal"] = MLAUTH_CONFIG_FILTER_INTERNAL_DEFAULT_VALUE;
    mlauthConfig["filter.internal.silent"] = MLAUTH_CONFIG_FILTER_INTERNAL_SILENT_DEFAULT_VALUE;
    mlauthConfig["interceptor.external"] = MLAUTH_CONFIG_INTERCEPTOR_EXTERNAL_DEFAULT_VALUE;
    mlauthConfig["interceptor.internal"] = MLAUTH_CONFIG_INTERCEPTOR_INTERNAL_DEFAULT_VALUE;
    var reverseConfig = new Object();
    reverseConfig["mlauth"] = mlauthConfig;
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
