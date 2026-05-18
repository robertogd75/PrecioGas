'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, MapPin, TrendingDown } from 'lucide-react';
import { useState } from 'react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [locating, setLocating] = useState(false);

  const handleCercaDeMi = () => {
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
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm glass border border-slate-100 rounded-2xl py-3 px-6 flex justify-around items-center">
      <Link 
        href="/" 
        className={`flex flex-col items-center gap-1.5 transition-colors ${
          isActive('/') ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home size={22} className={isActive('/') ? 'scale-110 transition-transform' : ''} />
        <span className="text-[10px] tracking-wide">Inicio</span>
      </Link>

      <button 
        onClick={handleCercaDeMi}
        disabled={locating}
        className={`flex flex-col items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 ${
          pathname.includes('/cerca-de-mi') ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <MapPin size={22} className={`${locating ? 'animate-bounce' : ''} ${pathname.includes('/cerca-de-mi') ? 'scale-110 transition-transform' : ''}`} />
        <span className="text-[10px] tracking-wide">{locating ? 'Ubicando...' : 'Cerca de mí'}</span>
      </button>

      <Link 
        href="/provincias" 
        className={`flex flex-col items-center gap-1.5 transition-colors ${
          isActive('/provincias') ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <TrendingDown size={22} className={isActive('/provincias') ? 'scale-110 transition-transform' : ''} />
        <span className="text-[10px] tracking-wide">Provincias</span>
      </Link>
    </div>
  );
}
