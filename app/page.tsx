import { DashboardActions } from '@/components/dashboard-actions';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: leads } = await supabase
    .from('leads')
    .select('id, empresa, telefone, cidade, estado, categoria, status, mensagem_gerada, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  const totals = (leads ?? []).reduce(
    (acc, lead) => {
      acc.total += 1;
      acc[lead.status] += 1;
      return acc;
    },
    { total: 0, novo: 0, pronto: 0, enviado: 0, erro: 0, gerando: 0 } as Record<string, number>
  );

  const successRate = totals.total ? Math.round((totals.enviado / totals.total) * 100) : 0;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-3xl font-bold">SaaS de Prospecção WhatsApp</h1>
        <p className="text-sm text-slate-400">Leads no Supabase, IA no OpenAI e envio via Evolution API.</p>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-6">
        {[
          ['Total', totals.total],
          ['Novos', totals.novo],
          ['Prontos', totals.pronto],
          ['Enviados', totals.enviado],
          ['Erros', totals.erro],
          ['Taxa sucesso', `${successRate}%`]
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <DashboardActions />

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="mb-4 text-lg font-semibold">Leads recentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-2">Empresa</th>
                <th className="pb-2">Telefone</th>
                <th className="pb-2">Cidade/UF</th>
                <th className="pb-2">Categoria</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(leads ?? []).map((lead) => (
                <tr key={lead.id} className="border-t border-slate-800">
                  <td className="py-2">{lead.empresa}</td>
                  <td className="py-2">{lead.telefone}</td>
                  <td className="py-2">{lead.cidade}/{lead.estado}</td>
                  <td className="py-2">{lead.categoria}</td>
                  <td className="py-2">{lead.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
