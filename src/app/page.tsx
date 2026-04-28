import Image from 'next/image';
import Link from 'next/link';
import { SectionTitle } from '@/components/section-title';
import { makeMetadata } from '@/lib/metadata';

export const metadata = makeMetadata(
  'Home',
  'PH Representante: representação comercial, atacado e dropshipping com foco em distribuição e geração de vendas.',
  '/'
);

const services = [
  { title: 'Representação Comercial', text: 'Aproximamos sua marca de compradores qualificados com estratégia e relacionamento.' },
  { title: 'Atacado', text: 'Distribuição com condições competitivas, escala e eficiência logística.' },
  { title: 'Dropshipping', text: 'Modelo enxuto para vender sem estoque, com operação simplificada e escalável.' }
];

const brands = ['Auto Prime', 'MaxDrive', 'Sigma Tools', 'Urban Utilidades'];

export default function HomePage() {
  return (
    <>
      <section className="section-padding bg-gradient-to-b from-zinc-100 to-white">
        <div className="container-width grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Image src="/logo-placeholder.svg" alt="Logo PH Representante" width={240} height={60} className="mb-4 h-auto w-48" />
            <p className="mb-3 inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-brand-red">PH Representante</p>
            <h1 className="text-4xl font-black tracking-tight text-brand-dark sm:text-5xl">Conectando marcas ao mercado com eficiência</h1>
            <p className="mt-5 max-w-xl text-zinc-600">Aceleramos vendas e distribuição com representação comercial estratégica, atacado competitivo e operação de dropshipping pronta para escalar.</p>
            <Link href="/contato" className="mt-8 inline-block rounded-lg bg-brand-red px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-red-700">
              Solicitar Proposta
            </Link>
          </div>
          <div className="relative">
            <Image src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80" alt="Equipe comercial analisando estratégias de mercado" width={900} height={600} className="rounded-2xl object-cover shadow-soft" priority />
            <Image src="/mascote-placeholder.svg" alt="Mascote da PH Representante" width={110} height={110} className="absolute -bottom-6 -left-6 hidden rounded-full border-4 border-white bg-white shadow-soft md:block" />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width">
          <SectionTitle title="Serviços" subtitle="Soluções completas para fabricantes, distribuidores e varejistas." />
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="mt-3 text-sm text-zinc-600">{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-zinc-50">
        <div className="container-width">
          <SectionTitle title="Diferenciais" />
          <div className="grid gap-5 md:grid-cols-3">
            {['Confiança no relacionamento', 'Experiência de mercado', 'Agilidade na execução'].map((item) => (
              <div key={item} className="rounded-xl bg-white p-5 font-semibold shadow-sm">{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width">
          <SectionTitle title="Marcas representadas" subtitle="Parcerias fortes com foco em performance comercial." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand) => (
              <div key={brand} className="rounded-xl border border-zinc-200 bg-white p-6 text-center font-semibold">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-dark text-white">
        <div className="container-width">
          <SectionTitle title="Depoimentos" subtitle="Resultados reais de parceiros comerciais." />
          <div className="grid gap-6 md:grid-cols-2">
            <blockquote className="rounded-xl border border-white/20 p-6">“Em poucos meses, ampliamos nossa distribuição nacional com o suporte da PH.”</blockquote>
            <blockquote className="rounded-xl border border-white/20 p-6">“Atendimento ágil, estratégias assertivas e muito foco em vendas.”</blockquote>
          </div>
          <div className="mt-10 text-center">
            <Link href="/contato" className="rounded-lg bg-brand-red px-6 py-3 font-semibold text-white transition hover:bg-red-700">Falar com especialista</Link>
          </div>
        </div>
      </section>
    </>
  );
}
