'use client';

import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email });
    setMessage(error ? error.message : 'Link mágico enviado para seu e-mail.');
  };

  return (
    <main className="mx-auto mt-24 max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8">
      <h1 className="mb-4 text-2xl font-semibold">Entrar</h1>
      <p className="mb-6 text-sm text-slate-400">Autenticação via Supabase Auth (magic link).</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 p-3"
          placeholder="voce@empresa.com"
        />
        <button className="w-full rounded-md bg-brand p-3 font-medium">Enviar link de acesso</button>
      </form>
      {message && <p className="mt-4 text-sm text-slate-300">{message}</p>}
    </main>
  );
}
