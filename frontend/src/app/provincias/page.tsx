'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, MapPin, ChevronRight, Check } from 'lucide-react';

const CCAA_MAP: { [key: string]: string[] } = {
  'Andalucía': ['ALMERIA', 'CADIZ', 'CORDOBA', 'GRANADA', 'HUELVA', 'JAEN', 'MALAGA', 'SEVILLA'],
  'Aragón': ['HUESCA', 'TERUEL', 'ZARAGOZA'],
  'Asturias': ['ASTURIAS'],
  'Baleares': ['BALEARS (ILLES)', 'ILLES BALEARS', 'BALEARES'],
  'Canarias': ['LAS PALMAS', 'SANTA CRUZ DE TENERIFE'],
  'Cantabria': ['CANTABRIA'],
  'Castilla y León': ['AVILA', 'BURGOS', 'LEON', 'PALENCIA', 'SALAMANCA', 'SEGOVIA', 'SORIA', 'VALLADOLID', 'ZAMORA'],
  'Castilla-La Mancha': ['ALBACETE', 'CIUDAD REAL', 'CUENCA', 'GUADALAJARA', 'TOLEDO'],
  'Cataluña': ['BARCELONA', 'GIRONA', 'LLEIDA', 'TARRAGONA'],
  'Comunidad Valenciana': ['ALICANTE', 'CASTELLON', 'VALENCIA'],
  'Extremadura': ['BADAJOZ', 'CACERES'],
  'Galicia': ['CORUÑA (A)', 'LUGO', 'OURENSE', 'PONTEVEDRA', 'A CORUÑA'],
  'La Rioja': ['LA RIOJA'],
  'Madrid': ['MADRID'],
  'Murcia': ['MURCIA'],
  'Navarra': ['NAVARRA'],
  'País Vasco': ['ARABA/ALAVA', 'BIZKAIA', 'GIPUZKOA', 'ALAVA', 'GUIPUZCOA', 'VIZCAYA'],
  'Ceuta': ['CEUTA'],
  'Melilla': ['MELILLA']
};

export default function ProvinciasPage() {
  const [provincias, setProvincias] = useState<string[]>([]);
  const [selectedCCAA, setSelectedCCAA] = useState<string | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<string | null>(null);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [loadingProvincias, setLoadingProvincias] = useState(true);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${API_URL}/api/provincias`)
      .then(res => res.json())
      .then(data => {
        setProvincias(data);
        setLoadingProvincias(false);
      })
      .catch(() => setLoadingProvincias(false));
  }, []);

  const handleProvinciaClick = (prov: string) => {
    setSelectedProvincia(prov);
    setLoadingMunicipios(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${API_URL}/api/municipios/${encodeURIComponent(prov)}`)
      .then(res => res.json())
      .then(data => {
        setMunicipios(data);
        setLoadingMunicipios(false);
      })
      .catch(() => setLoadingMunicipios(false));
  };

  const normalizeName = (name: string) => {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
  };

  const toTitleCase = (str: string) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getProvinciasOfCCAA = (ccaa: string) => {
    const allowed = CCAA_MAP[ccaa].map(normalizeName);
    return provincias.filter(p => allowed.includes(normalizeName(p)));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      {/* Back button */}
      <nav className="flex items-center text-sm font-medium text-slate-500 mb-8">
        <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Volver al Inicio
        </Link>
      </nav>

      {/* Header */}
      <header className="glass p-8 md:p-12 rounded-3xl mb-12 relative overflow-hidden border border-slate-100/80">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <h1 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-4 relative z-10">
          Buscar por <span className="text-emerald-600">Localidad</span>
        </h1>
        <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl relative z-10">
          Selecciona tu Comunidad Autónoma, a continuación tu provincia, y finalmente tu municipio para ver las gasolineras más baratas de tu zona.
        </p>
      </header>

      {/* Step Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Paso 1: Comunidades Autónomas */}
        <section className="glass rounded-3xl p-6 border border-slate-100/80 min-h-[500px]">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-650 border border-emerald-200/55 w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold">1</span>
            Comunidad Autónoma
          </h2>
          {loadingProvincias ? (
            <div className="animate-pulse space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-100/50 border border-slate-100 rounded-xl"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {Object.keys(CCAA_MAP).map(ccaa => {
                const isActive = selectedCCAA === ccaa;
                return (
                  <button
                    key={ccaa}
                    onClick={() => {
                      setSelectedCCAA(ccaa);
                      setSelectedProvincia(null);
                      setMunicipios([]);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl text-sm font-bold flex justify-between items-center transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10' 
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-100'
                    }`}
                  >
                    <span>{ccaa}</span>
                    <ChevronRight size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Paso 2: Provincias */}
        <section className="glass rounded-3xl p-6 border border-slate-100/80 min-h-[500px]">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-650 border border-emerald-200/55 w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold">2</span>
            Provincia
          </h2>
          {!selectedCCAA ? (
            <div className="text-center py-20 text-slate-400">
              <MapPin size={48} className="mx-auto mb-4 text-emerald-600/15" />
              <p className="text-sm font-medium">Selecciona una CCAA primero</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {getProvinciasOfCCAA(selectedCCAA).map(prov => {
                const isActive = selectedProvincia === prov;
                return (
                  <button
                    key={prov}
                    onClick={() => handleProvinciaClick(prov)}
                    className={`w-full text-left p-3.5 rounded-xl text-sm font-bold flex justify-between items-center transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10' 
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-100'
                    }`}
                  >
                    <span>{toTitleCase(prov)}</span>
                    <ChevronRight size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Paso 3: Municipios */}
        <section className="glass rounded-3xl p-6 border border-slate-100/80 min-h-[500px]">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-650 border border-emerald-200/55 w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold">3</span>
            Municipio
          </h2>
          {!selectedProvincia ? (
            <div className="text-center py-20 text-slate-400">
              <MapPin size={48} className="mx-auto mb-4 text-emerald-600/15" />
              <p className="text-sm font-medium">Selecciona una provincia primero</p>
            </div>
          ) : loadingMunicipios ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
              <p className="text-slate-500 text-sm">Cargando municipios...</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {municipios.map(muni => {
                const provSlug = normalizeName(selectedProvincia).toLowerCase();
                const muniSlug = normalizeName(muni).toLowerCase();
                return (
                  <Link
                    key={muni}
                    href={`/gasolineras/${provSlug}/${muniSlug}`}
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        try {
                          const raw = localStorage.getItem('recent_searches');
                          let list = raw ? JSON.parse(raw) : [];
                          list = list.filter((item: any) => item.name.toLowerCase() !== muni.toLowerCase());
                          list.unshift({ name: muni, query: muni });
                          list = list.slice(0, 4);
                          localStorage.setItem('recent_searches', JSON.stringify(list));
                        } catch (e) {}
                      }
                    }}
                    className="w-full text-left p-3.5 rounded-xl text-sm font-bold flex justify-between items-center bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-100 hover:border-emerald-200 transition-all group"
                  >
                    <span>{muni}</span>
                    <Check size={16} className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
