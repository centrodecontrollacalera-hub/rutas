/* Configuración del Centro de Control La Calera.
   Todos los servicios son gratuitos y basados en OpenStreetMap. Para uso intensivo conviene
   instalar su propio servidor OSRM/Overpass y cambiar las URL aquí (ver LEEME.md). */
window.CONFIG = {
  // Motor de rutas OSRM (perfil "driving"). El servidor demo es público pero limitado y de uso moderado.
  OSRM_URL: 'https://router.project-osrm.org',
  // Consulta de puntos de interés y servicios de emergencia (OpenStreetMap vía Overpass API).
  OVERPASS_URLS: ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'],
  // Buscador de direcciones y ciudades (Nominatim). Máx. 1 consulta por segundo; solo al presionar Enter/Buscar.
  NOMINATIM_URL: 'https://nominatim.openstreetmap.org',
  // Mapas base
  TILES: {
    'Calles (OpenStreetMap)': {url:'https://tile.openstreetmap.org/{z}/{x}/{y}.png', attr:'© Colaboradores de OpenStreetMap', maxZoom:19},
    'Claro (CARTO)': {url:'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', attr:'© OpenStreetMap © CARTO', maxZoom:19, subdomains:'abcd'}
  },
  PAIS_CENTRO: [-9.5, -75.0], PAIS_ZOOM: 6,
  RADIO_KM_DEFECTO: 10, RADIO_KM_MAX: 40,
  CORREDOR_KM: 3,            // ancho de búsqueda a cada lado de la ruta
  MAX_RESULTADOS: 150,       // límite por categoría para no saturar el mapa
  APP_VERSION: '1.0'
};
