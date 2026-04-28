import Link from 'next/link';
import { makeMetadata } from '@/lib/metadata';
import { SectionTitle } from '@/components/section-title';

export const metadata = makeMetadata(
  'Dropshipping',
  'Comece no dropshipping com fornecedores confiáveis e operação escalável.',
  '/dropshipping'
);

export default function DropshippingPage() {
  return (
    <section className="section-padding bg-zinc-900 text-white">
      <div className="container-width">
        <SectionTitle title="Dropshipping" subtitle="Venda mais sem estoque com uma operação digital ágil." />
        <p className="max-w-3xl text-zinc-300">Com a PH Representante, você acessa fornecedores e produtos validados para iniciar ou escalar seu canal de vendas com segurança.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {['Sem estoque', 'Escalabilidade comercial', 'Facilidade de operação'].map((benefit) => (
            <div key={benefit} className="rounded-xl border border-white/20 bg-white/5 p-5 font-semibold">{benefit}</div>
          ))}
        </div>
        <Link href="/contato" className="mt-10 inline-block rounded-lg bg-brand-red px-8 py-3 font-bold text-white transition hover:scale-105 hover:bg-red-700">Quero começar</Link>
      </div>
    </section>
  );
}
