// =============================== User defined variables =================================

// Binary Server information
var WebIP="148.247.198.32"; // IP
var NodePort="69"; // Port

var PDBDIR="pdbfiles/"; // path to coordinates file. It can be located in another Apache server: "http://"+WebIP+"/HTMoLv3.5/pdbfiles/";
var TRJDIR="trjfiles/"; // path to trajectory file

// Coordinates file name
var pdbInicial='enzima.pdb'; // Examples also included: 'mem_chol.pdb'; // 'amb.pdb' // 'lido_dppc.pdb'
// Trajectory file name
var trjInicial='enzima.xtc';

// Definition of representations
var RepresentacionInicial='SpheresBonds'; // do not change representation here, use the 'show' command below
var radius = 0.01; // SpheresBonds radius
var SphereResolution = 5; // value has to be >3, use 5 for low resolution, 16 for high resolution

// Examples for visualization. Select corresponding line acordingly
var commandsDefault="select 1-9;show CPK;color white;select 3540-3549;show CPK;color red;select 0:TRP:0;show CPK;color atom;SELECT 0:0:0;"; // for enzima
//        var commandsDefault="show trace;"; // for enzima
//        var commandsDefault="select 0:0:A;show CPK;color atom;"; // for mem_chol
//        var commandsDefault="select 0:0:A;show CPK;select 0:0:B;show CPK;color atom;"; // for amb
//        var commandsDefault="select 0:0:C;show CPK;color red;select 0:0:B;show CPK;color green;select 1-22;show CPK;color blue;select 0:0:E;show CPK;color atom;select 0:0:F;show CPK;color atom;"; // for lido_dppc

// MD trajectory information
var tinit=0 // MD start time in picoseconds (ps)
var md_dt=0.002; // MD timestep in picoseconds (ps)
var nstxtcout=10000; // Output frequency saved in trajectory (xtc|dcd) file

// A PDB file with no trajectory info in the header
var URL_PDB_Load_default=PDBDIR+".pdb";
// Trajectory info for the previous PDB file. 
// The file has to be in the directory specified by TRJDIR
var URL_TRJ_Load_default=".xtc";
// PDB file with trajectory info specified in the header
//var URL_TRJ_AutoLoad_default=PDBDIR+"prueba.pdb";

// Optimization
var mxSize = 20999999; // maximum trajectory file size in bytes. 20999999 is about 21 Mb
var NoPaso = 100; // number of atoms to process in block in the GPU, values has to be <200 due to JavaScript float arrays capacity. Float32Array is used for vertex, and Uint16Array for index

// ========================================================================================
