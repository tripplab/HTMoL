var fs = require('fs');
var http = require('http');

// Serve client side statically
var express = require('express');
var app = express();
//se coloca la ip del puerto que se desea abrir en vez del puerto 80
var port=25565;
//var port=80;
app.use(express.static(__dirname));

var server = http.createServer(app);

// Start Binary.js server
var BinaryServer = require('binaryjs').BinaryServer;
var bs = BinaryServer({server: server});

// Wait for new user connections
bs.on('connection', function(client){
  client.on('stream', function(stream, meta){

  	if(meta.reqsize==true){
	  	var path = "xtcfiles/" + meta.fpath;
		fs.exists(path, function(exists) { 
			if (exists) { 
			console.log(path);
			var stats = fs.statSync(path);
			var fileSizeInBytes = stats["size"];
			console.log(fileSizeInBytes);
			client.send("size" + fileSizeInBytes);
			 }else{
			 	client.send('error');
			 }
		});
	}else{
	  	var path = "xtcfiles/" + meta.fpath;
		fs.exists(path, function(exists) { 
			if (exists) {
				if(meta.verif==true){
					var file = fs.createReadStream(path,{start: 4, end: 7});
				  	client.send(file,{natoms:true}); 
				}else{
					var file = fs.createReadStream(path,{start: meta.start, end: meta.end});
				  	//file._readableState.highWaterMark=100536;
					console.log(file._readableState.highWaterMark);
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

server.listen(port);
console.log('HTTP and BinaryJS server started on port ' + port);
