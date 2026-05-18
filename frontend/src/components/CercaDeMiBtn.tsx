'use client';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CercaDeMiBtn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          router.push(`/cerca-de-mi?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);
          setLoading(false);
        },
        (err) => {
          alert('No pudimos acceder a tu ubicación. Por favor permite el acceso en tu navegador.');
          setLoading(false);
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización.');
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleClick} 
      disabled={loading}
      className="text-slate-600 hover:text-emerald-600 font-medium transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
    >
      <MapPin size={18} />
      {loading ? 'Ubicando...' : 'Cerca de mi'}
    </button>
  );
}
