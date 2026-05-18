import Link from 'next/link';
import { ChevronLeft, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Aviso Legal - PreciosGas',
  description: 'Aviso legal y condiciones de uso del portal comparador de precios de gasolineras PreciosGas.',
};

export default function AvisoLegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
      <nav className="flex items-center text-sm font-medium text-slate-500 mb-8">
        <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800 font-semibold">Aviso Legal</span>
      </nav>

      <div className="glass rounded-3xl border border-slate-100 shadow-sm overflow-hidden bg-white p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-600">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-outfit font-extrabold text-slate-900">Aviso Legal</h1>
            <p className="text-sm text-slate-500 font-medium">Condiciones generales de uso del portal</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-slate-650 space-y-6 text-sm md:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">1. Información Identificativa</h2>
            <p>
              En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa que el presente sitio web <strong>PreciosGas</strong> (disponible en adelante como el "Sitio Web") es propiedad de y está gestionado por:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-700">
              <li><strong>Titular:</strong> Roberto García Delgado</li>
              <li><strong>Sitio Web del Titular:</strong> <a href="https://rgardel.es" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-bold">rgardel.es</a></li>
              <li><strong>Email de contacto:</strong> rgardel.developer@gmail.com</li>
              <li><strong>Actividad:</strong> Divulgación informativa y comparación del coste de combustibles en territorio español.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">2. Objeto y Condiciones de Uso</h2>
            <p>
              El acceso y/o uso de este Sitio Web le atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas.
            </p>
            <p>
              PreciosGas proporciona el acceso a multitud de informaciones, servicios o datos en Internet pertenecientes a Roberto García Delgado. El USUARIO asume la responsabilidad del uso del portal de forma correcta y legal, absteniéndose de incurrir en actividades ilícitas o contrarias a la buena fe y al orden público.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">3. Exclusión de Responsabilidad (Precios de Combustible)</h2>
            <p className="bg-amber-50/55 border border-amber-100 p-4 rounded-2xl text-slate-700">
              <strong>IMPORTANTE:</strong> La información y los precios de los carburantes mostrados en este portal se obtienen mediante sincronización automatizada y directa de los datos públicos y abiertos ofrecidos por el <strong>Geoportal del Ministerio de Industria, Comercio y Turismo</strong> de España. 
            </p>
            <p>
              Dado que los precios fluctúan continuamente en el mercado libre y dependen exclusivamente de las declaraciones de los operadores de cada estación de servicio, <strong>Roberto García Delgado no se hace responsable de las posibles discrepancias, desfases temporales o errores tipográficos</strong> que puedan existir entre los precios mostrados en el Sitio Web y los precios reales aplicados en los surtidores de las gasolineras al momento de repostar. 
            </p>
            <p>
              La información suministrada tiene carácter exclusivamente orientativo e informativo. Se recomienda al usuario verificar los precios oficiales directamente en el establecimiento correspondiente.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">4. Propiedad Intelectual e Industrial</h2>
            <p>
              Roberto García Delgado es titular de todos los derechos de propiedad intelectual e industrial de este Sitio Web, así como de los elementos contenidos en el mismo (a título enunciativo: imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, etc.), a excepción de las marcas comerciales de los operadores de gasolineras (como Repsol, Cepsa, Galp, BP, etc.) que pertenecen a sus respectivos titulares legítimos y se utilizan con fines meramente informativos de identificación comercial.
            </p>
            <p>
              Cualquier uso no autorizado previamente por el titular será considerado un incumplimiento grave de los derechos de propiedad intelectual.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">5. Modificaciones del Portal y del Aviso Legal</h2>
            <p>
              El titular se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que estos aparezcan presentados o localizados en su portal, así como las presentes condiciones en cualquier momento.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">6. Legislación Aplicable y Jurisdicción</h2>
            <p>
              La relación entre Roberto García Delgado y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales competentes de España.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
