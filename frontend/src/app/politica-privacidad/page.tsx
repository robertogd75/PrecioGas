import Link from 'next/link';
import { ChevronLeft, Lock } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidad - PreciosGas',
  description: 'Política de privacidad y protección de datos de PreciosGas en conformidad con el RGPD.',
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
      <nav className="flex items-center text-sm font-medium text-slate-500 mb-8">
        <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800 font-semibold">Política de Privacidad</span>
      </nav>

      <div className="glass rounded-3xl border border-slate-100 shadow-sm overflow-hidden bg-white p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-600">
            <Lock size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-outfit font-extrabold text-slate-900">Política de Privacidad</h1>
            <p className="text-sm text-slate-500 font-medium">Compromiso absoluto con tu privacidad y el RGPD</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-slate-650 space-y-6 text-sm md:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">1. Responsable del Tratamiento de Datos</h2>
            <p>
              El responsable del tratamiento de los datos recogidos a través de este portal es:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-700">
              <li><strong>Titular:</strong> Roberto García Delgado</li>
              <li><strong>Portfolio / Web:</strong> <a href="https://rgardel.es" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-bold">rgardel.es</a></li>
              <li><strong>Contacto:</strong> rgardel.developer@gmail.com</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">2. Tipo de Datos Recopilados y Finalidad</h2>
            <p>
              En PreciosGas abogamos por el principio de <strong>minimización de datos</strong>. Queremos que navegues con total tranquilidad, por lo que:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li>
                <strong>Datos de Geolocalización:</strong> Al utilizar la función "Cerca de mí", el navegador solicitará tu permiso para acceder a tus coordenadas de ubicación. <strong>Estas coordenadas se procesan de manera estrictamente local en el navegador del usuario</strong> y se envían de forma efímera para listar las gasolineras más cercanas. En ningún caso almacenamos ni registramos tu ubicación en bases de datos externas ni realizamos seguimiento de tu ruta.
              </li>
              <li>
                <strong>Datos de Navegación Anónimos:</strong> Podremos registrar datos puramente técnicos y estadísticos no identificables (como tipo de navegador, tiempo de carga, páginas visitadas) con la única finalidad de optimizar la velocidad y la experiencia de uso del Sitio Web.
              </li>
              <li>
                <strong>Formularios de Contacto / Email:</strong> Si decides contactar con el titular a través del correo electrónico proporcionado, tus datos serán tratados únicamente con la finalidad de resolver tus dudas o sugerencias y serán eliminados tras solventarse la comunicación.
              </li>
              <li>
                <strong>Búsquedas Recientes (Almacenamiento Local):</strong> Cuando buscas un municipio, guardamos de forma estrictamente local en tu dispositivo (`localStorage`) el nombre de la ciudad consultada para habilitar la fila de "Búsquedas recientes" en la página de inicio. Esto mejora sustancialmente la velocidad de uso y evita teclear repetidamente. Estos datos no son compartidos con terceros ni se envían a ningún servidor remoto.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">3. Legitimación del Tratamiento</h2>
            <p>
              La base legal para el tratamiento de tus datos es el <strong>consentimiento expreso e inequívoco</strong> que otorgas al autorizar la geolocalización o al enviarnos un correo electrónico. En cualquier momento puedes retirar el permiso de geolocalización desde los ajustes de privacidad de tu navegador.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">4. Conservación de Datos</h2>
            <p>
              PreciosGas no almacena datos de geolocalización ni búsquedas del usuario. Los datos estadísticos y técnicos se conservarán únicamente durante el tiempo imprescindible para el análisis del rendimiento y la mejora técnica del Sitio Web.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">5. Derechos del Usuario (ARCO-POL)</h2>
            <p>
              En cumplimiento del Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), tienes derecho a ejercer tus derechos de:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
              <li><strong>Acceso:</strong> Saber qué datos estamos tratando.</li>
              <li><strong>Rectificación:</strong> Modificar algún dato incorrecto si nos lo has facilitado.</li>
              <li><strong>Supresión ("Derecho al olvido"):</strong> Solicitar la eliminación total de tus comunicaciones previas.</li>
              <li><strong>Oposición y Limitación:</strong> Oponerte al uso o restringir ciertos tratamientos.</li>
              <li><strong>Portabilidad de Datos:</strong> Solicitar la entrega de tus datos en un formato estructurado.</li>
            </ul>
            <p>
              Puedes ejercer cualquiera de estos derechos enviando un correo a <strong>rgardel.developer@gmail.com</strong> adjuntando copia de tu documento de identidad para verificación legal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">6. Seguridad de los Datos</h2>
            <p>
              Adoptamos todas las medidas de seguridad técnicas y organizativas necesarias (como cifrado mediante conexión segura SSL/HTTPS) para evitar la pérdida, mal uso, alteración o acceso no autorizado a la información que transita temporalmente por nuestra plataforma.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
