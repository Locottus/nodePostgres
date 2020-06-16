
function decimalAHexString(n)
{
  console.log(n);
  num = Number(n);
  if (num < 0)
  {
    num = 0xFFFFFFFF + n + 1;
  }

  return num.toString(16).toUpperCase();
}


function hexADecimalString(n)
{
  console.log(n);
  num = parseInt(n,16);
  if (num < 0)
  {
    num = 0xFFFFFFFF + n + 1;
  }

  return num.toString();
}



const CoordenadasAGeopost = (request, response) => {
   const latitud = request.query.Latitud;
   const longitud = request.query.Longitud;
   var NS;
   var EO;
   var geocoordenada = '';

   //PRIMER CALCULO, DETERMINAR POSICION CARDINAL DEPENDIENDO DE LOS SIGNOS
    if (Number(latitud) < 0)
        NS = 'S';
    else
        NS = 'N';

    if (Number(longitud) < 0)
        EO = 'O';
    else
        EO = 'E';


   var arregloLatitud = latitud.replace('-','').split('.');
   var arregloLongitud = longitud.replace('-','').split('.');
   
    //SEGUNDO CALCULO DETERMINAR LOS PRIMEROS DIGITOS DEPNEDIENDO DE LOS VALORES ENTEROS EN POSICIONES 0 DEL ARREGLO
   var dec1 = arregloLatitud[0] + arregloLongitud[0];

   //TERCER CALCULO DETERMINAR LOS DIGITOS DE LA MANTISA DEPNEDIENDO DE LOS VALORES DEL ARREGLO POSICIONES 1    
   var dec2 = arregloLatitud[1].substring(0,5) + arregloLongitud[1].substring(0,5);

 
   var hex1 = decimalAHexString(dec1); 
   var hex2 = decimalAHexString(dec2);
   
   //compilando la direccion final
   geocoordenada = NS + EO + hex1 + '-' + hex2;

   console.log(geocoordenada);
   response.status(200).json(JSON.parse('{"Geocodigo" : "' + geocoordenada + '"}'));
}


const GeopostACoordenadas = (request, response) => {
    
    const geocodigo = request.query.Geocodigo.toString().toUpperCase();
    console.log(geocodigo);
    var NS ;
    var EO ;
    var latitud;
    var longitud;
    //PRIMER CALCULO, DETERMINAR POSICION CARDINAL DEPENDIENDO DE LOS SIGNOS
    if (geocodigo[0] === 'N')
        NS = '';
    else if (geocodigo[0] === 'S')
        NS = '-';

    if (geocodigo[1] === 'E')
        EO = '';
    else if (geocodigo[1] === 'O')
        EO = '-';
    //console.log(NS,EO);

    //SEGUNDO CALCULO DETERMINAR LOS PRIMEROS DIGITOS DEPNEDIENDO DE LOS VALORES ENTEROS EN POSICIONES 0 DEL ARREGLO
    var arrNum = geocodigo.substring(2,geocodigo.length).split('-');
    var lat0 = NS + hexADecimalString(arrNum[0]).substring(0,2);
    var lon0 = EO + hexADecimalString(arrNum[0]).substring(2,4);
    
    //console.log(lat0,lon0);
    
  //TERCER CALCULO DETERMINAR LOS DIGITOS DE LA MANTISA DEPNEDIENDO DE LOS VALORES DEL ARREGLO POSICIONES 1    
    var mantisa = hexADecimalString(arrNum[1]);
    
    console.log(mantisa);  
    latitud = lat0 + '.' + mantisa.substring(0,5);
    longitud = lon0 + '.' + mantisa.substring(5,11);
    response.status(200).json(JSON.parse('{"Latitud" : "' + latitud + '", "Longitud" : "'+longitud+'"}'));
 }
 


module.exports = {
    CoordenadasAGeopost,
    GeopostACoordenadas
  }
  
  