import Link from 'next/link';
import { SectionTitle } from '@/components/section-title';
import { makeMetadata } from '@/lib/metadata';

export const metadata = makeMetadata(
  'Atacado',
  'Modelo de distribuição em atacado com preço competitivo e logística eficiente.',
  '/atacado'
);

export default function AtacadoPage() {
  return (
    <section className="section-padding">
      <div className="container-width">
        <SectionTitle title="Atacado" subtitle="Abastecimento inteligente para lojistas, distribuidores e revendedores." />
        <p className="max-w-3xl text-zinc-700">A operação de atacado da PH Representante oferece negociação direta, mix estratégico e suporte comercial para ampliar margem e frequência de compra.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {['Preço competitivo', 'Compra em volume', 'Logística eficiente'].map((item) => (
            <div key={item} className="rounded-xl border border-zinc-200 bg-white p-5 font-semibold shadow-sm">{item}</div>
          ))}
        </div>
        <Link href="/contato" className="mt-8 inline-block rounded-lg bg-brand-red px-6 py-3 font-semibold text-white hover:bg-red-700">Solicitar condições de atacado</Link>
      </div>
    </section>
  );
}
