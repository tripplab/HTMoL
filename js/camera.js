function initCamera(PersZ)
{
    Cx=molecule.CenterX;
    Cy=molecule.CenterY;
    Cz=molecule.CenterZ;

    Cxtemp = Cx;
    Cytemp = Cy;
    Cztemp = Cy;

    z=-Cz;

    var sum=Cx;
    if (Cx<Cy) 
    {
        sum=Cy;
    }
    
  
    CameraPosition = PersZ * (-2);
    CameraPosition = CameraPosition + sum;
    
    ZoomMotion=Math.ceil(CameraPosition/10);

}