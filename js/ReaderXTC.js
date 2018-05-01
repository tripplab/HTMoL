

class ReaderXTC{



  constructor(client,st,e)
  {
    this.client=client;
    this.numframe = -1;
    this.trans=0;
    this.st = st;
    this.stop = 0;
    this.is_smaller;
    this.smallidx;
    this.flag;
    this.lsize;
    this.bitsize=0;
    this.natoms;
    this.e=e;
    this.sizeint = new Array(3);
    this.minint = new Array(3);
    this.maxint = new Array(3);
    this.sizesmall = new Array(3);
    this.part=new ArrayBuffer();
    this.precision;
    this.inv_precision;
    this.smaller;
    this.small;
    this.tam;

    this.bnd=true;
    this.bndrev=false;

    this.iarr = 0;
    this.iarr1 = 0;
    this.iarr2 = 0;
    this.arreglo = new Float32Array(50000);
    this.arreglo1 = new Float32Array(50000);
    this.arreglo2 = new Float32Array(50000);

    this.FIRSTIDX = 9;
    this.ANGS_PER_NM = 10;

    this.xtc_magicints = [0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 10, 12, 16, 20, 25, 32, 40, 50, 64,
        80, 101, 128, 161, 203, 256, 322, 406, 512, 645, 812, 1024, 1290,
        1625, 2048, 2580, 3250, 4096, 5060, 6501, 8192, 10321, 13003, 16384,
        20642, 26007, 32768, 41285, 52015, 65536, 82570, 104031, 131072,
        165140, 208063, 262144, 330280, 416127, 524287, 660561, 832255,
        1048576, 1321122, 1664510, 2097152, 2642245, 3329021, 4194304,
        5284491, 6658042, 8388607, 10568983, 13316085, 16777216
    ];


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
  }

  validate()
  {
    this.client.send("fpath", { success: false, fpath: this.fpath, reqsize: false, verif: false, start: this.readstart, end: this.readend }); // the Binaryclient is ready to ask for the whole file
    console.log("HTMoL: is XTC");
  }

  getFile(data,tam)
  {
      this.trans += data.byteLength;
      this.tam=tam;
      var tmp = new Uint8Array(this.part.byteLength + data.byteLength);
      tmp.set(new Uint8Array(this.part), 0);
      tmp.set(new Uint8Array(data), this.part.byteLength);
      this.part = tmp.buffer;
      if (trjFormat=='XTC') {
          if (this.st == 1) {
              if (this.bndrev == true) {
                  for (var i = 0; i < 5; i++) {
                      if (new DataView(this.part).getInt32(i) != 1995) {
                          console.log("HTMoL3: ACA ");
                      } else {
                          this.part = this.part.slice(i);
                          this.bndrev = false;
                          console.log("HTMoL3: AQUI" + new DataView(this.part).getInt32(0));

                          break;
                      }
                  }
              }
              this.checkfile(this.part);
              this.st = 0;
          }
          if (this.stop == 0) {
              this.readhead(this.part);
          }
      }
      else
      {

      }
  }


  checkfile(buffer) {
      if (new DataView(buffer).getInt32(0) != 1995) {
          throw new Error("HTMoL3: Error. File is not an XTC-File! ");
          this.stop = 1;
          return -1;
      }
      this.natoms = new DataView(buffer).getInt32(4);
      if (this.natoms != this.e.data.natoms) {
          throw Error("HTMoL3:  Bad format or number of atoms on file are not equal (TRJ:"+this.natoms+" PDB:"+this.e.data.natoms+")");
          this.stop = 1;
          return -1;
      }
  }

