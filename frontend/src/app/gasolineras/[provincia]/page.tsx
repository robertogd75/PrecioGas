import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getMunicipiosProvincia(provincia: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const res = await fetch(`${API_URL}/api/gasolineras?provincia=${encodeURIComponent(provincia)}&limit=10000`, { cache: 'no-store' });
    if (!res.ok) return { municipios: [], provinciaOriginal: provincia };
    const json = await res.json();
    const data = json.data || [];
    
    // Obtener la provincia original con acentos de los datos
    const provinciaOriginal = data[0]?.provincia || provincia;

    // Extraer municipios únicos con sus tildes originales
    const uniqueMunis = new Map<string, string>();
    data.forEach((g: any) => {
      if (g.municipio) {
        const normalized = g.municipio.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
        if (!uniqueMunis.has(normalized)) {
          uniqueMunis.set(normalized, g.municipio);
        }
      }
    });

    const municipios = Array.from(uniqueMunis.values()).sort((a, b) => a.localeCompare(b, 'es'));
    return { municipios, provinciaOriginal };
  } catch (e) {
    return { municipios: [], provinciaOriginal: provincia };
  }
}

export default async function ProvinciaPage({ params }: { params: Promise<{ provincia: string }> }) {
  const { provincia: rawProvincia } = await params;
  const provincia = decodeURIComponent(rawProvincia);
  const { municipios, provinciaOriginal } = await getMunicipiosProvincia(provincia);

  if (!municipios || municipios.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="glass p-10 rounded-3xl max-w-2xl mx-auto border border-slate-100 shadow-sm relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <h1 className="text-3xl font-bold mb-4 text-slate-900">No se encontraron datos</h1>
          <p className="text-slate-500 mb-8">Parece que la provincia "{provincia}" no existe o está mal escrita.</p>
          <Link href="/" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-extrabold hover:bg-emerald-700 shadow-lg shadow-emerald-500/15 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // Capitalización bonita de la provincia original (ej: "MÁLAGA" -> "Málaga")
  const toTitleCase = (str: string) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  const provDisplay = toTitleCase(provinciaOriginal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      <nav className="flex items-center text-sm font-medium text-slate-500 mb-8">
        <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Volver al Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-emerald-600 font-bold">{provDisplay}</span>
      </nav>

      <header className="glass p-8 md:p-12 rounded-3xl mb-12 relative overflow-hidden border border-slate-100 shadow-sm bg-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 relative z-10">
          Gasolineras en <span className="text-emerald-600">{provDisplay}</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-3xl relative z-10">
          Selecciona un municipio de la provincia para comparar precios y encontrar la opción más barata hoy.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {municipios.map((muni: string, idx) => {
          return (
            <Link 
              key={idx} 
              href={`/gasolineras/${provincia.toLowerCase()}/${muni.toLowerCase()}`}
              className="bg-slate-50/50 p-4 rounded-xl flex items-center gap-3 border border-slate-100 hover:border-emerald-300 transition-all hover:-translate-y-1 hover:shadow-sm group"
            >
              <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <MapPin size={18} />
              </div>
              <span className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
                {muni}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
