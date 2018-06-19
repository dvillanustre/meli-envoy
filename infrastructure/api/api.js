
var querystring = require("querystring");
var http = require('./ml-http');
var utils = require('./utils');

var urlParser = require('url');

const serverPort = 8080;

var requestsArray = [];
var responsesArray = [];


function handleRequest(request, response){
    console.log("\n\n\n\n=======================================================================");
    utils.reverseText("Receiving request...")

    var internalRequestId = utils.guid();
    requestsArray[internalRequestId] = request;
    responsesArray[internalRequestId] = response;

    var domain = request.headers.host;
    var method = request.method;
    var url = request.url;    
    
    var urlObject = urlParser.parse(url, true);
    var callerId = urlObject.query['caller.id'];
    var requestId = request.headers['x-request-id'];

    utils.reverseText("Path: " + method + " " + url);
    console.log(utils.prettify(request.headers));
    
    var urlToCall;
    if(url.startsWith("/products")){
        //it should be a golden pass granted resource. 
        var urlToCall = "/products/1234";
    }else{
        var urlToCall = "/users/1234";
    }
    if(url.startsWith("/encoded/MLB857255948")){
	    if(url != "/encoded/MLB857255948%7C%7C92516810"){
            response.statusCode = 400;
            response.write(getMockResponse());
            response.end();
            return;
        }else{
            response.statusCode = 200;
            response.write(getMockResponse());
            response.end();
            return;
        }
    }
    if(callerId)
        urlToCall += "?caller.id=" + callerId;

    utils.startReverseComment("API has received request.id "+ requestId + ". Calling Items mock server(" + method + " " + urlToCall + ")");
    var headers = {"X-Request-Id": requestId};
    try{
        http.get('another-api', 80, urlToCall, handleRequestCallback, headers, internalRequestId);
    }catch(e){
        response.statusCode = 500;
        response.write(getMockResponse());
        response.end();
    }
    
}

function requestHandler(request, response){
    var url = request.url;

    if((url.startsWith("/ping"))){
        response.statusCode = 200;
	response.write("pong");
	response.end();
    }else if(url.startsWith("/config/http-middleware")){
	sendReverseConfig(request, response);
    }else if(url.startsWith("/testremoveparams")){
        testRemoveParamsAndHeaders(request, response);
    }else if(url.startsWith("/testreplaceparams")){
        testReplaceParamsAndHeaders(request, response);
    }else{
	handleRequest(request, response);
    }
}

function testReplaceParamsAndHeaders(request, response){
    var paramsAndHeaders = new Object();
    var expected = new Object();
    var url_parts = urlParser.parse(request.url, true);

    console.log("\n\n\n\n=======================================================================");
    utils.reverseText("Receiving request...")
    utils.reverseText("Path: " + request.method + " " + request.url);
    console.log(utils.prettify(request.headers));

    paramsAndHeaders["x-caller-id"] = request.headers["x-caller-id"];
    paramsAndHeaders["x-caller-scopes"] = request.headers["x-caller-scopes"];
    paramsAndHeaders["x-caller-status"] = request.headers["x-caller-status"];
    paramsAndHeaders["x-handled-by-middleware"] = request.headers["x-handled-by-middleware"];
    paramsAndHeaders["x-public"] = request.headers["x-public"];
    //paramsAndHeaders["x-client-id"] = request.headers["x-client-id"];
    paramsAndHeaders["x-test-token"] = request.headers["x-test-token"];
    paramsAndHeaders["x-admin-id"] = request.headers["x-admin-id"];
    //paramsAndHeaders["x-caller-admin"] = request.headers["x-caller-admin"];
    paramsAndHeaders["caller.id"] = url_parts.query["caller.id"];
    paramsAndHeaders["access_token"] = url_parts.query["access_token"];
    paramsAndHeaders["caller.scopes"] = url_parts.query["caller.scopes"];
    paramsAndHeaders["caller.status"] = url_parts.query["caller.status"];
    paramsAndHeaders["caller.siteId"] = url_parts.query["caller.siteId"];
    paramsAndHeaders["client.id"] = url_parts.query["client.id"];
    paramsAndHeaders["admin.id"] = url_parts.query["admin.id"];
    //paramsAndHeaders["caller.admin"] = url_parts.query["caller.admin"];

    expected["x-caller-id"] = "246892814";
    expected["x-caller-scopes"] = "read,offline_access";
    expected["x-caller-status"] = "ACTIVE";
    expected["x-handled-by-middleware"] = "true";
    expected["x-public"] = "true";
    expected["access_token"] = "TEST-GRANTED";
    //expected["x-client-id"] = request.headers["x-client-id"];
    expected["x-test-token"] = "true";
    expected["x-admin-id"] = "123";
    //expected["x-caller-admin"] = request.headers["x-caller-admin"];
    expected["caller.id"] = "246892814";
    expected["caller.scopes"] = "read,offline_access";
    expected["caller.status"] = "ACTIVE";
    expected["caller.siteId"] = "MLA";
    expected["client.id"] = "1";
    expected["admin.id"] = "123";
    //expected["caller.admin"] = url_parts.query["caller.admin"];

    var status = 200;

    for (prop in expected){
        if (paramsAndHeaders[prop] != expected[prop]){
            status = 500;
            paramsAndHeaders["_message"] = "INVALID_PARAMS_AND_HEADERS";
            response.writeHead(status, {"Content-Type": "application/json"});
            response.end(JSON.stringify(paramsAndHeaders));
            return;
        }
    }

    response.writeHead(status, {"Content-Type": "application/json"});
    response.end(JSON.stringify(paramsAndHeaders));
}

