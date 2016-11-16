var contBonds=0;
var contBS=0;

var LstAtSelec=[];

var CzPers;

function Aminoacid(number,name,state)
{
    this.Number=number;
    this.Name=name;
    this.State=state;
    this.LstAtoms=[];
    this.Type=null;
    
    this.GetAtoms=function()
    {
        return this.LstAtoms;
    }
}

function Chain(name,state)
{
    this.Name=name;
    this.State=state;
    this.LstAminoAcid=[];
    this.LstSkeleton=[];
    
    this.GetSkeleton=function()
    {
        return this.LstSkeleton;
    }
    
    this.GetAminoacid=function()
    {
        return this.LstAminoAcid;
    }    
}
function Bond()
{
   this.LstAtoms=[];
   this.id=0;
   this.State=null; ////////////////////////////////////////////////////////////////////////

   this.BPosition=null; //es para saber en qué posición del arreglo se encuentra esta línea
}

function BondSkeleton()
{
	this.id=0;
    this.LstAtoms=[];
}

function Molecule()
{
    this.Name='';
    this.LstChain=[];
    this.LstAtoms=[];
    this.LstBonds=[];
    this.LstBondsSkeleton=[];
    this.LstHelixAndSheet=[];
    this.CenterX=0;
    this.CenterY=0;
    this.CenterZ=0;
    this.Frames=0;
    this.TrjPath="";
    this.GetChain=function()
    {
        return this.LstChain;
    }
    
    this.GetBonds=function()
    {
        return this.LstBonds;
    }
    
    this.GetAtoms=function()
    {
        return this.LstAtoms;
    }
    
    this.GetBSkeleton=function()
    {
        return this.LstBondsSkeleton;
    }
    
}

function Atom(number,x,y,z,state,element,nameatom)
{   
    this.X=x;
    this.Y=y;
    this.Z=z;
    this.State=state;
    this.NumberAtom=number;
    this.Element=element;
    this.NameAtom=nameatom;
    this.Aminoacid=null;
    this.AminoNum=null;
    
    this.ColorName=null;
    this.ColorRGB=null;
    this.ColorRGBDiffuse=null;
    this.Seleccionado=false; //
    this.Representation=null;

    this.LstLinea=[];
    this.LstLineaSke=[];

    this.GetLstidLinea=function()
    {
        return this.LstidLinea;
    }
    //Esta parte es para los bloques
    this.BloqueWire=0;
    this.PositionBWire=0;
    this.BloqueSolid=0;
    this.PositionBSolid=0;
    ////////////////////////
    //para mantener o no un color diferente
    this.ColorDiferente = false;
    this.ColorDos=null;


    this.id=null; //es para poner el órden en el que aparecen

    this.idChain=null;
}

function createBonds(main)
	{
		var bond= new Bond();
	    for (var t in molecule.GetChain())
	    {
	        var chn=molecule.GetChain()[t];
	        for(var r in chn.GetAminoacid())
	        {
	            var amn=chn.GetAminoacid()[r];
	            for(var s in amn.GetAtoms())
	            {
	                var atom=amn.GetAtoms()[s];
	                for(var b in AtomsBonds[atom.NameAtom])
	                {
	                    var val=AtomsBonds[atom.NameAtom][b];
	                    for(var s in amn.GetAtoms())
	                    {
	                        var atomb=amn.GetAtoms()[s];
	                        if(val==atomb.NameAtom)
	                        {
	                            bond=main.ObjP.AddBond(bond,atom,atomb);
	                        }
	                    }
	                }
	            }
	        }
	    }
	}

