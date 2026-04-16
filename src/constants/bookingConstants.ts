export const REASON_LABELS = {
  Orçamento: 'Orçamento',
  Reparo: 'Reparo',
  Retorno: 'Retorno',
} as const;

export type ReasonKey = keyof typeof REASON_LABELS;

export const REASON_COLORS: Record<ReasonKey, string> = {
  Orçamento: '#3b82f6',
  Reparo: '#22c55e',
  Retorno: '#eab308',
};

export const SERVICES = [
  'Pintura e(ou) Funilaria',
  'Martelinho de ouro'
] as const;
