'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { site } from '@/lib/site';

const links = [
  { href: '/', label: 'Home' },
  { href: '/quem-somos', label: 'Quem Somos' },
  { href: '/representadas', label: 'Representadas' },
  { href: '/atacado', label: 'Atacado' },
  { href: '/dropshipping', label: 'Dropshipping', highlight: true },
  { href: '/contato', label: 'Contato' }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? 'bg-white/95 shadow-soft backdrop-blur' : 'bg-white'}`}>
      <nav className="container-width flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Navegação principal">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-brand-dark">
          <Image src="/logo-placeholder.svg" alt="Logo PH Representante" width={140} height={35} className="h-8 w-auto" />
        </Link>

        <button className="rounded-md p-2 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Abrir menu">
          {open ? <X /> : <Menu />}
        </button>

        <ul className="hidden items-center gap-4 md:flex">
          {links.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition hover:text-brand-red ${item.highlight ? 'bg-brand-red text-white hover:bg-red-700 hover:text-white' : 'text-brand-dark'}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden text-right text-xs font-medium text-zinc-700 lg:block">
          <p>{site.phoneDisplay}</p>
          <p>{site.email}</p>
        </div>
      </nav>

      {open && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1 border-t bg-white px-4 py-3 md:hidden"
        >
          {links.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`block rounded-md px-3 py-2 text-sm font-semibold ${item.highlight ? 'bg-brand-red text-white' : 'text-brand-dark'}`} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            </li>
          ))}
          <li className="pt-2 text-xs text-zinc-600">
            <p>{site.phoneDisplay}</p>
            <p>{site.email}</p>
          </li>
        </motion.ul>
      )}
    </header>
  );
}
