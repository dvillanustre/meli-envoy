var readline = require('readline');

function continueWith(callback){
	if(config.selfpacedTests){
		const rl = readline.createInterface({
		  input: process.stdin,
		  output: process.stdout
		});
		rl.question('\nPress Enter to continue... ', (answer) => {
			console.log("\n");
		  	rl.close();
		  	callback();
		  	
		});
	}else{
		callback();
	}
	
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function prettify(json){
	return JSON.stringify(json, null, 2);
}

function reverseComment(msg){
	startReverseComment();
	console.log(msg);
	endReverseComment();
}

function reverseText(msg){
	console.log("\x1b[1m" + msg + "\x1b[0m");
}

function sparkleText(msg){
	console.log("\x1b[5m" + msg + "\x1b[0m");
}

function startSparkling(){
	console.log("\x1b[5m");
}

function endSparkling(){
	console.log("\x1b[0m");
}

function startReverseComment(optionalMsg){
	console.log("\n\n======================================================================================================================================================\x1b[1m");
	if(optionalMsg)console.log(optionalMsg);
}


function endReverseComment(optionalMsg){
	if(optionalMsg)console.log(optionalMsg);
	console.log("\x1b[0m======================================================================================================================================================");
}

function clearScreen(){
	console.log('\033[2J');
}

function continueWith(callback){
	const rl = readline.createInterface({
		  input: process.stdin,
		  output: process.stdout
		});
		rl.question('\nPress Enter to continue... ', (answer) => {
			console.log("\n");
		  	rl.close();
		  	callback();
		});
}

function isThisProd(){
    return process.env.DATACENTER == "vir" || process.env.DATACENTER == "atl";
}


module.exports = {
  	continueWith: continueWith,
	guid: guid,
	prettify: prettify,
	reverseComment: reverseComment,
	sparkleText: sparkleText, 
	startSparkling: startSparkling,
	endSparkling: endSparkling,
	reverseText: reverseText, 
	startReverseComment: startReverseComment,
	endReverseComment: endReverseComment,
	clearScreen: clearScreen,
	continueWith: continueWith,
	isThisProd: isThisProd
}