'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Home, MapPin, TrendingDown } from 'lucide-react';

export default function MobileHamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [locating, setLocating] = useState(false);

  const handleCercaDeMi = () => {
    setIsOpen(false);
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          router.push(`/cerca-de-mi?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);
          setLocating(false);
        },
        (err) => {
          alert('No pudimos acceder a tu ubicación. Permite el acceso en tu navegador.');
          setLocating(false);
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización.');
      setLocating(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="md:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-800 hover:text-emerald-600 transition-colors"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-xl flex flex-col p-4 gap-2 animate-fade-in-up z-50">
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
              isActive('/') ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Home size={22} />
            <span className="text-base">Inicio</span>
          </Link>

          <button 
            onClick={handleCercaDeMi}
            disabled={locating}
            className={`flex items-center gap-3 p-4 rounded-xl transition-colors text-left w-full disabled:opacity-50 ${
              pathname.includes('/cerca-de-mi') ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MapPin size={22} className={locating ? 'animate-bounce text-emerald-500' : ''} />
            <span className="text-base">{locating ? 'Ubicando...' : 'Cerca de mí'}</span>
          </button>

          <Link 
            href="/provincias" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
              isActive('/provincias') ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <TrendingDown size={22} />
            <span className="text-base">Provincias y Gasolineras Baratas</span>
          </Link>
        </div>
      )}
    </div>
  );
}
