import { ContactForm } from '@/components/contact-form';
import { SectionTitle } from '@/components/section-title';
import { makeMetadata } from '@/lib/metadata';

export const metadata = makeMetadata(
  'Contato',
  'Solicite proposta de representação comercial, atacado ou dropshipping com a PH Representante.',
  '/contato'
);

export default function ContatoPage() {
  return (
    <section className="section-padding bg-zinc-50">
      <div className="container-width">
        <SectionTitle title="Contato" subtitle="Preencha o formulário para qualificar seu atendimento e receber uma proposta personalizada." />
        <ContactForm />
      </div>
    </section>
  );
}
