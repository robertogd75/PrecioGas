'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Filter, SortAsc, HelpCircle, Check, RefreshCw, ChevronDown, ChevronUp, Map as MapIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

const MunicipiosMap = dynamic(() => import('./MunicipiosMap'), { ssr: false });

interface ListaFiltradaProps {
  gasolineras: any[];
  gasolineraMasBarataId: number;
}

export default function ListaFiltrada({ gasolineras, gasolineraMasBarataId }: ListaFiltradaProps) {
  const [selectedFuel, setSelectedFuel] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('cheap'); // 'cheap' | 'brand'
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const ITEMS_PER_PAGE = 12;

  // Extract all unique fuels present in this specific list
  const uniqueFuels = useMemo(() => {
    const fuels = new Set<string>();
    gasolineras.forEach(g => {
      if (g.combustibles) {
        g.combustibles.forEach((c: any) => fuels.add(c.nombre));
      }
    });
    return Array.from(fuels).sort();
  }, [gasolineras]);

  // Extract all unique services present in this specific list
  const uniqueServices = useMemo(() => {
    const services = new Set<string>();
    gasolineras.forEach(g => {
      if (g.servicios) {
        g.servicios.forEach((s: string) => services.add(s));
      }
    });
    return Array.from(services).sort();
  }, [gasolineras]);

  // Filter and sort logic
  const filteredGasolineras = useMemo(() => {
    let result = [...gasolineras];

    // Filter by search term (brand or address)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(g => 
        g.rotulo.toLowerCase().includes(term) || 
        g.direccion.toLowerCase().includes(term)
      );
    }

    // Filter by specific fuel type
    if (selectedFuel !== 'all') {
      result = result.filter(g => 
        g.combustibles && g.combustibles.some((c: any) => c.nombre === selectedFuel)
      );
    }

    // Filter by specific service
    if (selectedService !== 'all') {
      result = result.filter(g => 
        g.servicios && g.servicios.includes(selectedService)
      );
    }

    // Sorting logic
    if (sortBy === 'cheap') {
      result.sort((a, b) => {
        // If sorting by a specific fuel
        if (selectedFuel !== 'all') {
          const priceA = a.combustibles.find((c: any) => c.nombre === selectedFuel)?.precio || 999;
          const priceB = b.combustibles.find((c: any) => c.nombre === selectedFuel)?.precio || 999;
          return priceA - priceB;
        }
        // Default cheapest of whatever fuel they have
        const minA = a.combustibles && a.combustibles.length > 0 ? a.combustibles[0].precio : 999;
        const minB = b.combustibles && b.combustibles.length > 0 ? b.combustibles[0].precio : 999;
        return minA - minB;
      });
    } else if (sortBy === 'brand') {
      result.sort((a, b) => a.rotulo.localeCompare(b.rotulo));
    }

    return result;
  }, [gasolineras, searchTerm, selectedFuel, selectedService, sortBy]);

  // Paginated list calculation
  const totalPages = Math.ceil(filteredGasolineras.length / ITEMS_PER_PAGE);
  const paginatedGasolineras = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGasolineras.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredGasolineras, currentPage]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleFuelChange = (val: string) => {
    setSelectedFuel(val);
    setCurrentPage(1);
  };

  const handleServiceChange = (val: string) => {
    setSelectedService(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col">
      {/* Dynamic Filters Widget */}
      <div className="glass rounded-3xl p-6 border border-slate-100/80 mb-8">
        <div 
          className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100 cursor-pointer"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <div className="flex items-center gap-2">
            <Filter className="text-emerald-600" size={20} />
            <h2 className="text-lg font-bold text-slate-800 font-outfit">Filtros y Búsqueda ({filteredGasolineras.length})</h2>
          </div>
          {isFiltersOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
        </div>

        {isFiltersOpen && (
          <div className="pt-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Buscar por nombre/dirección</label>
            <input
              type="text"
              placeholder="Ej: Repsol, Calle Mayor..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-white border border-slate-150 text-slate-800 text-sm font-medium rounded-xl p-3.5 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Fuel Select */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Combustible</label>
            <select
              value={selectedFuel}
              onChange={(e) => handleFuelChange(e.target.value)}
              className="bg-white border border-slate-150 text-slate-800 text-sm font-medium rounded-xl p-3.5 focus:border-emerald-500 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="all">Todos los combustibles</option>
              {uniqueFuels.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Service Select */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Servicios</label>
            <select
              value={selectedService}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="bg-white border border-slate-150 text-slate-800 text-sm font-medium rounded-xl p-3.5 focus:border-emerald-500 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="all">Todos los servicios</option>
              {uniqueServices.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Sort Select */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-white border border-slate-150 text-slate-800 text-sm font-medium rounded-xl p-3.5 focus:border-emerald-500 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="cheap">Más baratas primero</option>
              <option value="brand">Nombre (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filters Reset Button */}
        {(searchTerm || selectedFuel !== 'all' || selectedService !== 'all' || sortBy !== 'cheap') && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedFuel('all');
                setSelectedService('all');
                setSortBy('cheap');
                setCurrentPage(1);
              }}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw size={12} /> Limpiar filtros
            </button>
          </div>
        )}
          </div>
        )}
      </div>

      {/* Interactive Map - Classical Integration */}
      <div className="mb-8">
        <button 
          onClick={() => setIsMapOpen(!isMapOpen)}
          className="w-full bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between text-slate-700 font-bold hover:border-emerald-300 transition-colors shadow-sm mb-4"
        >
          <span className="flex items-center gap-2"><MapIcon className="text-emerald-600" size={20}/> Mapa Local Interactivo</span>
          {isMapOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
        </button>
        
        {isMapOpen && (
          <div className="h-[400px] relative w-full rounded-3xl overflow-hidden border border-slate-150 shadow-sm animate-fade-in-up">
            <div className="hidden md:block absolute top-4 left-4 z-[400] bg-white/95 border border-slate-150 text-[10px] text-emerald-600 px-3 py-1.5 rounded-lg font-bold tracking-widest uppercase shadow">
              VISTA DE MAPA LOCAL
            </div>
            <MunicipiosMap stations={filteredGasolineras} />
          </div>
        )}
      </div>

      {/* Grid List */}
      {filteredGasolineras.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 shadow-sm rounded-3xl">
          <HelpCircle size={48} className="mx-auto mb-4 text-slate-400" />
          <p className="text-slate-500 font-medium text-lg">No encontramos resultados con esos filtros.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {paginatedGasolineras.map((g: any, index: number) => (
              <article 
                key={g.id} 
                className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex justify-between items-start mb-4 gap-2">
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {g.rotulo}
                  </h2>
                  {g.id === gasolineraMasBarataId && (
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 shadow-sm shadow-emerald-500/10">
                      MÁS BARATA
                    </span>
                  )}
                </div>

                <address className="flex items-start gap-2 text-slate-500 text-sm not-italic mb-6 h-10 line-clamp-2">
                  <MapPin size={16} className="shrink-0 mt-0.5 text-emerald-500/50" />
                  {g.direccion}
                </address>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  {g.combustibles && g.combustibles.length > 0 ? (
                    g.combustibles.map((c: any, idx: number) => {
                      const nameLow = c.nombre.toLowerCase();
                      const isFilteredFuel = selectedFuel !== 'all' && c.nombre === selectedFuel;
                      
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

                      // Highlight the fuel selected in the filter
                      const highlightBorder = isFilteredFuel ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white scale-105 z-10' : '';

                      return (
                        <div key={idx} className={`rounded-xl p-3 flex flex-col justify-between items-center border transition-all ${bgColor} ${highlightBorder}`}>
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
                    {g.servicios.map((s: string, idx: number) => {
                      const isFilteredService = selectedService === s;
                      return (
                        <span key={idx} className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                          isFilteredService 
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/10' 
                            : 'bg-slate-50 text-slate-500 border border-slate-100'
                        }`}>
                          {isFilteredService && <Check size={10} />} {s}
                        </span>
                      )
                    })}
                  </div>
                )}

                <Link href={`/gasolinera/${g.slug}`} className="flex items-center justify-center w-full gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors mt-auto pt-4 border-t border-slate-100">
                  Ver detalles en mapa <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>

          {/* Client-Side Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 py-8 border-t border-slate-100 mb-6">
              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:border-emerald-500 hover:text-emerald-600 transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  Anterior
                </button>
              )}
              <span className="px-4 text-slate-500 font-medium">Página {currentPage} de {totalPages}</span>
              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-650/15 transition-all cursor-pointer"
                >
                  Siguiente
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