  readhead(buffer) {
      //var x = new Array(3);
      //var y = new Array(3);
      //var z = new Array(3);
      var bitsizeint = new Array(3);

      var buf = new Array(4);
      var position = 0;
      //if(new DataView(buffer).getInt32(position)!=1995){
      //return -1;
      //}else{
      position += 4;
      //}
      //natoms = new DataView(buffer).getInt32(position);
      //if(natoms!=main.Obj3D.molecule.GetAtoms().length){
      //alert("This file not is valid for this molecule");
      //disconnect=true;
      //return;
      //}
      position += 4;

      //step = new DataView(buffer).getInt32(position);
      position += 4;

      //time = new DataView(buffer).getFloat32(position);
      position += 4;

      //for(i=0;i<3;i++){
      //x[i] = new DataView(buffer).getFloat32(position);
      //y[i] = new DataView(buffer).getFloat32(position+4);
      //z[i] = new DataView(buffer).getFloat32(position+8);
      position += 36; //*36 without for cicle
      //}

      this.lsize = new DataView(buffer).getInt32(position);
      var size = this.lsize;
      position += 4;

      this.precision = new DataView(buffer).getFloat32(position);
      position += 4;

      for (var i = 0; i < 3; i++) {
          this.minint[i] = new DataView(buffer).getInt32(position);
          this.maxint[i] = new DataView(buffer).getInt32(position + 12);
          position += 4;
      }
      position += 12;

      this.sizeint[0] = this.maxint[0] - this.minint[0] + 1;
      this.sizeint[1] = this.maxint[1] - this.minint[1] + 1;
      this.sizeint[2] = this.maxint[2] - this.minint[2] + 1;

      if ((this.sizeint[0] | this.sizeint[1] | this.sizeint[2]) > 0xffffff) {
          bitsizeint[0] = this.xtc_sizeofint(this.sizeint[0]);
          bitsizeint[1] = this.xtc_sizeofint(this.sizeint[1]);
          bitsizeint[2] = this.xtc_sizeofint(this.sizeint[2]);
          this.bitsize = 0; // flag the use of large sizes
      } else {
          bitsizeint[0] = this.xtc_sizeofint(this.sizeint[0]);
          this.bitsize = this.xtc_sizeofints(3, this.sizeint);
      }

      this.smallidx = new DataView(buffer).getInt32(position);
      position += 4;

      this.smaller = (this.xtc_magicints[this.FIRSTIDX > this.smallidx - 1 ? this.FIRSTIDX : this.smallidx - 1] / 2) | 0;
      this.small = (this.xtc_magicints[this.smallidx] / 2) | 0;
      this.sizesmall[0] = this.sizesmall[1] = this.sizesmall[2] = (this.xtc_magicints[this.smallidx] >>> 0);

      buf[0] = new DataView(buffer).getInt32(position);
      position += 4;

      if (buf[0] < 0) return -1;

      if ((this.part.byteLength - 92) >= buf[0]) {
          this.part = buffer.slice(position);
          this.calculatecoords(this.part, buf);
      }
  }


  readFile(natoms)
  {
    if(!natoms){
      var myfloat = this.arreglo.subarray(0, this.iarr);
      var myfloat1 = this.arreglo1.subarray(0, this.iarr1);
      var myfloat2 = this.arreglo2.subarray(0, this.iarr2);
      self.postMessage({
          cmd: "enviar",
          dato: myfloat,
          dato1: myfloat1,
          dato2: myfloat2,
          bndarray: this.bnd
      });

      this.trans = 0;
      this.st = 1;
      this.iarr = 0, this.iarr1 = 0, this.iarr2 = 0;

      self.postMessage({ cmd: "final", wast: this.part.byteLength - 1 });
      this.bnd = !this.bnd;
      if (this.readend >= this.tam) {
          //console.log("HTMoL3: final");
          this.bnd = true;
          this.readend = 0;
          this.readstart = 0;
          this.bndrev = false;
          self.postMessage({ cmd: "endfinal" });
          this.client.send("fpath", { success: true, fpath: this.fpath, reqsize: false, verif: false, bsip: this.bsip, bslat: this.bslat, bslon: this.bslon, bsCont: this.bsCont, bsPais: this.bsPais, bsCd: this.bsCd, bsdatetime: this.bsdatetime }); // tell BinServer the Binaryclient has received the whole file
      }
    }
  }

  xtc_sizeofint(size) {
      var num = (1 >>> 0);
      var ssize = (size >>> 0);
      var nbits = 0;

      while (ssize >= num && nbits < 32) {
          nbits++;
          num <<= 1;
      }

      return nbits;
  }

  xtc_sizeofints(nints, sizes) {
      var i;
      var num;
      var nbytes, nbits, bytecnt, tmp;
      var bytes = new Array(32);
      nbytes = (1 >>> 0);
      bytes[0] = (1 >>> 0);
      nbits = 0;

      for (i = 0; i < nints; i++) {
          tmp = 0;
          for (bytecnt = 0; bytecnt < nbytes; bytecnt++) {
              tmp = (bytes[bytecnt] >>> 0) * (sizes[i] >>> 0) + (tmp >>> 0);
              bytes[bytecnt] = (tmp >>> 0) & 0xff;
              tmp >>= 8;
          }

          while (tmp != 0) {
              bytes[bytecnt++] = (tmp >>> 0) & 0xff;
              tmp >>= 8;

          }
          nbytes = (bytecnt >>> 0);
      }
      num = 1;
      nbytes--;

      while (bytes[nbytes] >= num) {
          nbits++;
          num *= 2;

      }

      return nbits + nbytes * 8;
  }


