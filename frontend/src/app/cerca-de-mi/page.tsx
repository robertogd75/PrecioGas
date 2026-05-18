'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Info, ArrowRight, ChevronLeft, Navigation, Fuel } from 'lucide-react';

function CercaDeMiContent() {
  const searchParams = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  const [gasolineras, setGasolineras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!lat || !lng) {
      setError('Coordenadas no encontradas.');
      setLoading(false);
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${API_URL}/api/cerca?lat=${lat}&lng=${lng}&radio=15&limit=20&order=distancia`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener datos del servidor');
        return res.json();
      })
      .then((data) => {
        setGasolineras(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Ocurrió un error al cargar las gasolineras.');
        setLoading(false);
      });
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center animate-fade-in-up">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-slate-500 font-medium font-outfit">Buscando las gasolineras más cercanas a ti...</p>
      </div>
    );
  }

  if (error || gasolineras.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in-up">
        <div className="glass border border-slate-100 shadow-sm p-8 rounded-3xl inline-block max-w-md mx-auto relative overflow-hidden bg-white">
          <Info size={40} className="mx-auto mb-4 text-emerald-600" />
          <h2 className="text-xl font-bold mb-2 text-slate-800">No se encontraron gasolineras</h2>
          <p className="text-sm text-slate-500 mb-6">{error || 'No hay gasolineras en un radio de 15km de tu ubicación.'}</p>
          <Link href="/" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors cursor-pointer shadow-lg shadow-emerald-500/15">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      {/* Back button */}
      <nav className="flex items-center text-sm font-medium text-slate-500 mb-8">
        <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Volver a la página principal
        </Link>
      </nav>

      {/* Header card with glassmorphism */}
      <header className="glass p-8 md:p-12 rounded-3xl mb-12 relative overflow-hidden border border-slate-100/80 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <h1 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-4 relative z-10">
          Gasolineras <span className="text-emerald-600">cerca de ti</span>
        </h1>
        <div className="flex gap-4 items-start relative z-10">
          <div className="text-emerald-500 mt-1"><Navigation size={24}/></div>
          <p className="text-base md:text-lg text-slate-650 leading-relaxed max-w-4xl">
            Hemos encontrado <strong>{gasolineras.length} estaciones de servicio</strong> a menos de 15km a la redonda de tu posición actual. 
            Están ordenadas por cercanía para que encuentres la opción más cómoda rápidamente.
          </p>
        </div>
      </header>

      {/* List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {gasolineras.map((g: any, index: number) => {
          return (
            <article 
              key={g.id} 
              className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-4 gap-2">
                <h2 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  {g.rotulo}
                </h2>
                <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1 shrink-0">
                  <Navigation size={12} /> {g.distanciaKm ? g.distanciaKm.toFixed(1) : g.distancia ? g.distancia.toFixed(1) : '?' } km
                </span>
              </div>

              <address className="flex items-start gap-2 text-slate-550 text-sm not-italic mb-6 h-10 line-clamp-2">
                <MapPin size={16} className="shrink-0 mt-0.5 text-emerald-500/50" />
                {g.direccion}, {g.municipio}
              </address>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {g.combustibles && g.combustibles.length > 0 ? (
                  g.combustibles.map((c: any, idx: number) => {
                    const nameLow = c.nombre.toLowerCase();
                    let bgColor = 'bg-slate-50 border-slate-100 text-slate-700';
                    let badgeBg = 'bg-slate-100 text-slate-500';
                    
                    if (nameLow.includes('gasolina')) {
                      bgColor = 'bg-cyan-50 border-cyan-100 text-cyan-700';
                      badgeBg = 'bg-cyan-100/60 text-cyan-600';
                    } else if (nameLow.includes('gasoleo') || nameLow.includes('diesel') || nameLow.includes('diésel')) {
                      bgColor = 'bg-amber-50 border-amber-100 text-amber-700';
                      badgeBg = 'bg-amber-100/60 text-amber-600';
                    } else if (nameLow.includes('glp') || nameLow.includes('gas') || nameLow.includes('gnc')) {
                      bgColor = 'bg-indigo-50 border-indigo-100 text-indigo-700';
                      badgeBg = 'bg-indigo-100/60 text-indigo-650';
                    }

                    return (
                      <div key={idx} className={`rounded-xl p-3 flex flex-col justify-between items-center border transition-all ${bgColor}`}>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 ${badgeBg} text-center line-clamp-1`} title={c.nombre}>
                          {c.nombre}
                        </span>
                        <span className="text-xl font-extrabold font-mono">
                          {c.precio}€
                        </span>
                      </div>
                    )
                  })
                ) : (
                  <div className="col-span-2 text-center py-4 text-slate-400 text-sm font-medium bg-slate-50 rounded-xl border border-slate-100">
                    Precios no disponibles temporalmente
                  </div>
                )}
              </div>

              {/* Inferred Services Badges */}
              {g.servicios && g.servicios.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {g.servicios.map((s: string, idx: number) => (
                    <span key={idx} className="bg-slate-50 text-slate-500 border border-slate-100 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <Link href={`/gasolinera/${g.slug}`} className="flex items-center justify-center w-full gap-2 text-sm font-bold text-slate-500 group-hover:text-emerald-600 transition-colors mt-auto pt-4 border-t border-slate-100">
                Ver detalles y mapa <ArrowRight size={16} />
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function CercaDeMiPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center animate-fade-in-up">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-slate-500 font-medium font-outfit">Preparando geolocalización...</p>
      </div>
    }>
      <CercaDeMiContent />
    </Suspense>
  );
}