function testRemoveParamsAndHeaders(request, response){
    var paramsAndHeaders = new Object();
    var url_parts = urlParser.parse(request.url, true);

    console.log("\n\n\n\n=======================================================================");
    utils.reverseText("Receiving request...")
    utils.reverseText("Path: " + request.method + " " + request.url);
    console.log(utils.prettify(request.headers));

    paramsAndHeaders["x-caller-id"] = request.headers["x-caller-id"];
    paramsAndHeaders["x-caller-scopes"] = request.headers["x-caller-scopes"];
    paramsAndHeaders["x-caller-status"] = request.headers["x-caller-status"];
    //paramsAndHeaders["x-client-id"] = request.headers["x-client-id"];
    paramsAndHeaders["x-test-token"] = request.headers["x-test-token"];
    paramsAndHeaders["x-admin-id"] = request.headers["x-admin-id"];
    //paramsAndHeaders["x-caller-admin"] = request.headers["x-caller-admin"];
    paramsAndHeaders["caller.id"] = url_parts.query["caller.id"];
    paramsAndHeaders["caller.scopes"] = url_parts.query["caller.scopes"];
    paramsAndHeaders["caller.status"] = url_parts.query["caller.status"];
    paramsAndHeaders["caller.siteId"] = url_parts.query["caller.siteId"];
    paramsAndHeaders["client.id"] = url_parts.query["client.id"];
    paramsAndHeaders["admin.id"] = url_parts.query["admin.id"];
    //paramsAndHeaders["caller.admin"] = url_parts.query["caller.admin"];

    var status = 200;

    for (prop in paramsAndHeaders){
        if(paramsAndHeaders[prop] == null){
            delete paramsAndHeaders[prop];
        }
    }

    for (param in paramsAndHeaders){
        status = 500;
        paramsAndHeaders["_message"] = "INVALID_PARAMS_AND_HEADERS";
        response.writeHead(status, {"Content-Type": "application/json"});
        response.end(JSON.stringify(paramsAndHeaders));
        return;
    }

    response.writeHead(status, {"Content-Type": "application/json"});
    response.end(JSON.stringify(paramsAndHeaders));
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


function addQueryParamToUrl(cleanUrl, paramName, paramValue){
  var obj = urlParser.parse(cleanUrl, true, false);
  obj.query[paramName] = paramValue;
  
  delete obj.search; // this makes format compose the search string out of the query object
  var trackedUrl = urlParser.format(obj);
  return trackedUrl;
}


function handleRequestCallback(body, response, internalRequestId){
    //showResult(body, response, 200);
    try{
        var originalResponse = responsesArray[internalRequestId];

        requestsArray[internalRequestId] = null;
        responsesArray[internalRequestId] = null;

        if(response.statusCode != 200){
            utils.reverseText("\nresponse.statusCode received: " + response.statusCode);
            console.log(utils.prettify(response.headers));
            originalResponse.statusCode = 500;
            originalResponse.headers = response.headers;
        }else{
            originalResponse.statusCode = 200;
        }

        originalResponse.write(getMockResponse());
        originalResponse.end();
    }catch(e){
        requestsArray[internalRequestId] = null;
        responsesArray[internalRequestId] = null;
        originalResponse.statusCode = 500;
        originalResponse.write(getMockResponse());
        originalResponse.end();
    }
    
}

function getMockResponse(){
    return "{status: 'ok'}";
}


function showResult(body, response, expectedHTTPCode){
    if(response.statusCode != expectedHTTPCode){
        utils.startSparkling();
    }
    console.log("\nstatusCode: " + response.statusCode + ". Expected: "+ expectedHTTPCode);
    if(response.statusCode == 403){
        console.log("X-Auth-Error Header: " + response.headers['x-auth-error-code']);
        console.log("X-Auth-Error Detail: " + response.headers['x-auth-error-detail']);
    }

    if(body && response.statusCode == 500){
        console.log("\n\n Response body: " + body);
    }

    if(response.statusCode != expectedHTTPCode){
        utils.endSparkling();
    }
    utils.endReverseComment();
}


function initialize(){
    var server = http.createServer(requestHandler);
    server.listen(serverPort, function(){
        console.log("\n\nServer listening on: http://localhost:%s", serverPort);
    });                 
}

initialize();

