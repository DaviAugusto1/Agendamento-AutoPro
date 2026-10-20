export const REASON_LABELS = {
  Orçamento: 'Orçamento',
  Reparo: 'Reparo',
  'Retorno de Garantia': 'Retorno de Garantia',
  'Vistoria Seguradora': 'Vistoria Seguradora',
} as const;

export type ReasonKey = keyof typeof REASON_LABELS;

export const REASON_COLORS: Record<ReasonKey, string> = {
  Orçamento: '#3b82f6',
  Reparo: '#22c55e',
  'Retorno de Garantia': '#eab308',
  'Vistoria Seguradora': '#a855f7',
};

export const SERVICES = [
  'Pintura e(ou) Funilaria',
  'Martelinho de ouro',
  'Polimento Geral',
] as const;
