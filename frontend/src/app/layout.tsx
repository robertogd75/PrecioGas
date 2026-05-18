import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import Image from 'next/image'
import { Fuel, MapPin, TrendingDown } from 'lucide-react'
import CercaDeMiBtn from '../components/CercaDeMiBtn'
import MobileBottomNav from '../components/MobileBottomNav'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'Gasolineras España - Encuentra el mejor precio hoy',
  description: 'Consulta en tiempo real los precios de las gasolineras en España. Encuentra la más cercana y barata a ti.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-screen flex flex-col relative pb-20 md:pb-0 overflow-x-hidden`}>
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent -z-10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px] -z-10 pointer-events-none"></div>
        
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <Link href="/" className="flex items-center group transition-transform hover:scale-[1.02] gap-3">
                <Image src="/logo.png" alt="PreciosGas Logo" width={56} height={56} className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-xl" priority />
                <span className="font-outfit font-bold text-xl md:text-2xl tracking-tight text-slate-900">
                  Precio<span className="text-emerald-600">Gas</span>
                </span>
              </Link>
              <div className="hidden md:flex space-x-8">
                <CercaDeMiBtn />
                <Link href="/provincias" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors flex items-center gap-2">
                  <TrendingDown size={18} /> Más Baratas
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Floating Mobile Bottom Nav */}
        <MobileBottomNav />

        {/* Footer */}
        <footer className="bg-slate-50 border-t border-slate-100 py-16 mt-20 text-slate-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Columna 1: Brand & Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Image src="/logo.png" alt="PreciosGas Logo" width={56} height={56} className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-xl" />
                  <span className="font-outfit font-bold text-xl tracking-tight text-slate-900">
                    Precio<span className="text-emerald-600">Gas</span>
                  </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Tu portal de confianza para comparar los precios de los combustibles actualizados al instante en toda España. Ahorra en cada repostaje de forma rápida y sencilla.
                </p>
              </div>

              {/* Columna 2: Enlaces Rápidos */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Enlaces Rápidos</h3>
                <ul className="space-y-2.5">
                  <li>
                    <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link href="/provincias" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                      Buscar por Localidad
                    </Link>
                  </li>
                  <li>
                    <Link href="/provincias" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                      Gasolineras Baratas
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Columna 3: Información Legal */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Legal</h3>
                <ul className="space-y-2.5">
                  <li>
                    <Link href="/aviso-legal" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                      Aviso Legal
                    </Link>
                  </li>
                  <li>
                    <Link href="/politica-privacidad" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                      Política de Privacidad
                    </Link>
                  </li>
                  <li>
                    <Link href="/politica-cookies" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                      Política de Cookies
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Columna 4: Fuente de datos */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Datos Oficiales</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-3">
                  Los precios son proporcionados y actualizados periódicamente en sincronización con el Geoportal del Ministerio de Industria, Comercio y Turismo de España.
                </p>
              </div>
            </div>

            {/* Bottom Bar: Copyright & Portfolio Link */}
            <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-500 text-sm">
                PreciosGas &copy; {new Date().getFullYear()} - Optimizado para tu bolsillo.
              </p>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <span>Creado por</span>
                <a 
                  href="https://rgardel.es" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold text-slate-800 hover:text-emerald-600 transition-colors inline-flex items-center gap-0.5 border-b border-transparent hover:border-emerald-600"
                >
                  Roberto García Delgado <span className="text-emerald-500 font-normal hover:text-emerald-400 transition-colors">(rgardel.es)</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
