'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function BrandLogo({ inFooter = false }: { inFooter?: boolean }) {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (inFooter) {
    return (
      <Link href="/" onClick={handleClick} className="flex items-center gap-3 mb-4 group cursor-pointer">
        <Image src="/logo.png" alt="PreciosGas Logo" width={150} height={150} className="w-20 h-20 md:w-24 md:h-24 object-contain scale-125 md:scale-150 origin-left group-hover:scale-[1.3] md:group-hover:scale-[1.55] transition-transform" />
        <span className="font-outfit font-bold text-xl tracking-tight text-slate-900 group-hover:opacity-80 transition-opacity">
          Precio<span className="text-emerald-600">Gas</span>
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" onClick={handleClick} className="flex items-center group transition-transform hover:scale-[1.02] gap-3">
      <Image src="/logo.png" alt="PreciosGas Logo" width={150} height={150} className="w-16 h-16 md:w-20 md:h-20 object-contain scale-[1.35] md:scale-150 origin-center" priority />
      <span className="font-outfit font-bold text-xl md:text-2xl tracking-tight text-slate-900 ml-2">
        Precio<span className="text-emerald-600">Gas</span>
      </span>
    </Link>
  );
}
