import { makeMetadata } from '@/lib/metadata';
import { SectionTitle } from '@/components/section-title';

export const metadata = makeMetadata(
  'Quem Somos',
  'Conheça a história, missão e valores da PH Representante.',
  '/quem-somos'
);

export default function QuemSomosPage() {
  return (
    <section className="section-padding">
      <div className="container-width">
        <SectionTitle title="Quem Somos" subtitle="História sólida e atuação estratégica para gerar valor em cada negociação." />
        <div className="space-y-6 text-zinc-700">
          <p>A PH Representante nasceu para ser ponte entre indústrias e pontos de venda, oferecendo uma representação comercial orientada por resultados.</p>
          <p><strong>Missão:</strong> Conectar marcas e compradores com eficiência, confiança e crescimento sustentável.</p>
          <p><strong>Visão:</strong> Ser referência nacional em representação comercial, atacado e dropshipping.</p>
          <p><strong>Valores:</strong> Transparência, comprometimento, agilidade e foco no cliente.</p>
          <p>Atuamos com forte presença no segmento automotivo e também com oportunidades multissetoriais em utilidades e bens de consumo.</p>
        </div>
      </div>
    </section>
  );
}