  calculatecoords(buffer, buf) {
      var thiscoord = new Array(3);
      var prevcoord = new Array(3);
      var lfp = [];
      var cntcoor = 0;
      var j = 0;
      var tmp=0;
      buf[3] = buffer.slice(0, buf[0]);
      buf[0] = buf[1] = buf[2] = 0;
      //lfp = fp;
      this.inv_precision = 1.0 / (this.precision);
      var run = 0;
      var i = 0;
      var lip = null;
      this.numframe++;

      //thiscoord[0] = xtc_receivebits(buf, bitsizeint[0]);
      while (i < this.lsize) {
          //thiscoord=lip+i*3;
          if (this.bitsize == 0) {
              // hd: in this case this code will be never loaded
              thiscoord[0] = this.xtc_receivebits(buf, bitsizeint[0]);
              thiscoord[1] = this.xtc_receivebits(buf, bitsizeint[1]);
              thiscoord[2] = this.xtc_receivebits(buf, bitsizeint[2]);
          } else {
              this.xtc_receiveints(buf, 3, this.bitsize, this.sizeint, thiscoord);
          }

          i++;

          thiscoord[0] += this.minint[0];
          thiscoord[1] += this.minint[1];
          thiscoord[2] += this.minint[2];

          prevcoord[0] = thiscoord[0];
          prevcoord[1] = thiscoord[1];
          prevcoord[2] = thiscoord[2];

          this.flag = this.xtc_receivebits(buf, 1);
          this.is_smaller = 0;

          if (this.flag == 1) {
              run = this.xtc_receivebits(buf, 5);
              this.is_smaller = run % 3;
              run -= this.is_smaller;
              this.is_smaller--;
          }

          if (run > 0) {
              //thiscoord += 3; // HD note: just effects that all elements in the array thiscoord gets the value 0
              for (var k = 0; k < run; k += 3) {

                  this.xtc_receiveints(buf, 3, this.smallidx, this.sizesmall, thiscoord);
                  i++;
                  thiscoord[0] += prevcoord[0] - this.small;
                  thiscoord[1] += prevcoord[1] - this.small;
                  thiscoord[2] += prevcoord[2] - this.small;


                  if (k == 0) {
                      // interchange first with second atom for better
                       // compression of water molecules
                       //

                      tmp = thiscoord[0];
                      thiscoord[0] = prevcoord[0];
                      prevcoord[0] = tmp;
                      tmp = thiscoord[1];
                      thiscoord[1] = prevcoord[1];
                      prevcoord[1] = tmp;
                      tmp = thiscoord[2];
                      thiscoord[2] = prevcoord[2];
                      prevcoord[2] = tmp;

                      lfp[cntcoor] = prevcoord[0] * this.inv_precision;
                      lfp[cntcoor + 1] = prevcoord[1] * this.inv_precision;
                      lfp[cntcoor + 2] = prevcoord[2] * this.inv_precision;
                      cntcoor += 3;

                  } else {
                      prevcoord[0] = thiscoord[0];
                      prevcoord[1] = thiscoord[1];
                      prevcoord[2] = thiscoord[2];


                  }

                  lfp[cntcoor] = thiscoord[0] * this.inv_precision;
                  lfp[cntcoor + 1] = thiscoord[1] * this.inv_precision;
                  lfp[cntcoor + 2] = thiscoord[2] * this.inv_precision;
                  cntcoor += 3;
              } // loop for

          } else {
              lfp[cntcoor] = thiscoord[0] * this.inv_precision;
              lfp[cntcoor + 1] = thiscoord[1] * this.inv_precision;
              lfp[cntcoor + 2] = thiscoord[2] * this.inv_precision;
              cntcoor += 3;
          }

          this.smallidx += this.is_smaller;
          if (this.is_smaller < 0) {
              this.small = this.smallerer;
              if (this.smallidx > this.FIRSTIDX) {
                  this.smallerer = this.xtc_magicints[this.smallidx - 1] / 2;
              } else {
                  this.smallerer = 0;
              }
          } else if (this.is_smaller > 0) {
              this.smallerer = this.small;
              this.small = this.xtc_magicints[this.smallidx] / 2;
          }
          this.sizesmall[0] = this.sizesmall[1] = this.sizesmall[2] = this.xtc_magicints[this.smallidx];


      }

      //Scale
      for (var n = 0; n < this.natoms * 3; n++) {
          lfp[n] *= this.ANGS_PER_NM;
      }

      var row = 1;
      var counter = 0;
      //atom=main.Obj3D.molecule.GetAtoms()[counter];
      do {

          if (row > 3) {
              row = 1;
              counter++;
              //atom=main.Obj3D.molecule.GetAtoms()[counter];
          }

          //var floatTmp = lfp[j]/ANGS_PER_NM;

          if (row == 1) {
              this.arreglo[this.iarr] = lfp[j];
              this.iarr++;
          } else if (row == 2) {

              this.arreglo1[this.iarr1] = lfp[j];
              this.iarr1++;
          } else if (row == 3) {
              this.arreglo2[this.iarr2] = lfp[j];
              this.iarr2++;
          }

          if (this.iarr2 == this.arreglo2.length) {
              this.iarr2 = 0, this.iarr1 = 0, this.iarr = 0;
              self.postMessage({
                  cmd: "enviar",
                  dato: this.arreglo,
                  dato1: this.arreglo1,
                  dato2: this.arreglo2,
                  bndarray: this.bnd
              });
          }

          row++;
          j++;
      } while (j < this.natoms * 3);

      //          console.log(buffer.byteLength + "   " + buf[3].byteLength);

      if (buffer.byteLength >= buf[3].byteLength + 9) {
          for (i = 0; i < 5; i++) {
              if (buffer.byteLength > buf[3].byteLength + i) {
                  if (new DataView(buffer).getInt32(buf[3].byteLength + i) != 1995) {} else {
                      break;
                  }
              }
          }

          this.part = buffer.slice(buf[3].byteLength + i);
      } else if (this.trans < this.tam) {
          this.part = buffer.slice(buf[3].byteLength);
          this.bndrev = true;
      }
      //console.log("HTMoL3: "+this.part.byteLength);

      if (this.part.byteLength >= 92) {
        var  nextbuf = new DataView(this.part).getInt32(88);
          if (this.part.byteLength >= 92 + nextbuf) {
              //console.log("pasa");
              this.readhead(this.part);
          }
      }

  }

