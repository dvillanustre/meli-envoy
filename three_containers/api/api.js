
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

    var status = 200;

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

    var status = 200;

    response.writeHead(status, {"Content-Type": "application/json"});
    response.end(JSON.stringify(paramsAndHeaders));
}

function sendReverseConfig(request, response){
    var reverseConfig = new Object();
    console.log(reverseConfig);   

    response.writeHead(200, {"Content-Type": "application/json"});
    
    response.end(JSON.stringify(reverseConfig));
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

