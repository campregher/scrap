export type LeadStatus = 'novo' | 'gerando' | 'pronto' | 'enviado' | 'erro';

export type Lead = {
  id: string;
  user_id: string;
  empresa: string;
  telefone: string;
  cidade: string | null;
  estado: string | null;
  categoria: string | null;
  instagram: string | null;
  site: string | null;
  mensagem_gerada: string | null;
  status: LeadStatus;
  response_evolution: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};
