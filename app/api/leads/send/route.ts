import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { checkDailyLimit, randomDelayMs, sleep } from '@/lib/rate-limit';
import { normalizePhone } from '@/lib/phone';

const bodySchema = z.object({
  leadId: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(30).default(10)
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('daily_limit, evolution_url, evolution_api_key, evolution_instance')
    .eq('id', user.id)
    .single();

  let query = supabaseAdmin
    .from('leads')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'pronto')
    .limit(parsed.data.limit)
    .order('created_at', { ascending: true });

  if (parsed.data.leadId) query = query.eq('id', parsed.data.leadId);

  const { data: leads, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!leads?.length) return NextResponse.json({ processed: 0, message: 'Nenhum lead pronto.' });

  const dailyLimit = profile?.daily_limit ?? 200;
  const output = [];

  for (const lead of leads) {
    const limit = checkDailyLimit(`send:${user.id}`, dailyLimit);
    if (!limit.ok) {
      output.push({ id: lead.id, status: 'erro', reason: 'Limite diário atingido' });
      break;
    }

    const url = profile?.evolution_url ?? process.env.EVOLUTION_URL;
    const apikey = profile?.evolution_api_key ?? process.env.EVOLUTION_API_KEY;
    const instance = profile?.evolution_instance ?? process.env.EVOLUTION_INSTANCE;

    if (!url || !apikey || !instance) {
      return NextResponse.json({ error: 'Credenciais Evolution não configuradas.' }, { status: 400 });
    }

    try {
      const number = normalizePhone(lead.telefone);
      const response = await fetch(`${url}/message/sendText/${instance}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey
        },
        body: JSON.stringify({ number, text: lead.mensagem_gerada })
      });

      const responseJson = await response.json().catch(() => ({}));

      const status = response.ok ? 'enviado' : 'erro';
      await supabaseAdmin
        .from('leads')
        .update({ status, response_evolution: responseJson })
        .eq('id', lead.id);

      output.push({ id: lead.id, status });
      await sleep(randomDelayMs(3, 5));
    } catch (sendError) {
      await supabaseAdmin
        .from('leads')
        .update({ status: 'erro', response_evolution: { etapa: 'envio', erro: String(sendError) } })
        .eq('id', lead.id);

      output.push({ id: lead.id, status: 'erro' });
    }
  }

  return NextResponse.json({ processed: output.length, output });
}