function Process()
{
    this.Model= new Molecule();
	this.ReadFile= function(URL)
	{
		   var text = $.ajax({
		       url: URL, 
			   dataType: 'text',
			   async: false     
		   }).responseText;
		   if (text!=null&&text.substr(0,6)!="<html>"){
	        return this.Parse(text);
	    	}
	       else
	        return null;
	}
	   
	this.Parse= function(text)
	{
		var cont=0;
	   	this.Model=new Molecule();
	    var cmpAmino='',cmpChain='';
	    var chain=new Chain();
	    var aminoacid=new Aminoacid();
	    var bond=new Bond();
	    var bondS= new BondSkeleton();
	    var lines=text.split("\n");
	    var val,val2;
	    var AtomCount=0;
	    var contSkele=0;
	    var id=0;
	    var ChainCont=1;
	    contBonds=0;
	    contBS=0;
	    CzPers=10;

	    var RGB_Diffuse = [,,];  //para asignarle un único valor de color difuso a cada átomo para distinguirlo de los demás en la selección
	    //la que no se toma sería [0][0][0]  entonces comenzaría con [1][0][0]  y terminaría en [255][255][254]
	    var R=0;
	    var G=0;
	    var B=0;

    	var Scala=0.003921568627451;
	      
	    for(var i=0; i<lines.length; ++i)
	    {
	    	if(lines[i].substr(0,7)=="NFRAMES")
	    	{
	       		this.Model.Frames=lines[i].substr(10);
	       	}
	       	if(lines[i].substr(0,7)=="TRJPATH")
	       	{
	       		this.Model.TrjPath=lines[i].substr(10);
	       	}
		    if(lines[i].substr(0,6)=="HEADER")
		    {
				this.Model.Name=lines[i].substr(62,4);
		    }
		  
		    if(lines[i].substr(0,4)=="ATOM")
		    {
		   	    var atom=new Atom
		       	(
		       		lines[i].substr(6,5), 								//Number
		       		parseFloat(lines[i].substr(30,8)), 					//x
		       		parseFloat(lines[i].substr(38,8)), 					//y
		       		parseFloat(lines[i].substr(46,8)), 					//z
		       		'Active',											//state
		       		lines[i].substr(11,5).trim().substr(0,1),			//element
		       		lines[i].substr(11,6).trim().replace(/\s/g,"&")	 	//nombre
		       	);
			
           
				if(cont==0)
				{
					cmpAmino=lines[i].substr(22,4); //Número del aminoácido en el que aparece
					cmpChain=lines[i].substr(20,2);
					aminoacid=new Aminoacid(cmpAmino,lines[i].substr(17,3),'Active'); //THR o alguno de los 20
					chain=new Chain(cmpChain,'Active');
				}
				if(cmpAmino!=lines[i].substr(22,4)) //Número del aminoácido en el que apaarece
				{
					cmpAmino=lines[i].substr(22,4);
					chain.LstAminoAcid.push(aminoacid);
					aminoacid=new Aminoacid(cmpAmino,lines[i].substr(17,3),'Active');
				}
			    if(cmpChain!=lines[i].substr(20,2))
			    {
					cmpChain=lines[i].substr(20,2);
					this.Model.LstChain.push(chain);
					chain=new Chain(cmpChain,'Active');
					ChainCont=ChainCont + 1;
				}		
		        aminoacid.LstAtoms.push(atom);	       
			    this.Model.LstAtoms.push(atom);
			    atom.Aminoacid=aminoacid.Name;
			    atom.AminoNum=aminoacid.Number;

			    if(atom.NameAtom=='C'||atom.NameAtom=='O3\'')
			    {
			    	var atomtmp=atom;
			    }
		       		       		       
		        if((atom.NameAtom=='N'||atom.NameAtom=='P')&&cont>1)
		        {
		        	bond=this.AddBond(bond,atomtmp,atom);	
		        }

		        /////////////////////////// This part is for Skeletom´s Atoms ////////////////////////////////////////////
		       	if(atom.NameAtom=='CA'||atom.NameAtom=='P')
		       	{
		       		if (contSkele==0) {
		       			var atomtmp2=atom;
		       		}
					aminoacid.Type='T';
					//atom.Aminoacid=aminoacid;
				    chain.LstSkeleton.push(atom);
				    if (contSkele>0) {
				    	bondS = this.AddBondSkeleton(bondS,atomtmp2,atom);
				    	atomtmp2.LstLineaSke.push(bondS); 
		       			atom.LstLineaSke.push(bondS);
				    	atomtmp2=atom;
				    }
				    contSkele++;
		      	}
		      	///////////////////////////////////////////////////////////////////////////////////////////////////////////
		        		        
		        this.Model.CenterX+=atom.X;
		        this.Model.CenterY+=atom.Y;
		        this.Model.CenterZ+=atom.Z;
		        cont++;	
		        /////////////////////////
		        // código para centrar bien la cámara
		        var atmX = Math.abs(atom.X);
		        var atmY = Math.abs(atom.Y);

		        if (atmX <  atmY)
		        {
		        	if (CzPers < atmY) 
		        	{
		        		CzPers = atmY;
		        	}
		        	
		        }
		        else
		        {
		        	if (CzPers < atmX) 
		        	{
		        		CzPers = atmX;
		        	}
		        }
		        
			   	////////////////////////
			   	id++;	
			   	atom.id=id;
			   	atom.idChain=ChainCont;

			   	//Asignación del color difuso a cáda átomo
	            R=R+1;
	            if (R==255) 
	            {
	                R=0;
	                G=G+1;
	                if (G==255) 
	                {
	                    G=0;
	                    B=B+1;
	                }
	            }
	            atom.ColorRGBDiffuse=[R*Scala,G*Scala,B*Scala];

	            //en esta parte se asigna el color al átom
            	AsignaColor(atom); 
		    }
		    
	    }
	    this.Model.CenterX=this.Model.CenterX/this.Model.LstAtoms.length;
		this.Model.CenterY=this.Model.CenterY/this.Model.LstAtoms.length;
		this.Model.CenterZ=this.Model.CenterZ/this.Model.LstAtoms.length
	    chain.LstAminoAcid.push(aminoacid);
	    this.Model.LstChain.push(chain);
	    
	    return this.Model;
	}

	this.AddBond=function(bond,atom,union)
	{
		try
		{
		    var distancia=Math.sqrt(Math.pow(atom.X-union.X,2)+Math.pow(atom.Y-union.Y,2)+Math.pow(atom.Z-union.Z,2));
		    if(distancia<2)
		    {
			bond.LstAtoms.push(atom);
			bond.LstAtoms.push(union);
			bond.id=contBonds;
			bond.State='Active';
			atom.LstLinea.push(bond);
			union.LstLinea.push(bond);

			this.Model.LstBonds.push(bond);

			contBonds++;
		    }
		}catch(e)
		{}
	    return bond=new Bond();
	}

	this.AddBondSkeleton=function(bond,atom,union) 
	{
		try
		{
		    var distancia=Math.sqrt(Math.pow(atom.X-union.X,2)+Math.pow(atom.Y-union.Y,2)+Math.pow(atom.Z-union.Z,2));
		    if(distancia<8)
		    {
			bond.LstAtoms.push(atom);
			bond.LstAtoms.push(union);
			bond.id=contBS;
			this.Model.LstBondsSkeleton.push(bond);
			contBS++;
		    }
		}catch(e)
		{}
	    return bond=new BondSkeleton();
	}

	  
}