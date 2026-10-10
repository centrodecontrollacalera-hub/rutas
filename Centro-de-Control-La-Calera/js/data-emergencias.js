/* Directorio de emergencias — generado desde el Excel del Centro de Control (hoja "numeros de emergencias").
   Cada teléfono tiene ok:false cuando su formato no parece un número peruano completo (verificar antes de usar).
   Para actualizar: edite este archivo o vuelva a ejecutar tools/generar_emergencias.py (ver LEEME.md). */
window.EMERGENCIAS_META = {fuente:'Excel del Centro de Control La Calera (hoja "numeros de emergencias")', fecha:null,
  nota:'El Excel no indica fecha de verificación de los números; se muestran como datos del Centro de Control, pendientes de confirmación oficial.'};
window.EMERGENCIAS_NACIONAL = [
  {cat:'policia',nombre:'Policía Nacional del Perú – Emergencias',tel:[{n:'105',ok:true}]},
  {cat:'bomberos',nombre:'Bomberos – Cuerpo General de Bomberos Voluntarios del Perú',tel:[{n:'116',ok:true}]},
  {cat:'ambulancia',nombre:'SAMU – Servicio de Atención Móvil de Urgencia (MINSA)',tel:[{n:'106',ok:true}]},
  {cat:'hospital',nombre:'INFOSALUD – MINSA',tel:[{n:'113',ok:true}]},
  {cat:'otro',nombre:'INDECI – Defensa Civil',tel:[{n:'115',ok:true}]}
];
window.EMERGENCIAS_NACIONAL_META = {fuente:'Números nacionales de emergencia del Perú (gob.pe / entidades responsables)', fecha:null, nota:'Confirmar vigencia en los portales oficiales (gob.pe/pnp, bomberos.gob.pe, minsa.gob.pe).'};
window.EMERGENCIAS = {
 "arequipa": [
  {
   "cat": "policia",
   "nombre": "C.P.N.P. Zamácola (54 316 697) / C.P.N.P. Mariscal Castilla",
   "tel": [
    {
     "n": "054 425 212",
     "ok": true
    }
   ]
  },
  {
   "cat": "bomberos",
   "nombre": "Central de Bomberos Arequipa",
   "tel": [
    {
     "n": "054 223 333",
     "ok": true
    },
    {
     "n": "116",
     "ok": true
    }
   ]
  },
  {
   "cat": "ambulancia",
   "nombre": "Vía Médica (999 266 732) / SAMU Arequipa",
   "tel": [
    {
     "n": "054 222 222",
     "ok": true
    }
   ]
  },
  {
   "cat": "hospital",
   "nombre": "Hospital Regional Honorio Delgado",
   "tel": [
    {
     "n": "054 231 818",
     "ok": true
    }
   ]
  },
  {
   "cat": "municipalidad",
   "nombre": "Municipalidad Provincial de Arequipa",
   "tel": [
    {
     "n": "054 206 100",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "Serenazgo Arequipa",
   "tel": [
    {
     "n": "054 215 555",
     "ok": true
    }
   ]
  },
  {
   "cat": "electricidad",
   "nombre": "SEAL Arequipa",
   "tel": [
    {
     "n": "054 381 188",
     "ok": true
    }
   ]
  }
 ],
 "chiclayo": [
  {
   "cat": "policia",
   "nombre": "Región Policial Chiclayo",
   "tel": [
    {
     "n": "986 674 726",
     "ok": true
    }
   ]
  },
  {
   "cat": "policia",
   "nombre": "C.P.N.P. La Victoria",
   "tel": [
    {
     "n": "074 216 174",
     "ok": true
    }
   ]
  },
  {
   "cat": "bomberos",
   "nombre": "Estación de Bomberos Voluntarios Chiclayo",
   "tel": [
    {
     "n": "074 452 997",
     "ok": true
    },
    {
     "n": "116",
     "ok": true
    }
   ]
  },
  {
   "cat": "ambulancia",
   "nombre": "SAMU Lambayeque",
   "tel": [
    {
     "n": "074 222 222",
     "ok": true
    }
   ]
  },
  {
   "cat": "hospital",
   "nombre": "Hospital Regional de Lambayeque",
   "tel": [
    {
     "n": "074 481 000",
     "ok": true
    }
   ]
  },
  {
   "cat": "municipalidad",
   "nombre": "Municipalidad Provincial de Chiclayo",
   "tel": [
    {
     "n": "074 232 232",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "Serenazgo Chiclayo",
   "tel": [
    {
     "n": "074 225 757",
     "ok": true
    }
   ]
  },
  {
   "cat": "electricidad",
   "nombre": "Ensa / Electronorte",
   "tel": [
    {
     "n": "074 481 212",
     "ok": true
    }
   ]
  }
 ],
 "cusco": [
  {
   "cat": "policia",
   "nombre": "C.P.N.P. Cusco (084 225 721) / Comisaría Wanchaq",
   "tel": [
    {
     "n": "084 231 113",
     "ok": true
    }
   ]
  },
  {
   "cat": "bomberos",
   "nombre": "Compañía de Bomberos Cusco N° 39",
   "tel": [
    {
     "n": "084 222 222",
     "ok": true
    },
    {
     "n": "116",
     "ok": true
    }
   ]
  },
  {
   "cat": "ambulancia",
   "nombre": "SAMU Cusco",
   "tel": [
    {
     "n": "084 232 323",
     "ok": true
    }
   ]
  },
  {
   "cat": "hospital",
   "nombre": "Hospital Regional del Cusco",
   "tel": [
    {
     "n": "084 227 661",
     "ok": true
    }
   ]
  },
  {
   "cat": "municipalidad",
   "nombre": "Municipalidad Provincial del Cusco",
   "tel": [
    {
     "n": "084 240 004",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "Serenazgo Cusco",
   "tel": [
    {
     "n": "084 240 404",
     "ok": true
    }
   ]
  },
  {
   "cat": "electricidad",
   "nombre": "Electro Sur Este",
   "tel": [
    {
     "n": "084 581 200",
     "ok": true
    }
   ]
  }
 ],
 "huancayo": [
  {
   "cat": "policia",
   "nombre": "C.P.N.P. Huancayo",
   "tel": [
    {
     "n": "064 211 637",
     "ok": true
    }
   ]
  },
  {
   "cat": "bomberos",
   "nombre": "Compañía de Bomberos",
   "tel": [
    {
     "n": "064 221 324",
     "ok": true
    },
    {
     "n": "064 211 020",
     "ok": true
    }
   ]
  },
  {
   "cat": "ambulancia",
   "nombre": "Huancayo Ambulancias",
   "tel": [
    {
     "n": "980 508 172",
     "ok": true
    }
   ]
  },
  {
   "cat": "hospital",
   "nombre": "Hospital El Carmen",
   "tel": [
    {
     "n": "064 233 575",
     "ok": true
    }
   ]
  },
  {
   "cat": "hospital",
   "nombre": "Hospital Regional Daniel Alcides Carrión",
   "tel": [
    {
     "n": "064 232 222",
     "ok": true
    }
   ]
  },
  {
   "cat": "municipalidad",
   "nombre": "Municipalidad",
   "tel": [
    {
     "n": "064 200 103",
     "ok": true
    },
    {
     "n": "064 600 408",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "Huancayo",
   "tel": [
    {
     "n": "064 202 050",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "El Tambo",
   "tel": [
    {
     "n": "064 252 510",
     "ok": true
    }
   ]
  },
  {
   "cat": "electricidad",
   "nombre": "Fono Luz (Electrocentro)",
   "tel": [
    {
     "n": "064 481 300",
     "ok": true
    }
   ]
  }
 ],
 "huanuco": [
  {
   "cat": "policia",
   "nombre": "C.P.N.P. Huánuco",
   "tel": [
    {
     "n": "062 515 330",
     "ok": true
    },
    {
     "n": "964 612 116",
     "ok": true
    }
   ]
  },
  {
   "cat": "bomberos",
   "nombre": "Salvadora N° 52",
   "tel": [
    {
     "n": "062 513 333",
     "ok": true
    },
    {
     "n": "995 672 246",
     "ok": true
    }
   ]
  },
  {
   "cat": "ambulancia",
   "nombre": "Ambulancias Huánuco",
   "tel": [
    {
     "n": "948 963 45",
     "ok": false
    }
   ]
  },
  {
   "cat": "hospital",
   "nombre": "SIS Huánuco",
   "tel": [
    {
     "n": "062 519 597",
     "ok": true
    }
   ]
  },
  {
   "cat": "municipalidad",
   "nombre": "Provincial de Huánuco",
   "tel": [
    {
     "n": "062 513 340",
     "ok": true
    }
   ]
  },
  {
   "cat": "municipalidad",
   "nombre": "Distrital de Amarillis",
   "tel": [
    {
     "n": "062 517 474",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "Serenazgo Huánuco",
   "tel": [
    {
     "n": "062 512 222",
     "ok": true
    }
   ]
  },
  {
   "cat": "electricidad",
   "nombre": "Fono Luz (Electrocentro)",
   "tel": [
    {
     "n": "064 481 300",
     "ok": true
    }
   ]
  }
 ],
 "huaraz": [
  {
   "cat": "policia",
   "nombre": "C.P.N.P. Huaraz",
   "tel": [
    {
     "n": "043 427 434",
     "ok": true
    }
   ]
  },
  {
   "cat": "policia",
   "nombre": "C.P.N.P.",
   "tel": [
    {
     "n": "043 428 216",
     "ok": true
    }
   ]
  },
  {
   "cat": "policia",
   "nombre": "C.P.N.P. Tacllán",
   "tel": [
    {
     "n": "043 428 064",
     "ok": true
    }
   ]
  },
  {
   "cat": "bomberos",
   "nombre": "Santiago Antúnez de Mayolo",
   "tel": [
    {
     "n": "043 723 333",
     "ok": true
    }
   ]
  },
  {
   "cat": "ambulancia",
   "nombre": "C.S. Huaupampa",
   "tel": [
    {
     "n": "043 422 332",
     "ok": true
    }
   ]
  },
  {
   "cat": "ambulancia",
   "nombre": "Medical Center",
   "tel": [
    {
     "n": "979 631 020",
     "ok": true
    }
   ]
  },
  {
   "cat": "hospital",
   "nombre": "Hospital II Huaraz",
   "tel": [
    {
     "n": "043 422 940",
     "ok": true
    }
   ]
  },
  {
   "cat": "municipalidad",
   "nombre": "Distrital de Independencia",
   "tel": [
    {
     "n": "043 396 262",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "Central Telefónica",
   "tel": [
    {
     "n": "01 641 9768",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "Móvil",
   "tel": [
    {
     "n": "943 999 270",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "Huaraz",
   "tel": [
    {
     "n": "043 785 760",
     "ok": true
    }
   ]
  },
  {
   "cat": "electricidad",
   "nombre": "Fono Luz (Hidrandina)",
   "tel": [
    {
     "n": "043 496 012",
     "ok": true
    },
    {
     "n": "920 224 935",
     "ok": true
    }
   ]
  }
 ],
 "ica": [
  {
   "cat": "policia",
   "nombre": "C.P.N.P. Subtanjalla",
   "tel": [
    {
     "n": "056 403 002",
     "ok": true
    }
   ]
  },
  {
   "cat": "policia",
   "nombre": "C.P.N.P. San Juan Bautista",
   "tel": [
    {
     "n": "056 257 203",
     "ok": true
    }
   ]
  },
  {
   "cat": "bomberos",
   "nombre": "Salvadora Ica N° 22",
   "tel": [
    {
     "n": "056 231 111",
     "ok": true
    }
   ]
  },
  {
   "cat": "bomberos",
   "nombre": "B193 Francisco Fonseca",
   "tel": [
    {
     "n": "056 254 733",
     "ok": true
    }
   ]
  },
  {
   "cat": "ambulancia",
   "nombre": "Acudir Ica",
   "tel": [
    {
     "n": "925 729 541",
     "ok": true
    }
   ]
  },
  {
   "cat": "hospital",
   "nombre": "Hospital Regional de Ica",
   "tel": [
    {
     "n": "056 215 222",
     "ok": true
    }
   ]
  },
  {
   "cat": "municipalidad",
   "nombre": "Subtanjalla",
   "tel": [
    {
     "n": "056 402 130",
     "ok": true
    }
   ]
  },
  {
   "cat": "municipalidad",
   "nombre": "Provincial de Ica",
   "tel": [
    {
     "n": "056 229 824",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "Serenazgo de Ica",
   "tel": [
    {
     "n": "056 403 652",
     "ok": true
    }
   ]
  },
  {
   "cat": "electricidad",
   "nombre": "Fono Luz (Electro Dunas)",
   "tel": [
    {
     "n": "056) 581 660",
     "ok": true
    }
   ]
  }
 ],
 "piura": [
  {
   "cat": "policia",
   "nombre": "Divincri Piura",
   "tel": [
    {
     "n": "073 307 648",
     "ok": true
    }
   ]
  },
  {
   "cat": "policia",
   "nombre": "Radio Patrulla",
   "tel": [
    {
     "n": "935 439 284",
     "ok": true
    }
   ]
  },
  {
   "cat": "bomberos",
   "nombre": "Piura N° 25",
   "tel": [
    {
     "n": "073 309 999",
     "ok": true
    }
   ]
  },
  {
   "cat": "bomberos",
   "nombre": "Santa Rosa N° 79",
   "tel": [
    {
     "n": "073 355 555",
     "ok": true
    }
   ]
  },
  {
   "cat": "ambulancia",
   "nombre": "Mi Salud",
   "tel": [
    {
     "n": "968 871 445",
     "ok": true
    }
   ]
  },
  {
   "cat": "hospital",
   "nombre": "C.S. Santa Julia",
   "tel": [
    {
     "n": "073 351 227",
     "ok": true
    }
   ]
  },
  {
   "cat": "hospital",
   "nombre": "Hospital Jorge Reátegui",
   "tel": [
    {
     "n": "073 284 760",
     "ok": true
    }
   ]
  },
  {
   "cat": "municipalidad",
   "nombre": "Provincial de Piura",
   "tel": [
    {
     "n": "073 602 100",
     "ok": true
    }
   ]
  },
  {
   "cat": "municipalidad",
   "nombre": "26 de Octubre",
   "tel": [
    {
     "n": "073 363 152",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "Piura",
   "tel": [
    {
     "n": "950 206 506",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "26 de Octubre",
   "tel": [
    {
     "n": "966 638 769",
     "ok": true
    },
    {
     "n": "073 296 013",
     "ok": true
    }
   ]
  },
  {
   "cat": "electricidad",
   "nombre": "Fono Luz (Electronoroeste)",
   "tel": [
    {
     "n": "073) 284 030",
     "ok": true
    }
   ]
  }
 ],
 "pucallpa": [
  {
   "cat": "policia",
   "nombre": "Yarinacocha",
   "tel": [
    {
     "n": "966 832 714",
     "ok": true
    }
   ]
  },
  {
   "cat": "policia",
   "nombre": "San Fernando",
   "tel": [
    {
     "n": "912 067 331",
     "ok": true
    }
   ]
  },
  {
   "cat": "policia",
   "nombre": "Pucallpa",
   "tel": [
    {
     "n": "966 832 614",
     "ok": true
    }
   ]
  },
  {
   "cat": "bomberos",
   "nombre": "Voluntarios Pucallpa",
   "tel": [
    {
     "n": "974 986 826",
     "ok": true
    }
   ]
  },
  {
   "cat": "bomberos",
   "nombre": "Yarina",
   "tel": [
    {
     "n": "061 596 850",
     "ok": true
    }
   ]
  },
  {
   "cat": "ambulancia",
   "nombre": "Americana Serfarmed",
   "tel": [
    {
     "n": "061 579 327",
     "ok": true
    }
   ]
  },
  {
   "cat": "hospital",
   "nombre": "Hospital II EsSalud",
   "tel": [
    {
     "n": "061 586 090",
     "ok": true
    }
   ]
  },
  {
   "cat": "hospital",
   "nombre": "Regional de Pucallpa",
   "tel": [
    {
     "n": "985 246 235",
     "ok": true
    }
   ]
  },
  {
   "cat": "municipalidad",
   "nombre": "Manantay",
   "tel": [
    {
     "n": "061 594 687",
     "ok": true
    }
   ]
  },
  {
   "cat": "municipalidad",
   "nombre": "Coronel Portillo",
   "tel": [
    {
     "n": "061 591 412",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "Seguridad Ciudadana",
   "tel": [
    {
     "n": "061 575 340",
     "ok": true
    },
    {
     "n": "961 611 314",
     "ok": true
    }
   ]
  },
  {
   "cat": "electricidad",
   "nombre": "Fono Luz (Electro Ucayali)",
   "tel": [
    {
     "n": "061) 597 272",
     "ok": true
    }
   ]
  }
 ],
 "trujillo": [
  {
   "cat": "policia",
   "nombre": "Ayacucho - Trujillo",
   "tel": [
    {
     "n": "044 291 436",
     "ok": true
    },
    {
     "n": "044 481 530",
     "ok": true
    }
   ]
  },
  {
   "cat": "bomberos",
   "nombre": "Washington State N° 177",
   "tel": [
    {
     "n": "044 426 666",
     "ok": true
    }
   ]
  },
  {
   "cat": "ambulancia",
   "nombre": "Help Medic",
   "tel": [
    {
     "n": "945 009 117",
     "ok": true
    }
   ]
  },
  {
   "cat": "hospital",
   "nombre": "Hospital EsSalud La Esperanza",
   "tel": [
    {
     "n": "044 411 8000",
     "ok": false
    }
   ]
  },
  {
   "cat": "municipalidad",
   "nombre": "La Esperanza",
   "tel": [
    {
     "n": "044 272 478",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "Trujillo",
   "tel": [
    {
     "n": "044 481 530",
     "ok": true
    },
    {
     "n": "949 418 268",
     "ok": true
    }
   ]
  },
  {
   "cat": "electricidad",
   "nombre": "Fono Luz (Hidrandina)",
   "tel": [
    {
     "n": "044) 481 313",
     "ok": true
    }
   ]
  }
 ],
 "chimbote": [
  {
   "cat": "policia",
   "nombre": "Comisaría PNP Chimbote",
   "tel": [
    {
     "n": "043 321 171",
     "ok": true
    }
   ]
  },
  {
   "cat": "policia",
   "nombre": "Comisaría PNP 21 de Abril",
   "tel": [
    {
     "n": "043 325 212",
     "ok": true
    }
   ]
  },
  {
   "cat": "bomberos",
   "nombre": "Compañía de Bomberos Salvadora Chimbote N° 33",
   "tel": [
    {
     "n": "043 321 333",
     "ok": true
    },
    {
     "n": "116",
     "ok": true
    }
   ]
  },
  {
   "cat": "ambulancia",
   "nombre": "SAMU Chimbote",
   "tel": [
    {
     "n": "043 222 222",
     "ok": true
    }
   ]
  },
  {
   "cat": "hospital",
   "nombre": "Hospital La Caleta",
   "tel": [
    {
     "n": "043 322 241",
     "ok": true
    }
   ]
  },
  {
   "cat": "hospital",
   "nombre": "Hospital III EsSalud Chimbote",
   "tel": [
    {
     "n": "043 481 100",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "Central de Seguridad Ciudadana Chimbote",
   "tel": [
    {
     "n": "043 341 122",
     "ok": true
    },
    {
     "n": "943 980 120",
     "ok": true
    }
   ]
  },
  {
   "cat": "serenazgo",
   "nombre": "Serenazgo Chimbote",
   "tel": [
    {
     "n": "043 353 425",
     "ok": true
    },
    {
     "n": "914 782 543",
     "ok": true
    },
    {
     "n": "914 782 677",
     "ok": true
    }
   ]
  }
 ]
};
