        var pdbInicial='enzima.pdb'; // 'mem_chol.pdb'; // 'amb.pdb' // 'lido_dppc.pdb'
        var trjInicial='enzima.xtc';
	     
        var RepresentacionInicial='SpheresBonds'; // do not change representation here, use the 'show' command below

        var commandsDefault="select 1-9;show CPK;color white;select 3540-3549;show CPK;color red;select 0:TRP:0;show CPK;color atom;SELECT 0:0:0;"; // for enzima
//        var commandsDefault="show trace;"; // for enzima
//        var commandsDefault="select 0:0:A;show CPK;color atom;"; // for mem_chol
//        var commandsDefault="select 0:0:A;show CPK;select 0:0:B;show CPK;color atom;"; // for amb
//        var commandsDefault="select 0:0:C;show CPK;color red;select 0:0:B;show CPK;color green;select 1-22;show CPK;color blue;select 0:0:E;show CPK;color atom;select 0:0:F;show CPK;color atom;"; // for lido_dppc

	/////////////////// VARIABLES DE CONFIGURACIÓN ////////////////////
var NoPaso = 100; //es el número de átomos por bloque para realizar la llamada a la tarjeta gráfica, no puede ser mayor de 200 debido 
//a la capacidad de los arreglos flotantes de js
//Float32Array para los vértices
//Uint16Array para índices

var radius = 0.01; //es el radio definido para la representación Spheres Bonds

var mxSize = 20999999; //es el número máximo de bytes que va a leer de una archivo, 20999999 representa aprox 21 megas

var latitudeBands = 5; //16;  //no poner menos de tres
var longitudeBands = 5; // 16; //no poner menos de tres
