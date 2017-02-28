/*
This file is part of HTMoL:
Copyright (C) 2015 Mauricio Carrillo-Tripp  
http://tripplab.com

Developers:
v1.0 Leonardo Alvarez-Rivera, Francisco Javier Becerra-Toledo, Adan Vega-Ramirez 
v2.0 Javier Garcia-Vieyra, Omar Israel Lara-Ramirez
*/

// =============================== User defined variables =================================

// Apache listens at port 80 by default. We have to use a different port for Node.
var NodePort=69;
// MD trajectory files will be at this default location
var TRJDIR="trjfiles/";

// ========================================================================================


var fs = require('fs');
var http = require('http');
var express = require('express');
var app = express();
// Serve client side statically
app.use(express.static(__dirname));

var server = http.createServer(app);

// Start Binary.js server
var BinaryServer = require('binaryjs').BinaryServer;
var bs = BinaryServer({server: server});

// Wait for new user connections
bs.on('connection', function(client){
  client.on('stream', function(stream, meta){

  	if(meta.reqsize==true){
	  	var path = TRJDIR + meta.fpath;
		fs.exists(path, function(exists) { 
			if (exists) { 
			console.log("HTMoL3: "+path);
			var stats = fs.statSync(path);
			var fileSizeInBytes = stats["size"];
			console.log("HTMoL3: "+fileSizeInBytes);
			client.send("size" + fileSizeInBytes);
			 }else{
			 	client.send('error');
			 }
		});
	}else{
	  	var path = TRJDIR + meta.fpath;
		fs.exists(path, function(exists) { 
			if (exists) {
				if(meta.verif==true){
					var file = fs.createReadStream(path,{start: 4, end: 7});
				  	client.send(file,{natoms:true}); 
				}else{
					var file = fs.createReadStream(path,{start: meta.start, end: meta.end});
				  	//file._readableState.highWaterMark=100536;
					console.log("HTMoL3: "+file._readableState.highWaterMark);
				  	client.send(file,{natoms:false}); 
				  }
			 }else{
			 	client.send('error');
			 }
	});
	}
  });
});
//
//

server.listen(NodePort);
console.log("HTMoL3: HTTP and BinaryJS server started on port " + NodePort);
