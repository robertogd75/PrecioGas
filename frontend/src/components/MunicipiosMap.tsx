'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Fuel, MapPin } from 'lucide-react';

const activeIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Centrador automático y dinámico de límites del mapa según los puntos mostrados
function BoundsController({ stations }: { stations: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (!stations || stations.length === 0) return;
    
    const validPoints = stations
      .filter(s => (s.lat || s.latitud) && (s.lng || s.longitud))
      .map(s => {
        const latitude = parseFloat(s.lat || s.latitud);
        const longitude = parseFloat(s.lng || s.longitud);
        return [latitude, longitude] as L.LatLngTuple;
      });
      
    if (validPoints.length > 0) {
      const bounds = L.latLngBounds(validPoints);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [map, stations]);

  return null;
}

export default function MunicipiosMap({ stations }: { stations: any[] }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="w-full h-full bg-[#090c15] border border-slate-800/80 rounded-3xl flex items-center justify-center">
        <span className="text-slate-500 font-medium animate-pulse">Cargando visualizador de mapa...</span>
      </div>
    );
  }

  // Coordenadas iniciales por defecto (por si no hay estaciones al iniciar)
  const defaultCenter: L.LatLngTuple = [40.4168, -3.7038];

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 z-10">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        maxBounds={[[26.0, -19.0], [44.5, 5.0]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
        />
        
        <BoundsController stations={stations} />

        {stations.map((s) => {
          const latitude = parseFloat(s.lat || s.latitud);
          const longitude = parseFloat(s.lng || s.longitud);
          if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) return null;
          
          return (
            <Marker key={s.id} position={[latitude, longitude]} icon={activeIcon}>
              <Popup>
                <div className="font-sans min-w-[200px] bg-[#07090e] text-white p-3 rounded-lg border border-slate-800">
                  <h3 className="font-bold text-sm text-[#CCFF00] mb-2">{s.rotulo}</h3>
                  <p className="text-[11px] text-slate-400 mb-3 flex items-start gap-1">
                    <MapPin size={12} className="shrink-0 mt-0.5" />
                    {s.direccion}
                  </p>
                  
                  <div className="space-y-1.5 max-h-[100px] overflow-y-auto mb-3">
                    {s.combustibles && s.combustibles.map((c: any, idx: number) => {
                      const isGasolina = c.nombre.toLowerCase().includes('gasolina');
                      const badgeColor = isGasolina ? 'text-cyan-400' : 'text-amber-400';
                      return (
                        <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-slate-800/40">
                          <span className="text-[9px] font-bold uppercase text-slate-400">{c.nombre}</span>
                          <span className={`font-mono font-extrabold ${badgeColor}`}>{c.precio}€</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <a 
                    href={`/gasolinera/${s.slug}`} 
                    className="block text-center bg-[#CCFF00] text-slate-950 py-1.5 rounded-lg text-xs font-black hover:bg-white transition-colors"
                  >
                    Detalles y Precios
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
