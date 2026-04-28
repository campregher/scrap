import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { WhatsappFloat } from '@/components/whatsapp-float';
import { site } from '@/lib/site';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: `${site.name} | Representação Comercial, Atacado e Dropshipping`,
  description:
    'A PH Representante conecta marcas e revendedores com soluções em representação comercial, atacado e dropshipping para acelerar vendas.',
  keywords: site.keywords,
  openGraph: {
    title: `${site.name} | Representação Comercial, Atacado e Dropshipping`,
    description:
      'Conectamos marcas ao mercado com eficiência em representação comercial, atacado e dropshipping.',
    url: site.domain,
    siteName: site.name,
    locale: 'pt_BR',
    type: 'website'
  }
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: site.name,
  url: site.domain,
  telephone: `+55${site.phoneRaw}`,
  email: site.email,
  areaServed: 'Brasil',
  sameAs: [site.social.instagram, site.social.youtube],
  description:
    'Empresa de representação comercial com foco em atacado e dropshipping para indústrias e varejistas.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-20">{children}</main>
        <Footer />
        <WhatsappFloat />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      </body>
    </html>
  );
}
