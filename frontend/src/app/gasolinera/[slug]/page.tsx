import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Clock, Fuel, ChevronLeft, Check } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getGasolinera(slug: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const res = await fetch(`${API_URL}/api/gasolinera/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getGasolinera(slug);
  if (!data) return { title: 'Gasolinera no encontrada' };

  return {
    title: `Precios en ${data.rotulo} - ${data.municipio}`,
    description: `Consulta el precio actual de los combustibles en la gasolinera ${data.rotulo} situada en ${data.direccion}, ${data.municipio}.`,
  };
}

export default async function GasolineraPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gasolinera = await getGasolinera(slug);

  if (!gasolinera) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
      <nav className="flex items-center text-sm font-medium text-slate-500 mb-8">
        <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/gasolineras/${gasolinera.provincia.toLowerCase()}`} className="hover:text-emerald-600 transition-colors capitalize">
          {gasolinera.provincia}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/gasolineras/${gasolinera.provincia.toLowerCase()}/${gasolinera.municipio.toLowerCase()}`} className="hover:text-emerald-600 transition-colors capitalize">
          {gasolinera.municipio}
        </Link>
      </nav>

      <div className="glass rounded-3xl border border-slate-100 shadow-sm overflow-hidden bg-white">
        <div className="bg-slate-50 p-8 text-slate-800 relative overflow-hidden border-b border-slate-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <h1 className="text-3xl md:text-5xl font-outfit font-extrabold mb-4 relative z-10 text-slate-900">{gasolinera.rotulo}</h1>
          <div className="flex flex-col gap-2 text-slate-650 relative z-10 text-sm md:text-base">
            <p className="flex items-center gap-2"><MapPin size={18} className="text-emerald-500"/> {gasolinera.direccion}, {gasolinera.municipio} ({gasolinera.provincia})</p>
            <p className="flex items-center gap-2"><Clock size={18} className="text-emerald-500"/> {gasolinera.horario}</p>
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 font-outfit">
            <Fuel size={24} className="text-emerald-500" /> Precios Actualizados
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gasolinera.combustibles && gasolinera.combustibles.length > 0 ? (
              gasolinera.combustibles.map((c: any, idx: number) => {
                const nameLow = c.nombre.toLowerCase();
                let borderColor = 'hover:border-slate-200';
                let priceColor = 'text-slate-800';
                
                if (nameLow.includes('gasolina')) {
                  borderColor = 'hover:border-cyan-300';
                  priceColor = 'text-cyan-600';
                } else if (nameLow.includes('gasoleo') || nameLow.includes('diesel') || nameLow.includes('diésel')) {
                  borderColor = 'hover:border-amber-300';
                  priceColor = 'text-amber-600';
                } else if (nameLow.includes('glp') || nameLow.includes('gas') || nameLow.includes('gnc')) {
                  borderColor = 'hover:border-indigo-300';
                  priceColor = 'text-indigo-650';
                }

                return (
                  <div key={idx} className={`bg-slate-50/50 border border-slate-100 p-6 rounded-2xl flex flex-col justify-between items-center transition-all ${borderColor}`}>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">{c.nombre}</span>
                    <span className={`text-4xl font-extrabold font-mono ${priceColor}`}>{c.precio}€</span>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-500">No hay precios disponibles en este momento.</p>
            )}
          </div>
          
          {gasolinera.servicios && gasolinera.servicios.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 font-outfit">
                Servicios Adicionales
              </h2>
              <div className="flex flex-wrap gap-3">
                {gasolinera.servicios.map((s: string, idx: number) => (
                  <span key={idx} className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-bold text-sm border border-emerald-100 shadow-sm flex items-center gap-2">
                    <Check size={14} className="text-emerald-500" /> {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 pt-8 border-t border-slate-100 flex justify-center">
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${gasolinera.latitud},${gasolinera.longitud}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/15"
            >
              <MapPin size={20} className="mr-2" /> Cómo llegar en Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
