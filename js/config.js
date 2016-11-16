/////////////////// VARIABLES DE CONFIGURACIÓN ////////////////////

var RepresentacionInicial='SpheresBonds';
//var RepresentacionInicial='Bonds';
//var RepresentacionInicial='CPK';
//var RepresentacionInicial='Skeleton';


var NoPaso = 100; //es el número de átomos por bloque para realizar la llamada a la tarjeta gráfica, no puede ser mayor de 200 debido 
//a la capacidad de los arreglos flotantes de js
//Float32Array para los vértices
//Uint16Array para índices

var pdbInicial='1crn.pdb';

var radius = 0.2; //es el radio definido para la representación Spheres Bonds

var mxSize = 20999999; //es el número máximo de bytes que va a leer de una archivo, 20999999 representa aprox 21 megas