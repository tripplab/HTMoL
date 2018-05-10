/*
This file is part of HTMoL:
Copyright (C) 2014 Dr. Mauricio Carrillo-Tripp  
http://tripplab.com
Developers:
v1.0 Leonardo Alvarez-Rivera, Francisco Javier Becerra-Toledo, Adan Vega-Ramirez 
v2.0 Javier Garcia-Vieyra
v3.0 Omar Israel Lara-Ramirez, Eduardo González-Zavala, Emmanuel Quijas-Valades, Julio Cesar González-Vázquez
v3.5 Leonardo Alvarez-Rivera
*/

  
//  self.importScripts('../local/config.js'); Parameter values should not be passed on a file but from the call to the function(e) of the worker
  self.importScripts('binary.js');
  self.importScripts('../js/ReaderXTC.js');
  self.importScripts('../js/ReaderDCD.js');
  var readstart = 0,
      readend = 0,
      bnd = true,
      bndrev = false;

  self.addEventListener('message', function(e) {
    //console.dir(e.data.cmd)
      if (e.data.cmd == "startfile") {

//          if (e.data.bitrate == "infinity") {
//              console.log("HTMoL3: "+"bitrate es infinity");
//          } else {
//              console.log("HTMoL3: bitrate es "+e.data.bitrate);
//          }
  
          WebIP = e.data.WebIP;
          NodePort = e.data.NodePort;
          var client = new BinaryClient("ws://"+WebIP+":"+NodePort);     
          var st = 1;
	  var tam = 0;
    
          trjFormat = e.data.trjFormat;
          readstart = e.data.readstart;
          readend = e.data.readend;
          fpath = e.data.fpath;
	      
	  //instancias a las clases que se encargan de las lecturas de archivos XTC y DCD
	  var readerXTC = new ReaderXTC(client,st,e);
          var readerDCD = new ReaderDCD(client,e);
	  
	  //retardo para alcanzar a crear el binaryclient
          setTimeout(function() {
              client.send("fpath", { success: false, fpath: fpath, reqsize: true, verif: false}); // ask for the file size
              console.log("HTMoL: BinaryClient requesting "+fpath+" from "+readstart+" to "+readend);
          }, 2000);
	  
          client.on('stream', function(stream, meta) {
              // Buffer for parts:

              // Got new data
              stream.on('data', function(data) {
                  try {
                      if (data == 'error') {
                          throw Error("HTMoL: Error. File does not exists or corrupt.");
                      } else if (data.slice(0, 4) == "size") { // the previous call to client.send worked, we got info on the data object
                          tam = parseInt(data.slice(4)); // found out what the file size is
                          //    self.postMessage({cmd:"sizefile",
                          //          sizef:tam); 
                          client.send("fpath", { success: false, fpath: fpath, reqsize: false, verif: true, start: 4, end: 7 }); // now ask for a chunk to determine trajectory file format
                          console.log("HTMoL: verif OK, size = "+tam);
                      } else if (meta.natoms == true) { 
                          if (new DataView(data).getInt32(0) == e.data.natoms) {
                              init = 1;
                                readerXTC.validate();
                          } else if(new DataView(data).getInt32(0) == 1146244931 || new DataView(data).getInt32(0,1) == 1146244931 ) {
                               readerDCD.validate();
                          }
                          else{
                            throw new Error("HTMoL: Unrecognized or damaged file. Number of atoms on file are not equal (TRJ:"+new DataView(data).getInt32(0)+" PDB:"+e.data.natoms+")");
                          }
                      } else { // receiving the whole file
                          //    console.log(part.byteLength);
                          if(trjFormat=="XTC")
                          readerXTC.getFile(data,tam);

                          if(trjFormat=="DCD")
                          readerDCD.getFile(data);
                      } // received the whole file
                  } catch (err) {
                      throw err;
                  }
              });
              stream.on('end', function() {
		  if (trjFormat=="DCD")
                    readerDCD.readFile();
                  if (trjFormat=="XTC")
                    readerXTC.readFile(meta.natoms);
              }); // stream.on('end'
          }); // client.on('stream'
      } else {
          //console.log(e.data.getdataworker);
          //console.log(iarr);
      } // if (e.data.cmd == "startfile")

      //self.postMessage(e.data);
}, false); // self.addEventListener('message'
