'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocateFixed } from 'lucide-react';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Resuelve el bug nativo de Next.js donde el mapa se queda en gris al volver a la página
function MapController() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      window.dispatchEvent(new Event('resize'));
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Inyección Nativa a Leaflet (Soluciona el 100% del Lag y el tamaño de puntos)
function FastNativeMarkers({ stations }: { stations: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (!stations || stations.length === 0) return;

    // Usamos el motor nativo de Canvas de Leaflet (Bypass a React para dibujar miles de puntos sin Lag)
    const canvasRenderer = L.canvas({ padding: 0.5 });
    const layerGroup = L.layerGroup();

    stations.forEach((g) => {
      if (!g.lat || !g.lng) return;
      
      const circle = L.circleMarker([g.lat, g.lng], {
        renderer: canvasRenderer,
        radius: 2, // Por defecto minúsculo
        weight: 0,
        fillColor: '#10b981',
        fillOpacity: 0.8,
      });

      const combustiblesHtml = g.combustibles && g.combustibles.length > 0 
        ? g.combustibles.map((c: any) => {
            const isGasolina = c.nombre.toLowerCase().includes('gasolina');
            const colorText = isGasolina ? '#0d9488' : '#059669';
            return `
            <div style="display: flex; justify-content: space-between; background: #f8fafc; padding: 6px; border-radius: 4px; margin-bottom: 4px; border: 1px solid #f1f5f9;">
              <span style="font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase;">${c.nombre}</span>
              <span style="font-weight: bold; color: ${colorText};">${c.precio}€</span>
            </div>
            `;
          }).join('')
        : '<p style="font-size: 11px; color: #94a3b8; text-align: center;">Precios no disponibles</p>';

      // HTML en crudo es muchísimo más rápido que componentes de React en Popups masivos
      circle.bindPopup(`
        <div style="font-family: sans-serif; min-width: 200px;">
          <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #0f172a;">${g.rotulo}</h3>
          <div style="margin-bottom: 12px; max-height: 120px; overflow-y: auto;">
            ${combustiblesHtml}
          </div>
          <a href="/gasolinera/${g.slug}" style="display: block; text-align: center; background: #0f172a; color: white; padding: 8px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: bold;">
            Ver Ficha Completa
          </a>
        </div>
      `);

      layerGroup.addLayer(circle);
    });

    layerGroup.addTo(map);

    // EVENTO MÁGICO: Cambia el tamaño de los puntos dinámicamente según si estás lejos o cerca
    const onZoom = () => {
      const zoom = map.getZoom();
      const newRadius = zoom < 8 ? 2 : zoom < 11 ? 4 : 7;
      layerGroup.eachLayer((layer: any) => {
        if (layer.setRadius) layer.setRadius(newRadius);
      });
    };
    
    map.on('zoomend', onZoom);
    onZoom(); // Aplicar radio inicial

    return () => {
      map.off('zoomend', onZoom);
      map.removeLayer(layerGroup);
    };
  }, [map, stations]);

  return null;
}

export default function Map() {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [allGasolineras, setAllGasolineras] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/mapa`);
        if (res.ok) {
          const data = await res.json();
          setAllGasolineras(data);
        }
      } catch (err) {
        console.error("Error al cargar datos del mapa", err);
      }
    };
    fetchMapData();
  }, []);

  const requestLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
        alert("No se pudo obtener tu ubicación.");
      }
    );
  };

  const defaultCenter = userLocation || { lat: 40.4168, lng: -3.7038 };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 z-10 group">
      <button 
        onClick={requestLocation}
        disabled={loading}
        className="absolute top-4 right-4 z-[400] bg-white text-emerald-600 p-3 rounded-full shadow-lg border border-slate-100 hover:scale-110 hover:bg-emerald-50 transition-all disabled:opacity-50"
        title="Buscar cerca de mí"
      >
        <LocateFixed className={loading ? "animate-spin" : ""} size={24} />
      </button>

      <MapContainer 
        center={[defaultCenter.lat, defaultCenter.lng]} 
        zoom={6} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        maxBounds={[[26.0, -19.0], [44.5, 5.0]]}
        maxBoundsViscosity={1.0}
        minZoom={5}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
        />
        
        <MapController />
        
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={customIcon}>
            <Popup><strong>¡Estás aquí!</strong></Popup>
          </Marker>
        )}

        <FastNativeMarkers stations={allGasolineras} />
        
      </MapContainer>
    </div>
  );
}
