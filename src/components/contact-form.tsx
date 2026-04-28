'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  nomeCompleto: z.string().min(3, 'Informe seu nome completo'),
  nomeEmpresa: z.string().min(2, 'Informe o nome da empresa'),
  whatsapp: z.string().min(10, 'Informe um WhatsApp válido'),
  email: z.string().email('Informe um email válido'),
  tipoInteresse: z.enum(['Representação', 'Atacado', 'Dropshipping']),
  faturamentoMensal: z.enum(['Até 10k', '10k–50k', '50k+']),
  cidadeEstado: z.string().min(3, 'Informe cidade e estado'),
  mensagem: z.string().min(10, 'Descreva sua necessidade')
});

type FormData = z.infer<typeof schema>;

const baseInput = 'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-brand-red transition focus:ring-2';

export function ContactForm() {
  const [status, setStatus] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setStatus('Enviando...');
    await new Promise((resolve) => setTimeout(resolve, 900));
    console.log('lead payload', data);
    setStatus('Solicitação enviada com sucesso! Em breve entraremos em contato.');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-2xl bg-white p-6 shadow-soft">
      <div>
        <label className="mb-1 block text-sm font-semibold">Nome completo</label>
        <input {...register('nomeCompleto')} className={baseInput} />
        {errors.nomeCompleto && <p className="text-xs text-red-600">{errors.nomeCompleto.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">Nome da empresa</label>
        <input {...register('nomeEmpresa')} className={baseInput} />
        {errors.nomeEmpresa && <p className="text-xs text-red-600">{errors.nomeEmpresa.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold">WhatsApp</label>
          <input {...register('whatsapp')} className={baseInput} />
          {errors.whatsapp && <p className="text-xs text-red-600">{errors.whatsapp.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Email</label>
          <input type="email" {...register('email')} className={baseInput} />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold">Tipo de interesse</label>
          <select {...register('tipoInteresse')} className={baseInput}>
            <option value="Representação">Representação</option>
            <option value="Atacado">Atacado</option>
            <option value="Dropshipping">Dropshipping</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Faturamento mensal</label>
          <select {...register('faturamentoMensal')} className={baseInput}>
            <option value="Até 10k">Até 10k</option>
            <option value="10k–50k">10k–50k</option>
            <option value="50k+">50k+</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">Cidade/Estado</label>
        <input {...register('cidadeEstado')} className={baseInput} />
        {errors.cidadeEstado && <p className="text-xs text-red-600">{errors.cidadeEstado.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">Mensagem</label>
        <textarea rows={4} {...register('mensagem')} className={baseInput} />
        {errors.mensagem && <p className="text-xs text-red-600">{errors.mensagem.message}</p>}
      </div>
      <button disabled={isSubmitting} className="rounded-lg bg-brand-red px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-70">
        {isSubmitting ? 'Enviando...' : 'Enviar contato'}
      </button>
      {status && <p className="text-sm font-medium text-zinc-700">{status}</p>}
    </form>
  );
}
