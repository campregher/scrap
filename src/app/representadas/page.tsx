import Image from 'next/image';
import { SectionTitle } from '@/components/section-title';
import { makeMetadata } from '@/lib/metadata';

export const metadata = makeMetadata(
  'Representadas',
  'Conheça as marcas representadas pela PH Representante e seus segmentos.',
  '/representadas'
);

const representedBrands = [
  { nome: 'Auto Prime', descricao: 'Linha de acessórios e químicos automotivos de alta performance.', categoria: 'Automotivo' },
  { nome: 'MaxDrive', descricao: 'Componentes e soluções para manutenção rápida.', categoria: 'Automotivo' },
  { nome: 'Urban Utilidades', descricao: 'Produtos para casa e organização de alto giro.', categoria: 'Utilidades' },
  { nome: 'Sigma Tools', descricao: 'Ferramentas para profissionais e varejo especializado.', categoria: 'Ferramentas' }
];

export default function RepresentadasPage() {
  return (
    <section className="section-padding bg-zinc-50">
      <div className="container-width">
        <SectionTitle title="Marcas Representadas" subtitle="Portfólio diversificado para atender diferentes perfis de revenda." />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {representedBrands.map((brand) => (
            <article key={brand.nome} className="overflow-hidden rounded-2xl bg-white shadow-soft">
              <Image
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80"
                alt={`Imagem ilustrativa da marca ${brand.nome}`}
                width={600}
                height={320}
                loading="lazy"
                className="h-44 w-full object-cover"
              />
              <div className="space-y-2 p-5">
                <h3 className="text-lg font-bold">{brand.nome}</h3>
                <p className="text-sm text-zinc-600">{brand.descricao}</p>
                <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-brand-red">{brand.categoria}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
