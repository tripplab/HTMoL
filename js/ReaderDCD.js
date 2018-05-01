class ReaderDCD{
  constructor(client,e){
    this.client=client;
    this.e=e;
    this.bndrev=false;
    this.readstart = e.data.readstart;
    this.readend = e.data.readend;
    this.fpath = e.data.fpath;
    this.bsip = e.data.bsip;
    this.bslat = e.data.bslat;
    this.bslon = e.data.bslon;
    this.bsCont = e.data.bsCont;
    this.bsPais = e.data.bsPais;
    this.bsCd = e.data.bsCd;
    this.bsdatetime = e.data.bsdatetime;

      this.bnd = true;

    this.trans=0;
    this.part=new ArrayBuffer();

    this.endianess=false;

    //Variables DCD
    this.rec_scale64 = false;
    this.charmm = false;
    this.hdrbuf;
    this.n_csets;
    this.first_ts;
    this.framefreq;
    this.n_fixed;
    this.timestep;
    this.unitcell;
    this.noremarks;
    this.dcdtitle;
    this.remarks;
    this.n_atoms;
    this.ntitle;
    this.n_floats;
    this.s;
    this.paso=0;
    this.arregl = new Float32Array(50000);
    this.arregl1 = new Float32Array(50000);
    this.arregl2 = new Float32Array(50000);
  }

  validate()
  {
    this.client.send("fpath", { success: false, fpath: this.fpath, reqsize: false, verif: false, start: this.readstart, end: this.readend }); // the Binaryclient is ready to ask for the whole file
    console.log("HTMoL: is DCD by readerDCD");
  }

  getFile(data)
  {
    this.trans += data.byteLength;
    var tmp = new Uint8Array(this.part.byteLength + data.byteLength);
    //console.log(tmp);
    tmp.set(new Uint8Array(this.part), 0);
    tmp.set(new Uint8Array(data), this.part.byteLength);
    this.part = tmp.buffer;
  }

  sendInfo()
  {
    this.bnd = true;
    this.readend = 0;
    this.readstart = 0;
    this.bndrev = false;
    self.postMessage({ cmd: "endfinal" });
    this.client.send("fpath", { success: true, fpath: this.fpath, reqsize: false, verif: false, bsip: this.bsip, bslat: this.bslat, bslon: this.bslon, bsCont: this.bsCont, bsPais: this.bsPais, bsCd: this.bsCd, bsdatetime: this.bsdatetime }); // tell BinServer the Binaryclient has received the whole file
  }

  endianness () {
    var b = new ArrayBuffer(4);
    var a = new Uint32Array(b);
    var c = new Uint8Array(b);
    a[0] = 0xdeadbeef;
    if (c[0] == 0xef) return 'LE';
    if (c[0] == 0xde) return 'BE';
    throw new Error('unknown endianness');
  }

  swap32(val,endian)
  { //Esta funcion voltea la endianess segun la bandera endian
    if(endian)
    {
           return ((val & 0xFF) << 24)
            | ((val & 0xFF00) << 8)
            | ((val >> 8) & 0xFF00)
            | ((val >> 24) & 0xFF);
    }
    else //si no hay necesidad de voltearlo lo regresa igual
      return val;
  }


swaparray(buf,endian) //Para hacer swap a un arreglo
{
  if(endian)
  {
    var endi=false;
    if(this.endianness()=='BE')
    {
      endi=true;
    }
    var n=new Float32Array(this.n_atoms+2);
    for(var i=0,index=0;i<n.length;i++,index+=4)
    {
      n[i]=new DataView(buf).getFloat32(index,endi);
    }
    return n;
    }
    else
    {
      return new Float32Array(buf);
    }
  }

  readFile() {
      var doc = new Int32Array(this.part); // Se ven los bytes como Ints de 4 Bytes
      if (doc[0] + doc[1] == 84)
      { //Todos los Archivos DCD Empiezan con un 84 seguido de la palabra CORD
          console.log("HTMoL3: 64 bits Rescale ");
          this.rec_scale64 = true; //Se Activa La Bandera de que son Numeros de 64bits(8 Bytes)
          throw new error("HTMoL3: Error. 64 bit Format Is not Supported");
      } else if (doc[0] == 84 && doc[1] == 1146244931)
      { //Valor de la palabra CORD en Numero
          console.log("HTMoL3: 32 bit Rescale" );
          this.rec_scale64 = false; //Se desactiva la bandera son enteros comunes 32bits(4 bytes)
      } else if(this.swap32(doc[0],true)==84 && doc[1]==1146244931)
      {
          endianess=true;
          console.log("HTMoL3: I need to change DCD file endianess");
      }else if(doc[0]==null)
      {
        throw new Error("HTMoL3: Connection delay, but don't worry, I'm still loading DCD file...");
      }
      else
      {
          throw new Error("HTMoL3: Error. DCD CORD or Initial 84 Not Found");
      }
      if (!this.rec_scale64) { //Proceso si el archivo maneja enteros de 32bits
          this.hdrbuf = new Int32Array(doc.subarray(2, 22)); //Se Lee encabezado(80 Bytes)
          //console.log(this.hdrbuf);
          if (this.hdrbuf[-1] != 0) { //Si el ultimo valor del encabezado 0 es formato X-PLOR de lo contrario es CHARMM
              this.charmm = true;
          } else {
              throw new Error("HTMoL3: Error. DCD X-plor Format Not Supported"); //Por Ahora
          }
          this.n_csets = this.swap32(this.hdrbuf[0],this.endianess); //Numero de sets de
          this.first_ts = this.swap32(this.hdrbuf[1],this.endianess); //Cuadro desde el que inicia la animacion
          this.framefreq = this.swap32(this.hdrbuf[2],this.endianess); //Cantidad de Cuadros entre archivos dcd
          this.n_fixed = this.swap32(this.hdrbuf[8],this.endianess); // Cantidad De Atomos Fijos


          if (this.n_fixed != 0) {
              throw new Error("HTMoL3: Error. DCD Trajectories with Fixed Atoms are Not Supported");
          }

          this.timestep = this.swap32(this.hdrbuf[9],this.endianess); //Cantidad De Cuadros Por segundo
          this.unitcell = this.swap32(this.hdrbuf[10],this.endianess) == 1; //Indica si Hay Informacion de Unitcell

          if(this.unitcell)
          {
            this.paso=14;
          }

          if (this.swap32(doc[22],this.endianess) != 84) { //Estas validaciones verifican el fin del bloque....
              throw new Error("HTMoL3: Error. DCD Bad Format");
          }
          if ((this.swap32(doc[23],this.endianess) - 4) % 80 != 0) { //y El inicio del siguiente
              throw new Error("HTMoL3: Error. DCD Bad Format");
          }
          this.noremarks = this.swap32(doc[23],this.endianess) == 84; //Se verifica si hay remarks
          this.ntitle = this.swap32(doc[24],this.endianess); // se lee ntitle
          var pos=25; //Variable para posicion, A partir de este punto puede haber variaciones
          this.dcdtitle = new Uint32Array(doc.subarray(pos, pos+(this.ntitle*20))); //Se lee dcdtitle
          pos+=(this.ntitle*20);
          if ((this.swap32(doc[pos],this.endianess) - 4) % 80 != 0 || this.swap32(doc[pos+1],this.endianess) != 4) { //Aqui se valida el fin del bloque
              throw new Error("HTMoL3: Error. DCD Bad Format");
          }
          pos+=2;
          this.n_atoms = this.swap32(doc[pos],this.endianess);
          pos++;
          if (this.swap32(doc[pos],this.endianess) != 4 || this.n_atoms!=this.e.data.natoms) {
              throw new Error("HTMoL3: Error. Bad Format or Number of Atoms on file are not equal (TRJ:"+this.n_atoms+" PDB:"+this.e.data.natoms+")");
          }
          pos+=this.paso+1;
          var buff= new Float32Array(this.part);
          this.n_floats=this.n_atoms+2;
                for(var i=0;i<this.n_csets;i++)
                {
                  var arr = new Float32Array(buff.subarray(pos, pos+this.n_floats));
                  arr=this.swaparray(arr.buffer,this.endianess);
                  pos+=this.n_floats;
                  var arr1 = new Float32Array(buff.subarray(pos, pos+this.n_floats));
                  arr1=this.swaparray(arr1.buffer,this.endianess);
                  pos+=this.n_floats;
                  var arr2 = new Float32Array(buff.subarray(pos, pos+this.n_floats));
                  arr2=this.swaparray(arr2.buffer,this.endianess);
                  self.postMessage({
                      cmd: "enviar",
                      dato: arr.subarray(1,-1),
                      dato1: arr1.subarray(1,-1),
                      dato2: arr2.subarray(1,-1),
                      bndarray: this.bnd
                  });
                  pos+=this.n_floats+this.paso;
                }


          console.log("HTMoL3: Fin de lectura");

          this.sendInfo();
      }
  }

}
