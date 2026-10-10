/* Rutas operativas de referencia desde la cochera de Chincha (capturas GPS incluidas en el Excel).
   "vias" son puntos intermedios [lat,lng] que obligan al motor de rutas a seguir el corredor que realmente
   usan las unidades (p. ej. Cusco por Nasca–Puquio–Abancay). Se pueden editar o agregar sin tocar el código. */
window.RUTAS_REF = {
  pucallpa: {vias:[[-11.9360,-76.6960],[-11.5180,-75.8990],[-10.6840,-76.2560],[-9.9306,-76.2422],[-9.2960,-76.0010]], desc:'Chincha – Lima – Carretera Central – La Oroya – Cerro de Pasco – Huánuco – Tingo María – Pucallpa'},
  cusco:    {vias:[[-14.0678,-75.7286],[-14.8300,-74.9380],[-14.6940,-74.1250],[-14.2900,-73.2450],[-13.6340,-72.8814]], desc:'Chincha – Ica – Nasca – Puquio – Chalhuanca – Abancay – Cusco'},
  chiclayo: {vias:[], desc:'Panamericana Norte (vía Lima, Huacho, Barranca, Trujillo)'},
  huancayo: {vias:[[-11.9360,-76.6960],[-11.6470,-76.2330],[-11.5180,-75.8990]], desc:'Chincha – Lima – Chosica – Casapalca – La Oroya – Jauja – Huancayo'},
  ayacucho: {vias:[[-13.7033,-75.8997],[-13.6020,-75.3530]], desc:'Chincha – Pisco – Humay – Huaytará – Ayacucho (Los Libertadores)'},
  arequipa: {vias:[[-14.8300,-74.9380],[-15.8590,-74.2480]], desc:'Panamericana Sur: Ica – Nasca – Chala – Camaná – Arequipa'},
  piura:    {vias:[], desc:'Panamericana Norte (vía Lima, Trujillo, Chiclayo)'},
  trujillo: {vias:[], desc:'Panamericana Norte (vía Lima, Huacho, Barranca, Chimbote)'},
  chimbote: {vias:[], desc:'Panamericana Norte (vía Lima, Huacho, Barranca, Casma)'},
  ica:      {vias:[], desc:'Panamericana Sur (Chincha – Pisco – Ica)'},
  huanuco:  {vias:[[-11.9360,-76.6960],[-11.5180,-75.8990],[-10.6840,-76.2560],[-10.1290,-76.2050]], desc:'Chincha – Lima – La Oroya – Cerro de Pasco – Ambo – Huánuco'},
  huaraz:   {vias:[[-10.7000,-77.7700],[-10.1270,-77.2790]], desc:'Chincha – Lima – Huacho – Pativilca – Conococha – Huaraz'}
};
window.RUTAS_REF_ORIGEN = 'chincha';   // prefijo de las sedes de Chincha que sirven de origen de estas rutas

/* Ciudades y puntos de referencia (coordenadas aproximadas) usados para listar "por dónde pasa" una ruta. */
window.CIUDADES_REF = [
 ['Lima',-12.0464,-77.0428],['Callao',-12.0566,-77.1181],['Cañete',-13.0790,-76.3870],['Mala',-12.6590,-76.6310],['Chincha Alta',-13.4098,-76.1322],
 ['Pisco',-13.7100,-76.2030],['Ica',-14.0678,-75.7286],['Palpa',-14.5340,-75.1840],['Nasca',-14.8300,-74.9380],['Marcona',-15.3600,-75.1680],
 ['Acarí',-15.4300,-74.6150],['Yauca',-15.6600,-74.5200],['Chala',-15.8590,-74.2480],['Atico',-16.2130,-73.6830],['Ocoña',-16.4350,-73.1190],
 ['Camaná',-16.6230,-72.7110],['Arequipa',-16.4090,-71.5375],['Puquio',-14.6940,-74.1250],['Chalhuanca',-14.2900,-73.2450],['Abancay',-13.6340,-72.8814],
 ['Cusco',-13.5320,-71.9675],['Humay',-13.7033,-75.8997],['Huaytará',-13.6020,-75.3530],['Ayacucho',-13.1588,-74.2239],['Huancavelica',-12.7870,-74.9760],
 ['Chosica',-11.9360,-76.6960],['San Mateo',-11.7650,-76.3000],['Casapalca',-11.6470,-76.2330],['La Oroya',-11.5180,-75.8990],['Jauja',-11.7750,-75.4970],
 ['Huancayo',-12.0651,-75.2049],['Tarma',-11.4190,-75.6900],['Junín',-11.1580,-75.9920],['Cerro de Pasco',-10.6840,-76.2560],['Ambo',-10.1290,-76.2050],
 ['Huánuco',-9.9306,-76.2422],['Tingo María',-9.2960,-76.0010],['Aguaytía',-9.0400,-75.5130],['Pucallpa',-8.3791,-74.5539],['Huacho',-11.1060,-77.6050],
 ['Supe',-10.7970,-77.7110],['Barranca',-10.7500,-77.7610],['Pativilca',-10.6960,-77.7790],['Paramonga',-10.6690,-77.8330],['Huarmey',-10.0680,-78.1530],
 ['Casma',-9.4730,-78.3050],['Chimbote',-9.0745,-78.5936],['Conococha',-10.1270,-77.2790],['Huaraz',-9.5278,-77.5278],['Virú',-8.4150,-78.7480],
 ['Trujillo',-8.1116,-79.0288],['Chepén',-7.2250,-79.4300],['Pacasmayo',-7.4000,-79.5700],['Chiclayo',-6.7714,-79.8409],['Lambayeque',-6.7010,-79.9060],
 ['Olmos',-5.9840,-79.7440],['Piura',-5.1945,-80.6328],['Sullana',-4.9040,-80.6850],['Sechura',-5.5580,-80.8230],['Paita',-5.0890,-81.1140]
];
