class ReaderNC{


    constructor(client,e){
        this.arrCoordX = new Float32Array(50000);
        this.arrCoordY = new Float32Array(50000);
        this.arrCoordZ = new Float32Array(50000);

        this.client=client;
        this.e=e;
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


        this.trans=0;

        this.bnd=true;

        this.numAtom=0;

        this.bndFinal=false;
        this.bndCoordX=true;
        this.bndCoordY=false;
        this.bndCoordZ=false;

        this.lastPart="";
    }

    validate()
    {
      this.client.send("fpath", { success: false, fpath: this.fpath, reqsize: false, makefile: true, verif: false, start: this.readstart, end: this.readend }); // the Binaryclient is ready to ask for the whole file
      console.log("HTMoL: is NC by readerNC");
    }

    getFile(data,natoms)
    {
        var coordinatesStartIndex= data.indexOf("coordinates =");
        if(coordinatesStartIndex>=0)
            coordinatesStartIndex=coordinatesStartIndex+14;
        else
            coordinatesStartIndex=0;

        var part=data.substring(coordinatesStartIndex,data.length);
        part=this.lastPart+part;
        this.lastPart="";
        this.prepareAtomsData(part);

    }


    readFile()
    {


        self.postMessage({
            cmd: "enviar",
            dato: this.arrCoordX,
            dato1: this.arrCoordY,
            dato2: this.arrCoordZ,
            bndarray: this.bnd
        });

        self.postMessage({ cmd: "endfinal" });

        this.client.send("fpath", { success: true, fpath: this.fpath, reqsize: false, verif: false, bsip: this.bsip, bslat: this.bslat, bslon: this.bslon, bsCont: this.bsCont, bsPais: this.bsPais, bsCd: this.bsCd, bsdatetime: this.bsdatetime }); // tell BinServer the Binaryclient has received the whole file

    }


    prepareAtomsData(part)
    {
      var totalComas=(part.match(/\n/g) || []).length;
      var deseadasComas=parseInt(totalComas);
      var indexLastComa=part.lastIndexOf("\n");
      var partFinal;

      if(totalComas>deseadasComas)
      {
        this.lastPart=part.substr(indexLastComa,part.length-1)+this.lastPart;
        partFinal=part.substr(0,indexLastComa);
        this.prepareAtomsData(partFinal);
      }
      else {
        this.lastPart=part.substr(indexLastComa+2,part.length-1)+this.lastPart;
        partFinal=part.substr(0,indexLastComa-1);
        if(partFinal.charAt(partFinal.length-1)=== ";")
          this.bndFinal=true;

          this.splitAtoms(partFinal);
      }
    }

    splitAtoms(part){
        var bndComa=false;

        var atomSplit = part.split("\n");

        console.log(atomSplit.length);

        for(var p=0;p<atomSplit.length;p++)
        {
            var coordSplit = atomSplit[p].split(",");


            this.arrCoordX[this.numAtom] = coordSplit[0];
            this.arrCoordY[this.numAtom] = coordSplit[1];
            this.arrCoordZ[this.numAtom] = coordSplit[2];
            if(p===atomSplit.length-1)
            console.log("x:"+this.arrCoordX[this.numAtom]+" y:"+this.arrCoordY[this.numAtom]+" z:"+  this.arrCoordZ[this.numAtom]+" Bnd: "+bndComa+" Atomos: "+this.numAtom);

            this.numAtom++;


        }

    }

}
