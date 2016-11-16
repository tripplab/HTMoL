function initPlantillaEsfera() 
{
///////////////////////////////////////////////PLANTILLA DE LA ESFERA ////////////////////////////////////////////
var theta = null;
var sinTheta = null;
var cosTheta = null;

var phi = null;
var sinPhi = null;
var cosPhi = null;

var x = 0;
var y = 0;
var z = 0;


         for (var latNumber=0; latNumber <= latitudeBands; latNumber++) 
            {
                theta = latNumber * Math.PI / latitudeBands;
                sinTheta = Math.sin(theta);
                cosTheta = Math.cos(theta);

                for (var longNumber=0; longNumber <= longitudeBands; longNumber++) 
                {
                    phi = longNumber * 2 * Math.PI / longitudeBands;
                    sinPhi = Math.sin(phi);
                    cosPhi = Math.cos(phi);

                    x = cosPhi * sinTheta;
                    y = cosTheta;
                    z = sinPhi * sinTheta;
                    
                    normalData.push(x);
                    normalData.push(y);
                    normalData.push(z);
                    
                    //////////////////////VÉRTICES PARA ESFERA DE RADIO PARA SPHERES BONDS ////////////////
                    verArray.push(radius * x);
                    verArray.push(radius * y);
                    verArray.push(radius * z);
                    ////////////////////////////////////////////////////////

                    //////////////////////VÉRTICES PARA LAS ESFERAS CON RADIO CPK ///////////////////////////
                    verArrayH.push(radiusH * x);  //para hidrógeno
                    verArrayH.push(radiusH * y);
                    verArrayH.push(radiusH * z);

                    verArrayC_PB_TI_CA.push(rC_PB_TI_CA * x);  //para Carbono PB TI y carbono Alfa
                    verArrayC_PB_TI_CA.push(rC_PB_TI_CA * y);
                    verArrayC_PB_TI_CA.push(rC_PB_TI_CA * z);

                    verArrayN.push(radiusN * x);  //para Nitrógeno
                    verArrayN.push(radiusN * y);
                    verArrayN.push(radiusN * z);

                    verArrayS.push(radiusS * x);  //para S
                    verArrayS.push(radiusS * y);
                    verArrayS.push(radiusS * z);

                    verArrayP.push(radiusP * x);  //para P
                    verArrayP.push(radiusP * y);
                    verArrayP.push(radiusP * z);

                    verArrayO.push(radiusO * x);  //para O
                    verArrayO.push(radiusO * y);
                    verArrayO.push(radiusO * z);

                    verArrayDefault.push(rDefault * x);  //para Default
                    verArrayDefault.push(rDefault * y);
                    verArrayDefault.push(rDefault * z);

                }
            }

var first = 0;
var second = 0;
            for (var latNumber=0; latNumber < latitudeBands; latNumber++)
                    {
                        for (var longNumber=0; longNumber < longitudeBands; longNumber++)
                        {
                            first = (latNumber * (longitudeBands + 1)) + longNumber;
                            second = first + longitudeBands + 1;
                            indx.push(first);
                            indx.push(second);
                            indx.push(first + 1);

                            indx.push(second);
                            indx.push(second + 1);
                            indx.push(first + 1);

                        }
                    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}