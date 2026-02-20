# SaaS de Prospecção WhatsApp (Next.js + Supabase + OpenAI + Evolution)

MVP de uma plataforma SaaS para prospecção via WhatsApp sem n8n na automação (n8n apenas grava leads no Supabase).

## Stack

- Next.js 14 (App Router)
- Supabase (Auth + PostgreSQL)
- OpenAI para gerar mensagens personalizadas
- Evolution API para envio no WhatsApp
- TailwindCSS
- Deploy alvo: Vercel

## Fluxo

1. Lead é inserido no Supabase com status `novo`.
2. Endpoint `/api/leads/generate` gera mensagens e atualiza para `pronto`.
3. Endpoint `/api/leads/send` envia para Evolution e marca `enviado` ou `erro`.
4. Dashboard mostra métricas e últimos leads.

## Setup local

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Banco

Execute `supabase/schema.sql` no SQL Editor do Supabase.

## Endpoints principais

- `POST /api/leads/generate` body: `{ "limit": 10 }` ou `{ "leadId": "uuid" }`
- `POST /api/leads/send` body: `{ "limit": 10 }` ou `{ "leadId": "uuid" }`
- `POST /api/evolution/webhook`

## Observações importantes

- `SUPABASE_SERVICE_ROLE_KEY` é usada somente no backend.
- Para multiusuário, cada usuário pode configurar `evolution_url`, `evolution_api_key` e `evolution_instance` na tabela `profiles`.
- Existe limite diário de envios em memória (`daily_limit`) para proteção básica.
- O projeto já inclui delay randômico de 3–5 segundos entre envios.
