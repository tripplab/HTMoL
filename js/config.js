/////////////////// VARIABLES DE CONFIGURACIÓN ////////////////////
var NoPaso = 100; //es el número de átomos por bloque para realizar la llamada a la tarjeta gráfica, no puede ser mayor de 200 debido 
//a la capacidad de los arreglos flotantes de js
//Float32Array para los vértices
//Uint16Array para índices

var radius = 0.01; //es el radio definido para la representación Spheres Bonds

var mxSize = 20999999; //es el número máximo de bytes que va a leer de una archivo, 20999999 representa aprox 21 megas

var latitudeBands = 5; //16;  //no poner menos de tres
var longitudeBands = 5; // 16; //no poner menos de tres