  xtc_receivebits(buf, nbits) {
      var cnt, num;
      var lastbits, lastbyte, tmplast;
      var cbuf;
      var mask = (1 << nbits) - 1;
      cbuf = buf[3];
      cnt = buf[0];
      lastbits = (buf[1] >>> 0);
      lastbyte = (buf[2] >>> 0);

      num = 0;
      while (nbits >= 8) {
          var minum = this.getInt8(cnt, cbuf);
          lastbyte = ((lastbyte >>> 0) << 8) | (minum >>> 0);
          cnt += 8;
          num |= ((lastbyte >>> 0) >> (lastbits >>> 0)) << (nbits - 8);
          nbits -= 8;

      }

      if (nbits > 0) {
          if (lastbits < (nbits >>> 0)) {
              lastbits += 8;
              minum = this.getInt8(cnt, cbuf);
              lastbyte = ((lastbyte >>> 0) << 8) | (minum >>> 0);
              cnt += 8;
          }

          lastbits -= nbits;
          num |= ((lastbyte >>> 0) >> (lastbits >>> 0)) & ((1 << nbits) - 1);
      }
      num &= mask;
      buf[0] = cnt;
      buf[1] = (lastbits >>> 0);
      buf[2] = (lastbyte >>> 0);
      return num;
  }

  xtc_receiveints(buf, nints, nbits, sizes, nums) {
      var bytes = new Array(32);
      var i, j, nbytes, p, num;

      bytes[1] = bytes[2] = bytes[3] = 0;
      nbytes = 0;
      i = 0;

      do {
          bytes[i] = 0;
          i++;
      } while (i < 32);

      while (nbits > 8) {
          bytes[nbytes] = parseInt(this.xtc_receivebits(buf, 8));
          nbytes++;
          nbits -= 8;
      }


      if (nbits > 0) {
          bytes[nbytes] = parseInt(this.xtc_receivebits(buf, nbits));
          nbytes++;
      }

      for (i = nints - 1; i > 0; i--) {
          num = 0;

          for (j = nbytes - 1; j >= 0; j--) {
              num = (num << 8) | bytes[j];
              p = parseInt(num / (sizes[i] >>> 0));
              bytes[j] = p;
              num = num - p * (sizes[i] >>> 0);
          }
          nums[i] = num;
      }

      nums[0] = bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24);


  }

  getInt8(idx, buf) {
      var buffer = buf;
      var u8 = new Uint8Array(buf);
      var bidx = idx / 8 | 0;
      var a = u8[bidx];
      return a;
  }
}
