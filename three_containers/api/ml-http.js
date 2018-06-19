var http = require("http");


function get(host, port, path, callback, headers, callbackParam){
		return http.get({
	          hostname: host,
			  port: port,
			  path: path,
			  headers: headers
	    }, function(response) {
			// Continuously update stream with data
	        var body = '';
	        response.on('data', function(d) {
	            body += d;
	        });
	        response.on('end', function() {
	            if(callback)callback(body, response, callbackParam);
	        });
	    });
}

function post(host, port, path, postData, callback, callbackParam){
			var options = {	
			  hostname: host,
			  port: port,
			  path: path,
			  method: 'POST',
			  headers: {
			    'Content-Type': 'text/plain',
			    'Content-Length': Buffer.byteLength(postData)
			  }
			};

			var req = http.request(options, (res) => {
				var body = '';
			  	//console.log(`STATUS: ${res.statusCode}`);
			  	//console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
			  	res.setEncoding('utf8');
			  	res.on('data', (chunk) => {
			    	body += chunk;
			  	});
			  	res.on('end', () => {
			    	if(callback)callback(body, res, callbackParam);
			  	});
			});

			req.on('error', (e) => {
			  console.log(`problem with request: ${e.message}`);
			});

			// write data to request body
			req.write(postData);
			req.end();
}

function put(host, port, path, putData, callback, callbackParam){
			var options = {	
			  hostname: host,
			  port: port,
			  path: path,
			  method: 'PUT',
			  headers: {
			    'Content-Type': 'text/plain',
			    'Content-Length': Buffer.byteLength(putData)
			  }
			};

			var req = http.request(options, (res) => {
				var body = '';
			  	//console.log(`STATUS: ${res.statusCode}`);
			  	//console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
			  	res.setEncoding('utf8');
			  	res.on('data', (chunk) => {
			    	body += chunk;
			  	});
			  	res.on('end', () => {
			    	if(callback)callback(body, res, callbackParam);
			  	});
			});

			req.on('error', (e) => {
			  console.log(`problem with request: ${e.message}`);
			});

			// write data to request body
			req.write(putData);
			req.end();
}

function createServer(handleRequestFunction){
	return http.createServer(handleRequestFunction);
}

module.exports = {
  	get: get,
	post: post,
	put: put,
	createServer: createServer
}
