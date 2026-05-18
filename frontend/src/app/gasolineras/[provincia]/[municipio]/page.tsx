import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Info, ArrowRight, ChevronLeft } from 'lucide-react';
import ListaFiltrada from '../../../../components/ListaFiltrada';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    provincia: string;
    municipio: string;
  };
  searchParams: { page?: string };
}

async function getGasolinerasMunicipio(provincia: string, municipio: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    // Traemos un límite alto (500) para obtener todas de golpe y poder filtrar/paginar en el cliente
    const res = await fetch(`${API_URL}/api/gasolineras?provincia=${encodeURIComponent(provincia)}&municipio=${encodeURIComponent(municipio)}&page=1&limit=500`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ provincia: string, municipio: string }> }): Promise<Metadata> {
  const { provincia, municipio } = await params;
  
  const decodeAndCapitalize = (str: string) => {
    try {
      const decoded = decodeURIComponent(str);
      return decoded
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    } catch (e) {
      return str;
    }
  };

  const muniCap = decodeAndCapitalize(municipio);
  const provCap = decodeAndCapitalize(provincia);

  return {
    title: `Gasolineras baratas en ${muniCap} (${provCap}) - Precio hoy`,
    description: `Descubre la gasolinera más barata en ${muniCap}. Precios actualizados en tiempo real del diésel y la gasolina 95.`,
    alternates: {
      canonical: `https://tusitio.com/gasolineras/${provincia}/${municipio}`
    }
  };
}

export default async function MunicipioPage({ params }: { params: Promise<{ provincia: string, municipio: string }> }) {
  const { provincia: rawProvincia, municipio: rawMunicipio } = await params;
  const provincia = decodeURIComponent(rawProvincia);
  const municipio = decodeURIComponent(rawMunicipio);

  const response = await getGasolinerasMunicipio(provincia, municipio);
  const gasolineras = response?.data || [];
  const total = response?.total || 0;
  const tieneGasolineras = gasolineras.length > 0;

  // Calcular la gasolinera más barata de gasolina 95 y de diésel por separado
  let gasolineraDieselMasBarata: any = null;
  let precioDieselMasBarato = 999;
  
  let gasolineraGasolinaMasBarata: any = null;
  let precioGasolinaMasBarato = 999;

  if (tieneGasolineras) {
    gasolineras.forEach((g: any) => {
      if (g.combustibles) {
        const diesel = g.combustibles.find((c: any) => c.nombre === 'Gasoleo A');
        const gasolina = g.combustibles.find((c: any) => c.nombre === 'Gasolina 95 E5');
        
        if (diesel && diesel.precio < precioDieselMasBarato) {
          precioDieselMasBarato = diesel.precio;
          gasolineraDieselMasBarata = g;
        }
        if (gasolina && gasolina.precio < precioGasolinaMasBarato) {
          precioGasolinaMasBarato = gasolina.precio;
          gasolineraGasolinaMasBarata = g;
        }
      }
    });
  }

  // Decodificación y capitalización inteligente para visualización
  const decodeAndCapitalize = (str: string) => {
    try {
      const decoded = decodeURIComponent(str);
      return decoded
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    } catch (e) {
      return str;
    }
  };

  // Si hay gasolineras, usamos el nombre exacto con tildes reportado por MITECO (ej: 'Alhaurín el Grande' o 'MÁLAGA')
  const muniDisplay = tieneGasolineras ? gasolineras[0].municipio : decodeAndCapitalize(municipio);
  const provDisplay = tieneGasolineras 
    ? (gasolineras[0].provincia.charAt(0).toUpperCase() + gasolineras[0].provincia.slice(1).toLowerCase()) 
    : decodeAndCapitalize(provincia);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm font-medium text-slate-500 mb-8">
        <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Volver
        </Link>
        <span className="mx-2">/</span>
        <span className="capitalize">{provDisplay}</span>
        <span className="mx-2">/</span>
        <span className="text-slate-700 font-bold">{muniDisplay}</span>
      </nav>

      {/* SEO Header - Glassmorphism */}
      <header className="glass p-6 md:p-12 rounded-3xl mb-12 relative overflow-hidden border border-slate-100/80 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-4 relative z-10">
          Precio de la gasolina en <span className="text-emerald-600">{muniDisplay}</span> hoy
        </h1>
        <div className="flex gap-4 items-start relative z-10">
          <div className="text-emerald-500 mt-1"><Info size={24}/></div>
          <div className="text-base md:text-lg text-slate-600 leading-relaxed max-w-4xl space-y-3">
            {tieneGasolineras ? (
              <>
                <p>
                  Actualmente, existen <strong>{total} estaciones de servicio</strong> registradas en el municipio de {muniDisplay} ({provDisplay}).
                </p>
                {gasolineraGasolinaMasBarata && (
                  <p>
                    Si buscas <strong>Gasolina 95</strong>, la opción más económica hoy es{' '}
                    <Link href={`/gasolinera/${gasolineraGasolinaMasBarata.slug}`} className="font-bold text-emerald-600 hover:text-emerald-700 underline decoration-dotted transition-colors">
                      {gasolineraGasolinaMasBarata.rotulo}
                    </Link>{' '}
                    (ubicada en <em className="text-slate-500">{gasolineraGasolinaMasBarata.direccion}</em>) a tan solo <span className="text-emerald-600 font-extrabold text-xl font-mono">{precioGasolinaMasBarato}€/l</span>.
                  </p>
                )}
                {gasolineraDieselMasBarata && (
                  <p>
                    Para <strong>Diésel (Gasóleo A)</strong>, la estación más barata es{' '}
                    <Link href={`/gasolinera/${gasolineraDieselMasBarata.slug}`} className="font-bold text-emerald-600 hover:text-emerald-700 underline decoration-dotted transition-colors">
                      {gasolineraDieselMasBarata.rotulo}
                    </Link>{' '}
                    (en <em className="text-slate-500">{gasolineraDieselMasBarata.direccion}</em>) con un precio de <span className="text-emerald-600 font-extrabold text-xl font-mono">{precioDieselMasBarato}€/l</span>.
                  </p>
                )}
              </>
            ) : (
              <p>
                Actualmente no figuran estaciones de servicio para este municipio en nuestra base de datos.
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Listado o Empty State */}
      {tieneGasolineras ? (
        <ListaFiltrada 
          gasolineras={gasolineras} 
          gasolineraMasBarataId={gasolineraGasolinaMasBarata?.id || gasolineraDieselMasBarata?.id || 0} 
        />
      ) : (
        <div className="glass rounded-3xl p-6 sm:p-12 text-center border border-slate-100 shadow-sm max-w-2xl mx-auto my-10 relative overflow-hidden bg-white">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 opacity-70"></div>
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 border border-emerald-100">
            <Info size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 relative z-10 font-outfit">Sin registros de gasolineras</h2>
          <p className="text-slate-500 leading-relaxed mb-8 max-w-md mx-auto relative z-10">
            No encontramos estaciones de servicio activas en el municipio de <strong>{muniDisplay}</strong> en el sistema del Ministerio en este momento.
          </p>
          <Link href="/provincias" className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/15 relative z-10 cursor-pointer">
            Buscar en otro municipio
          </Link>
        </div>
      )}

    </div>
  );
}
