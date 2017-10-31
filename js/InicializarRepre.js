//esta es la inicialización o cambio de representación de toda la molécula

function InitBufRepreDefault(command)
{
    var todo=command.split(";");
    todo.forEach(function(item,index){
        main.Parse(item);
    });
}


function InitBufSB()
{
    OptRep=false;//Para que no entre en Spline
    cleanMemory();

    initBuffersSpheresSB();

    initBuffersBonds(true);

    initBufBndSkele(false);

    AtomosSeleccionados=molecule.LstAtoms;

}

function InitBufVDW()
{
    OptRep=false;//Para que no entre en Spline
    cleanMemory();

    initBuffersSpheresVDW();

    initBuffersBonds(false);

    initBufBndSkele(false);

    AtomosSeleccionados=molecule.LstAtoms;

}

function InitBufBonds()
{
    OptRep=false;//Para que no entre en Spline
    cleanMemory();

    initBuffersBonds(true);

    initBufBndSkele(false);

    AtomosSeleccionados=molecule.LstAtoms;
}


function InitBufSkeleton()
{
    OptRep=false;//Para que no entre en Spline
    cleanMemory();

    initBuffersBonds(false);

    initBufBndSkele(true);

    //Inicializar los CA de todos los átomos de la molécula

    AtomosSeleccionados=molecule.LstAtoms;

}
function InitBufSpline()
{
    cleanMemory();
    OptRep=true;//Para que dibuje Spline
    initBuffersBonds(false);
    initBufBndSkele(false);
    initBufferSpline();


    //Inicializar los CA de todos los átomos de la molécula

    //AtomosSeleccionados=molecule.LstAtoms;

}
