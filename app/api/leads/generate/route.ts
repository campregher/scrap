import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

const bodySchema = z.object({
  leadId: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(30).default(10)
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

  let query = supabaseAdmin
    .from('leads')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'novo')
    .limit(parsed.data.limit);

  if (parsed.data.leadId) query = query.eq('id', parsed.data.leadId);

  const { data: leads, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!leads?.length) return NextResponse.json({ processed: 0, message: 'Nenhum lead novo.' });

  const updates = [];

  for (const lead of leads) {
    await supabaseAdmin.from('leads').update({ status: 'gerando' }).eq('id', lead.id);

    const prompt = `Gere uma mensagem curta de prospecção comercial via WhatsApp para a empresa ${lead.empresa}, localizada em ${lead.cidade ?? 'cidade não informada'} - ${lead.estado ?? 'UF não informada'}, que atua no ramo ${lead.categoria ?? 'não informado'}. Seja profissional, natural e inclua uma chamada para ação no final. Máximo 500 caracteres.`;

    try {
      const completion = await openai.responses.create({
        model: 'gpt-4.1-mini',
        input: prompt
      });

      const text = completion.output_text?.slice(0, 500) || '';

      const { error: updateError } = await supabaseAdmin
        .from('leads')
        .update({ mensagem_gerada: text, status: 'pronto' })
        .eq('id', lead.id);

      if (updateError) throw updateError;
      updates.push({ id: lead.id, status: 'pronto' });
    } catch (generateError) {
      await supabaseAdmin
        .from('leads')
        .update({ status: 'erro', response_evolution: { etapa: 'geracao', erro: String(generateError) } })
        .eq('id', lead.id);
      updates.push({ id: lead.id, status: 'erro' });
    }
  }

  return NextResponse.json({ processed: updates.length, updates });
}
