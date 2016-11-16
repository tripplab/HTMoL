<?php  
$ruta=$_POST["sendpath"]; //recoger datos de email
$comando='gmxdump -f '.$ruta;

$salida = shell_exec($comando);
$salida1 = explode("\n", $salida);
$atoms=substr($salida1[1], 16,6);
$natom=0;
for ($i=0; $i < sizeof($salida1); $i++) { 
    if (substr($salida1[$i], 6,2)=="x[") {
        $exp=substr($salida1[$i], 26,2)+1;
        $coordsx[$natom]=substr($salida1[$i], 17, 7)*pow(10,$exp);
        $exp=substr($salida1[$i], 40,2)+1;
        $coordsy[$natom]=substr($salida1[$i], 31, 7)*pow(10,$exp);
        $exp=substr($salida1[$i], 54,2)+1;
        $coordsz[$natom]=substr($salida1[$i], 45, 7)*pow(10,$exp);
        $natom++;
    }
}
echo $atoms."-";
for($i=0; $i<sizeof($coordsz);$i++){
    echo $coordsx[$i]." ";
    echo $coordsy[$i]." ";
    echo $coordsz[$i]."-";
}

?>