const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const cron = require('node-cron');
const { syncData, FILE_PATH } = require('./services/syncData');
const { calcularDistanciaHaversine } = require('./utils/haversine');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ==========================================
// CACHÉ EN MEMORIA (IN-MEMORY JSON CACHE)
// ==========================================
let gasolinerasCache = [];

// Utilidad infalible para normalizar textos (quita tildes y pasa a minúsculas)
const normalizeString = (str) => {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

async function loadCache() {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    gasolinerasCache = JSON.parse(data);
    console.log(`[CACHE] Cargadas ${gasolinerasCache.length} gasolineras en memoria RAM.`);
  } catch (error) {
    console.log('[CACHE] Archivo JSON no encontrado. Ejecutando primera sincronización...');
    gasolinerasCache = await syncData();
  }
}

// ==========================================
// TAREAS PROGRAMADAS (CRON)
// ==========================================
// Ejecutar cada 2 horas (0 */2 * * *)
cron.schedule('0 */2 * * *', async () => {
  console.log('[CRON] Iniciando actualización periódica de datos...');
  gasolinerasCache = await syncData();
});

// ==========================================
// ENDPOINTS DE LA API
// ==========================================

// 1. GET /api/gasolineras - Paginado y con filtros
app.get('/api/gasolineras', (req, res) => {
  const { page = 1, limit = 20, provincia, municipio } = req.query;
  let resultados = gasolinerasCache;

  if (provincia) {
    const pNorm = normalizeString(provincia);
    resultados = resultados.filter(g => normalizeString(g.provincia) === pNorm);
  }
  
  if (municipio) {
    const mNorm = normalizeString(municipio);
    resultados = resultados.filter(g => normalizeString(g.municipio) === mNorm);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const data = resultados.slice(startIndex, endIndex);

  res.json({
    total: resultados.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(resultados.length / limit),
    data
  });
});

// 2. GET /api/cerca - Usando la Fórmula de Haversine
app.get('/api/cerca', (req, res) => {
  const { lat, lng, radio = 10, page = 1, limit = 20, order = 'precio' } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitud y longitud son requeridas." });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const maxDistance = parseFloat(radio);

  // Filtrar en memoria por distancia
  let gasolinerasCercanas = [];
  
  // Esto es un escaneo lineal completo (O(n)), pero para ~12,000 registros en RAM toma milisegundos
  for (let i = 0; i < gasolinerasCache.length; i++) {
    const g = gasolinerasCache[i];
    if (g.latitud && g.longitud) {
      const dist = calcularDistanciaHaversine(userLat, userLng, g.latitud, g.longitud);
      if (dist <= maxDistance) {
        gasolinerasCercanas.push({ ...g, distanciaKm: dist });
      }
    }
  }

  // Ordenar (por precio de diésel como default o por cercanía)
  if (order === 'distancia') {
    gasolinerasCercanas.sort((a, b) => a.distanciaKm - b.distanciaKm);
  } else {
    // Ordenar por precio, poniendo los null al final
    gasolinerasCercanas.sort((a, b) => {
      const precioA = (a.combustibles && a.combustibles.length > 0) ? a.combustibles[0].precio : 9999;
      const precioB = (b.combustibles && b.combustibles.length > 0) ? b.combustibles[0].precio : 9999;
      return precioA - precioB;
    });
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const data = gasolinerasCercanas.slice(startIndex, endIndex);

  res.json({
    total: gasolinerasCercanas.length,
    page: parseInt(page),
    data
  });
});

// 3. GET /api/gasolinera/:slug - Detalle específico
app.get('/api/gasolinera/:slug', (req, res) => {
  const gasolinera = gasolinerasCache.find(g => g.slug === req.params.slug);
  if (!gasolinera) return res.status(404).json({ error: "Gasolinera no encontrada" });
  res.json(gasolinera);
});

// 4. GET /api/mapa - Todas las gasolineras (Payload ligero para el frontend)
app.get('/api/mapa', (req, res) => {
  const dataLigera = gasolinerasCache
    .filter(g => g.latitud && g.longitud)
    .map(g => ({
      id: g.id,
      lat: g.latitud,
      lng: g.longitud,
      rotulo: g.rotulo,
      combustibles: g.combustibles,
      slug: g.slug
    }));
  res.json(dataLigera);
});

// 5. GET /api/buscar - Buscador Inteligente
app.get('/api/buscar', (req, res) => {
  const q = normalizeString(req.query.q);
  if (!q) return res.status(400).json({ error: 'Query vacía' });

  // 1. Coincidencia exacta Provincia
  const provMatch = gasolinerasCache.find(g => normalizeString(g.provincia) === q);
  if (provMatch) return res.json({ url: `/gasolineras/${normalizeString(provMatch.provincia)}` });

  // 2. Coincidencia exacta Municipio
  const muniMatch = gasolinerasCache.find(g => normalizeString(g.municipio) === q);
  if (muniMatch) return res.json({ url: `/gasolineras/${normalizeString(muniMatch.provincia)}/${normalizeString(muniMatch.municipio)}` });

  // 3. Coincidencia parcial Provincia
  const provParcial = gasolinerasCache.find(g => normalizeString(g.provincia).includes(q));
  if (provParcial) return res.json({ url: `/gasolineras/${normalizeString(provParcial.provincia)}` });

  // 4. Coincidencia parcial Municipio
  const muniParcial = gasolinerasCache.find(g => normalizeString(g.municipio).includes(q));
  if (muniParcial) return res.json({ url: `/gasolineras/${normalizeString(muniParcial.provincia)}/${normalizeString(muniParcial.municipio)}` });

  res.status(404).json({ error: 'No encontrado' });
});

// 6. GET /api/provincias - Listado de provincias
app.get('/api/provincias', (req, res) => {
  const provincias = [...new Set(gasolinerasCache.map(g => g.provincia))].filter(Boolean).sort();
  res.json(provincias);
});

// 7. GET /api/municipios/:provincia - Listado de municipios por provincia
app.get('/api/municipios/:provincia', (req, res) => {
  const prov = normalizeString(req.params.provincia);
  const munis = [...new Set(gasolinerasCache.filter(g => normalizeString(g.provincia) === prov).map(g => g.municipio))].filter(Boolean).sort();
  res.json(munis);
});

// Arrancar el servidor
app.listen(PORT, async () => {
  console.log(`[SERVER] API corriendo en puerto ${PORT}`);
  await loadCache(); // Cargar la RAM al arrancar
});
