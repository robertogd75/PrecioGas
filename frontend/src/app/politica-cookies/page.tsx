import Link from 'next/link';
import { ChevronLeft, Cookie } from 'lucide-react';

export const metadata = {
  title: 'Política de Cookies - PreciosGas',
  description: 'Información detallada sobre el uso de cookies y almacenamiento local en PreciosGas.',
};

export default function PoliticaCookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
      <nav className="flex items-center text-sm font-medium text-slate-500 mb-8">
        <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800 font-semibold">Política de Cookies</span>
      </nav>

      <div className="glass rounded-3xl border border-slate-100 shadow-sm overflow-hidden bg-white p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-600">
            <Cookie size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-outfit font-extrabold text-slate-900">Política de Cookies</h1>
            <p className="text-sm text-slate-500 font-medium">Uso transparente de almacenamiento local y cookies técnicas</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-slate-650 space-y-6 text-sm md:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">1. ¿Qué son las Cookies?</h2>
            <p>
              Una cookie es un pequeño fichero de texto que se almacena en su navegador cuando visita casi cualquier página web. Su utilidad es que la web sea capaz de recordar su visita cuando vuelva a navegar por esa página, optimizando las funcionalidades y personalizando la visualización de los mapas o los filtros.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">2. Cookies y Tecnologías Utilizadas en este Portal</h2>
            <p>
              PreciosGas prioriza tu privacidad. Por tanto, <strong>no utilizamos cookies de publicidad de terceros, ni cookies de rastreo comercial (marketing), ni creamos perfiles comerciales con tu comportamiento</strong>. Las únicas tecnologías de almacenamiento que empleamos son las siguientes:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-slate-700">
              <li>
                <strong>Cookies Técnicas y Estrictamente Necesarias:</strong> Aquellas requeridas para el correcto funcionamiento del framework Next.js y el renderizado rápido del Sitio Web.
              </li>
              <li>
                <strong>Almacenamiento Local (LocalStorage / SessionStorage):</strong> Utilizado de forma local en tu navegador con la única finalidad de guardar temporalmente tus preferencias de filtros (por ejemplo, el combustible seleccionado, ordenación de precios o coordenadas de mapa) y tu listado de hasta 4 búsquedas recientes para autocompletar la página de inicio de forma rápida, evitando tener que reconfigurarlos o teclear repetidamente en cada visita.
              </li>
              <li>
                <strong>Cookies de Mapas Interactivos (Leaflet):</strong> Al renderizarse el mapa interactivo de gasolineras, la biblioteca Leaflet puede utilizar almacenamiento local estrictamente técnico para almacenar fragmentos (tiles) del mapa en caché y mejorar la velocidad de carga visual.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">3. Desactivación o Eliminación de Cookies</h2>
            <p>
              En cualquier momento puedes ejercer tu derecho de desactivación o eliminación de cookies de este sitio web desde la configuración de tu navegador. Aquí tienes las guías rápidas para los navegadores más utilizados:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>Google Chrome:</strong> <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Configuración de cookies en Chrome</a>
              </li>
              <li>
                <strong>Mozilla Firefox:</strong> <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Configuración de cookies en Firefox</a>
              </li>
              <li>
                <strong>Apple Safari:</strong> <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Configuración de cookies en Safari</a>
              </li>
              <li>
                <strong>Microsoft Edge:</strong> <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Configuración de cookies en Edge</a>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">4. Notas Adicionales y Aceptación</h2>
            <p>
              Al continuar navegando por el portal PreciosGas sin desactivar las cookies en su navegador, el USUARIO acepta la instalación de las tecnologías estrictamente técnicas y locales descritas anteriormente para la correcta usabilidad, mapa interactivo y cálculo de distancias de repostaje.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
