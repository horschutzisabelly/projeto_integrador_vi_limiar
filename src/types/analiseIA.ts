// Dados exibidos apenas para demonstração acadêmica. Não representam diagnóstico.
export type OrigemAnaliseIA = 'features' | 'sensores';

export type ResultadoLimiar = {
  score_modelo: number;
  limiar: number;
  indicador_experimental: 0 | 1;
  interpretacao: string;
  aviso: string;
  features_utilizadas?: Record<string, number>;
};

export type RegistroAnaliseIA = {
  id: string;
  dataHora: string;
  exemplo: string;
  origem: OrigemAnaliseIA;
  resultado: ResultadoLimiar;
};
