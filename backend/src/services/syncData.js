const fs = require('fs/promises');
const path = require('path');

const URL_API_MITECO = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';
const DATA_PATH = path.join(__dirname, '../../data');
const FILE_PATH = path.join(DATA_PATH, 'gasolineras.json');

async function syncData() {
  try {
    console.log('[SYNC] Iniciando descarga de la API del MITECO...');
    const response = await fetch(URL_API_MITECO);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const rawData = await response.json();
    console.log('[SYNC] Datos descargados, procesando y filtrando...');

    // Limpiar y reducir el tamaño de los datos
    const gasolinerasProcesadas = rawData.ListaEESSPrecio.map((eess, index) => {
      let rotulo = eess['Rótulo'] || '';
      if (rotulo.trim().toUpperCase() === 'NINGUNO' || !rotulo.trim()) {
        rotulo = 'Gasolinera Independiente';
      }

      // 1. Extraer combustibles dinámicamente
      const combustibles = [];
      for (const key of Object.keys(eess)) {
        if (key.startsWith('Precio ')) {
          const precioRaw = eess[key];
          if (precioRaw && typeof precioRaw === 'string') {
            const precio = parseFloat(precioRaw.replace(',', '.'));
            if (precio > 0) {
              const nombre = key.replace('Precio ', '');
              combustibles.push({
                nombre,
                precio,
                slug: nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-')
              });
            }
          }
        }
      }
      
      // Ordenar por precio ascendente
      combustibles.sort((a, b) => a.precio - b.precio);

      // 2. Inferir Servicios de forma más precisa
      const servicios = [];
      const horario = eess['Horario'] || '';
      
      const rotuloUpper = rotulo.toUpperCase();
      const horarioUpper = horario.toUpperCase();

      // A. Horario 24h
      if (horarioUpper.includes('24H') || horarioUpper.includes('00:00-24:00')) {
        servicios.push('Abierto 24h');
      }

      // B. Clasificación de marcas desatendidas vs tradicionales
      const marcasTradicionales = ['REPSOL', 'CEPSA', 'BP', 'GALP', 'SHELL', 'CAMPSA', 'AVIA', 'VALCARCE'];
      const marcasDesatendidas = ['PLENOIL', 'PETROPRIX', 'BALLENOIL', 'BEROIL', 'AUTONET', 'BONAREA', 'EASYGAS', 'GASEXPRESS'];

      const esTradicional = marcasTradicionales.some(m => rotuloUpper.includes(m));
      const esDesatendida = marcasDesatendidas.some(m => rotuloUpper.includes(m));

      if (esTradicional) {
        servicios.push('Atención en Pista');
        servicios.push('Tienda'); // La gran mayoría tiene mini market o tienda
      } else if (esDesatendida) {
        servicios.push('Autoservicio');
        servicios.push('Pago Automático');
      } else {
        // Para marcas independientes, miramos si el horario o rótulo nos da pistas
        if (rotuloUpper.includes('LAVADO') || rotuloUpper.includes('CLEAN')) {
          servicios.push('Lavado');
        }
        if (rotuloUpper.includes('AUTO') || rotuloUpper.includes('EXPRESS') || rotuloUpper.includes('LOW')) {
          servicios.push('Autoservicio');
        } else {
          servicios.push('Pago con Tarjeta');
        }
      }

      // C. Detección de lavado explícito
      if (rotuloUpper.includes('LAVADO') || rotuloUpper.includes('WASH') || rotuloUpper.includes('ELEFANTE AZUL')) {
        servicios.push('Lavado');
      }

      return {
        id: index + 1,
        rotulo,
        direccion: eess['Dirección'],
        municipio: eess['Municipio'],
        provincia: eess['Provincia'],
        latitud: parseFloat(eess['Latitud'].replace(',', '.')),
        longitud: parseFloat(eess['Longitud (WGS84)'].replace(',', '.')),
        combustibles,
        servicios,
        horario,
        tipoVenta: eess['Tipo Venta'],
        slug: `${rotulo.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${eess['Municipio'].toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
      };
    });

    // Asegurar que el directorio exista
    await fs.mkdir(DATA_PATH, { recursive: true });
    
    // Guardar el archivo localmente
    await fs.writeFile(FILE_PATH, JSON.stringify(gasolinerasProcesadas));
    console.log(`[SYNC] Sincronización exitosa. ${gasolinerasProcesadas.length} gasolineras guardadas.`);
    
    return gasolinerasProcesadas;
  } catch (error) {
    console.error('[SYNC] Error sincronizando datos:', error.message);
    throw error;
  }
}

module.exports = { syncData, FILE_PATH };
