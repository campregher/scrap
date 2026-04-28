import Link from 'next/link';
import { Instagram, Youtube } from 'lucide-react';
import { site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="container-width grid gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-xl font-black">PH Representante</h2>
          <p className="mt-2 text-sm text-zinc-300">Conectando marcas ao mercado com eficiência e foco em resultado.</p>
        </div>
        <div>
          <h3 className="font-semibold">Contato</h3>
          <p className="mt-2 text-sm text-zinc-300">{site.phoneDisplay}</p>
          <p className="text-sm text-zinc-300">{site.email}</p>
        </div>
        <div>
          <h3 className="font-semibold">Redes Sociais</h3>
          <div className="mt-3 flex gap-3">
            <Link href={site.social.instagram} target="_blank" aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-brand-red">
              <Instagram size={18} />
            </Link>
            <Link href={site.social.youtube} target="_blank" aria-label="YouTube" className="rounded-full bg-white/10 p-2 hover:bg-brand-red">
              <Youtube size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
