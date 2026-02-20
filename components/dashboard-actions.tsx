'use client';

import { useState } from 'react';

export function DashboardActions() {
  const [log, setLog] = useState<string>('');

  async function callApi(path: string) {
    setLog('Processando...');
    const response = await fetch(path, { method: 'POST', body: JSON.stringify({ limit: 10 }) });
    const data = await response.json();
    setLog(JSON.stringify(data, null, 2));
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="mb-4 text-lg font-semibold">Automação</h2>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => callApi('/api/leads/generate')}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium"
        >
          Gerar Mensagens
        </button>
        <button
          onClick={() => callApi('/api/leads/send')}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium"
        >
          Enviar Mensagens
        </button>
      </div>
      <pre className="mt-4 max-h-60 overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-300">{log}</pre>
    </section>
  );
}
