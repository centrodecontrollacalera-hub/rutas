# Centro de Control La Calera — plataforma web de apoyo operativo

Aplicación web (HTML + JavaScript, sin base de datos ni instalación de paquetes) con mapa interactivo del Perú, sedes de La Calera,
cálculo de rutas reales, directorio de emergencias, puntos de interés para transporte y exportación a PDF A4.

## 1. Cómo ejecutarla
Necesita conexión a Internet (mapa, rutas y consultas son servicios en línea).

**Opción A – en un computador (recomendada para probar)**
1. Instale Python 3 (https://www.python.org/downloads/, marcando «Add Python to PATH»).
2. Haga doble clic en `iniciar.bat` (Windows) o ejecute `./iniciar.sh` (Mac/Linux). Se abre http://localhost:8080.

> No abra `index.html` con doble clic directo (`file://`): los servidores de mapas y de búsqueda de OpenStreetMap
> rechazan peticiones sin «referer» y el mapa o el buscador pueden fallar. Siempre sírvala por `http://`.

**Opción B – publicarla para todo el Centro de Control**
Suba la carpeta completa a cualquier hosting estático (Netlify, Cloudflare Pages, GitHub Pages, o el servidor web de la empresa).
No requiere backend. Use HTTPS.

## 2. Servicios externos que utiliza (todos gratuitos)
| Función | Servicio | Dónde se configura |
|---|---|---|
| Mapa base | Teselas de OpenStreetMap (y CARTO como alternativa) | `js/config.js` → `TILES` |
| Rutas, distancia, tiempo, alternativas | **OSRM** (servidor público de demostración) | `js/config.js` → `OSRM_URL` |
| Servicios de emergencia y puntos de interés | **Overpass API** (datos de OpenStreetMap) | `js/config.js` → `OVERPASS_URLS` |
| Buscador de ciudades/direcciones | **Nominatim** | `js/config.js` → `NOMINATIM_URL` |

Los servidores públicos son de uso moderado y sin garantía de disponibilidad. Para uso continuo del equipo, lo recomendable es instalar
su propio OSRM (https://github.com/Project-OSRM/osrm-backend, con el extracto de Perú de Geofabrik) y apuntar `OSRM_URL` a él;
lo mismo aplica a Overpass si hay muchos operadores consultando a la vez. Los datos de OpenStreetMap son © colaboradores de OpenStreetMap (licencia ODbL).

## 3. Cómo actualizar los datos
Todo está en la carpeta `js/` y se edita con cualquier editor de texto; no hay que tocar el código de la aplicación.

* **Sedes** (`js/data-sedes.js`): una línea por sede/instalación (nombre, distrito, dirección, `lat`, `lng`, enlace). Para varias instalaciones en la misma ciudad
  agregue otra línea con `ciudad` repetida (ya está hecho con Chincha: Duzano, Silencio y Cochera Navarro).
* **Coordenadas exactas** — IMPORTANTE: los enlaces cortos de Google Maps del Excel no pueden leerse automáticamente, por eso las 15 ubicaciones
  están marcadas como **APROXIMADAS** (aviso naranja en la ficha). Para fijarlas: seleccione la sede → «Ajustar ubicación» → arrastre el marcador al punto exacto
  (puede comprobarlo con el botón «Abrir en Google Maps») → «Copiar coordenadas» → pegue los valores en `data-sedes.js`. El ajuste también queda guardado en ese navegador.
* **Teléfonos de emergencia** (`js/data-emergencias.js`): por ciudad (clave = `id` de la sede). Cada teléfono lleva `ok:true/false`; `false` muestra la etiqueta «verificar».
  Provienen del Excel, que no trae fecha de verificación (la aplicación lo indica expresamente). Faltan Ayacucho y Chincha: agréguelos aquí.
  Los números nacionales (105, 116, 106, 113, 115) están en `EMERGENCIAS_NACIONAL`; confirme su vigencia en los portales oficiales.
* **Corredores operativos desde Chincha** (`js/data-rutas.js`): `vias` son puntos intermedios que obligan a la ruta a seguir el trayecto real de las unidades
  (por ejemplo, Cusco por Nasca–Puquio–Abancay, según las capturas GPS del Excel, guardadas en `assets/rutas/`). Edite o añada puntos si el recorrido cambia.
* **Categorías de puntos de interés** (`js/app.js`, bloque `CATS`): etiqueta, color, icono y filtros de OpenStreetMap de cada categoría.

## 4. Qué hace
* Mapa con las sedes, ficha de cada una (dirección, coordenadas, ciudad/departamento, origen/destino, emergencias y puntos cercanos).
* Ruta entre dos sedes (o lugar buscado): trazado, km, tiempo, carreteras principales (p. ej. PE-1S), ciudades que atraviesa, peajes, alternativas y comparación con el corredor operativo del Excel.
* Emergencias y puntos de interés en el mapa por categoría (se activan/desactivan), alrededor de la sede o a lo largo de la ruta, con distancia, teléfono (si existe), «Ver ruta» y «Llamar».
* Buscador de sedes, directorio, categorías («grifos», «comisaría»…) y lugares/direcciones del Perú.
* Exportar PDF A4: encabezado corporativo, fecha y hora, mapa con ruta y marcadores, ruta, directorio, puntos de interés, fuentes y avisos. Reporte completo o solo lo marcado con ☑.

## 5. Datos reales vs. faltantes (sin inventar)
* Los servicios del mapa vienen de OpenStreetMap; si una categoría no tiene registros, se indica «sin registros en OpenStreetMap» (no significa que no existan). Direcciones y teléfonos solo aparecen si OSM los tiene.
* El directorio de teléfonos es el del Excel. Dos números tienen formato dudoso y se marcan «verificar»: Ambulancias Huánuco (948 963 45) y Hospital EsSalud La Esperanza, Trujillo (044 411 8000).
* Los tiempos son estimaciones de OSRM para vehículo liviano; buses y carga demoran más.
