import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { site } from '@/lib/site';

export function WhatsappFloat() {
  const href = `https://wa.me/${site.phoneRaw}?text=${encodeURIComponent(site.whatsappText)}`;

  return (
    <Link
      href={href}
      target="_blank"
      aria-label="Abrir WhatsApp"
      className="fixed bottom-5 right-5 z-50 rounded-full bg-green-500 p-4 text-white shadow-soft transition hover:scale-105 hover:bg-green-600"
    >
      <MessageCircle />
    </Link>
  );
}
