import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });

  const phone = payload?.data?.key?.remoteJid?.replace('@s.whatsapp.net', '') || payload?.phone;
  const statusEvent = payload?.event || payload?.status;

  if (!phone || !statusEvent) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const mappedStatus = statusEvent === 'messages.upsert' ? 'enviado' : statusEvent;

  const { error } = await supabaseAdmin
    .from('leads')
    .update({ response_evolution: payload, updated_at: new Date().toISOString() })
    .ilike('telefone', `%${phone.slice(-8)}`)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, status: mappedStatus });
}
