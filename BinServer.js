/*
This file is part of HTMoL:
Copyright (C) 2014 Dr. Mauricio Carrillo-Tripp  
http://tripplab.com

Developers:
v1.0 Leonardo Alvarez-Rivera, Francisco Javier Becerra-Toledo, Adan Vega-Ramirez 
v2.0 Javier Garcia-Vieyra
v3.0 Omar Israel Lara-Ramirez, Eduardo Gonzalez-Zavala, Emmanuel Quijas-Valades, Julio Cesar Gonzalez-Vazquez
v3.5 Leonardo Alvarez-Rivera
*/

// Update Node.js, instructions at http://www.hostingadvice.com/how-to/update-node-js-latest-version

const util = require('util');
var fs = require('fs');
eval(fs.readFileSync('local/config.js')+''); // this line reads the HTMoL configuration file, needed to know server port and location of trajectory files
var http = require('http');
var express = require('express');
var app = express();

var package = JSON.parse(fs.readFileSync('package.json'));

// Serve client side statically
app.use(express.static(__dirname));

var server = http.createServer(app);

// Start Binary.js server
var BinaryServer = require('binaryjs').BinaryServer;
var bs = BinaryServer({server: server});

var appName = "HTMoL " + package.version + " BinServer: ";

// Wait for new BinaryClient connections
bs.on('connection', function(client){
//console.log(util.inspect(client, false, null));
  client.on('stream', function(stream, meta){
	// when the BinaryClient requests a trajectory file:
  	if(meta.reqsize==true){ // the client is asking for the file size
	  	var path = TRJDIR + meta.fpath; // path to the trajectory file (meta.fpath) on the server
		fs.exists(path, function(exists) { 
			if (exists) { // if the file exists, print some info on the server's console
			//console.log(appName+"Started communication, requested file is "+path);
			var stats = fs.statSync(path);
			var fileSizeInBytes = stats["size"]; // found out the file's size
			//console.log(appName+"file size is "+fileSizeInBytes);
			client.send("size" + fileSizeInBytes); // send the size info to the BinaryClient
			 }else{
			 	client.send('error'); // if something went wrong send an error message
			 }
		});
	}else if(meta.success!==true){ // the client needs the file
	  	var path = TRJDIR + meta.fpath;
		fs.exists(path, function(exists) { 
			if (exists) {
				if(meta.verif==true){ // send a chunk first to check for file format
					var file = fs.createReadStream(path,{start: 4, end: 7});
				  	client.send(file,{natoms:true}); 
				}else{ // send the whole file
					var file = fs.createReadStream(path,{start: meta.start, end: meta.end});
				  	//file._readableState.highWaterMark=100536;
					//console.log(appName+"watermark is "+file._readableState.highWaterMark);
				  	client.send(file,{natoms:false}); 
				  }
			 }else{
			 	client.send('error'); // if something went wrong send an error message
			 } // if else exists
		}); // fs.exists
	} // if else meta.reqsize
        else{
		console.log(appName+"cID "+client.id+" IP "+meta.bsip+" requests "+meta.fpath+" "+meta.bsdatetime);
		console.log(appName+"cID "+client.id+" "+meta.bsCont+" "+meta.bsPais+" "+meta.bsCd+" Geo: lat "+meta.bslat+" lon "+meta.bslon);    
		//console.log(appName+"end of transmission");	  
	}
    
  });
});

server.listen(NodePort);
console.log(appName+"started on port " + NodePort);
