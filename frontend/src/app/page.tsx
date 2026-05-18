'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Search, Navigation } from 'lucide-react';

const DynamicMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 animate-pulse rounded-2xl border border-slate-200">
      <div className="text-slate-400 flex flex-col items-center gap-2">
        <Navigation className="animate-bounce" size={32} />
        <p className="font-medium">Cargando mapa interactivo...</p>
      </div>
    </div>
  )
});

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [searching, setSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [recentSearches, setRecentSearches] = useState<Array<{ name: string, query: string }>>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('recent_searches');
        if (raw) {
          setRecentSearches(JSON.parse(raw));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveSearch = (name: string, query: string) => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('recent_searches');
      let list = raw ? JSON.parse(raw) : [];
      list = list.filter((item: any) => item.name.toLowerCase() !== name.toLowerCase());
      list.unshift({ name, query });
      list = list.slice(0, 4);
      localStorage.setItem('recent_searches', JSON.stringify(list));
      setRecentSearches(list);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    setSearching(true);
    setErrorMsg("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/buscar?q=${encodeURIComponent(searchValue)}`);
      if (res.ok) {
        const data = await res.json();
        saveSearch(searchValue.trim(), searchValue.trim());
        // Redirigir a la URL que nos devuelve el Backend inteligente
        window.location.href = data.url;
      } else {
        setErrorMsg("No se han encontrado datos. Prueba con otra ciudad o provincia.");
      }
    } catch (e) {
      setErrorMsg("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
      
      {/* Hero Section Centrado */}
      <section className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-block py-1 px-3 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-4 border border-emerald-200/55 shadow-sm">
          PRECIOS OFICIALES ACTUALIZADOS AL INSTANTE
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-outfit font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
          Encuentra la gasolinera <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            más barata de España
          </span>
        </h1>
        <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-8">
          Comparamos los precios oficiales actualizados directamente del Ministerio. Ahorra hasta 15€ por depósito localizando las estaciones de servicio más económicas de tu zona.
        </p>

        {/* Buscador Central */}
        <div className="max-w-2xl mx-auto mb-6 relative">
          <div className="bg-white p-2 rounded-2xl flex items-center shadow-xl shadow-slate-100 border border-slate-100 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all gap-2">
            <div className="pl-3 text-slate-400 shrink-0">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Introduce municipio, ciudad o provincia..." 
              className="w-full py-2 px-1 bg-transparent outline-none text-slate-800 text-base font-medium placeholder-slate-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <button 
              onClick={handleSearch}
              disabled={searching}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all disabled:opacity-50 cursor-pointer shrink-0 shadow-lg shadow-emerald-600/15"
            >
              {searching ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          {errorMsg && (
            <p className="absolute left-0 right-0 -bottom-6 text-red-500 text-xs font-semibold animate-fade-in-up">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Enlaces Rápidos y Atajos de Búsqueda */}
        {recentSearches.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 animate-fade-in-up">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Búsquedas recientes:</span>
            {recentSearches.map((quick) => (
              <button
                key={quick.name}
                onClick={() => {
                  setSearchValue(quick.name);
                  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                  fetch(`${API_URL}/api/buscar?q=${encodeURIComponent(quick.query)}`)
                    .then(res => res.json())
                    .then(data => {
                      saveSearch(quick.name, quick.query);
                      window.location.href = data.url;
                    })
                    .catch(err => console.error(err));
                }}
                className="bg-white border border-slate-100 hover:border-emerald-500 text-slate-600 hover:text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm hover:shadow"
              >
                {quick.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Precios Medios Nacionales */}
      <section className="max-w-4xl mx-auto mb-12 glass rounded-3xl p-6 border border-slate-100/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pb-4 md:pb-0">
            <span className="text-xs font-bold text-slate-400 block mb-1">⛽ GASOLINA 95</span>
            <span className="text-2xl font-extrabold text-slate-800 font-mono">1.594 €/L</span>
          </div>
          <div className="py-4 md:py-0 md:px-4">
            <span className="text-xs font-bold text-slate-400 block mb-1">⛽ DIÉSEL A</span>
            <span className="text-2xl font-extrabold text-slate-800 font-mono">1.482 €/L</span>
          </div>
          <div className="pt-4 md:pt-0 md:pl-4">
            <span className="text-xs font-bold text-slate-400 block mb-1">⛽ GLP VEHÍCULO</span>
            <span className="text-2xl font-extrabold text-slate-800 font-mono">0.941 €/L</span>
          </div>
        </div>
      </section>

      {/* Mapa Interactivo a Pantalla Completa */}
      <section className="h-[500px] md:h-[600px] relative w-full rounded-3xl overflow-hidden shadow-lg border border-slate-100/80 mb-16">
        <div className="absolute top-4 left-4 z-[400] bg-white/95 border border-slate-150 text-[10px] text-emerald-600 px-3 py-1.5 rounded-lg font-bold tracking-widest uppercase shadow">
          MAPA INTERACTIVO NACIONAL
        </div>
        <DynamicMap />
      </section>

      {/* Grid de Características */}
      <section className="grid md:grid-cols-3 gap-6 py-4">
        {[
          { title: "Sin intermediarios", desc: "Datos oficiales directos del Geoportal del Ministerio en tiempo real." },
          { title: "Búsqueda por cercanía", desc: "Calculamos las estaciones más cercanas a ti con una fórmula en memoria ultra-rápida." },
          { title: "Rendimiento Extremo", desc: "Nuestra arquitectura Node.js sin base de datos tradicional carga los precios en milisegundos." }
        ].map((feature, i) => (
          <div key={i} className="glass p-6 rounded-2xl hover:border-emerald-300 transition-all duration-300 border border-slate-100 flex gap-4 items-start shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-sm border border-emerald-100 shrink-0 font-mono">
              0{i + 1}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-850 mb-1">{feature.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}
