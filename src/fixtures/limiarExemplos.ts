import type {JanelaSensores} from '../services/limiarApi';

// Valores inteiramente artificiais para demonstrar a comunicacao com o modelo.
// Nao provem de um participante e nao possuem valor clinico.
export const EXEMPLOS_FEATURES = {
  referencia: {
    EDA_std: 0.01,
    ACC_max: 76.32,
    ACC_std: 1.47,
    EDA_max: 0.42,
  },
  variacao: {
    EDA_std: 0.2,
    ACC_max: 135,
    ACC_std: 5,
    EDA_max: 4,
  },
};

// 30 segundos de sinais artificiais na escala numerica ilustrativa WESAD:
// EDA: 4 Hz * 30 s = 120 amostras
// ACC tri-axial: 32 Hz * 30 s = 960 amostras de 3 eixos
// O formato e compativel com a API, mas isto NAO valida sensores fisicos.
export function criarJanelaArtificial(): JanelaSensores {
  const eda = Array.from({length: 120}, (_, i) =>
    1.1 + 0.08 * Math.sin((2 * Math.PI * i) / 60),
  );
  const acc = Array.from({length: 960}, (_, i) => [
    64 + 8 * Math.sin((2 * Math.PI * i) / 180),
    8 * Math.cos((2 * Math.PI * i) / 85),
    4 * Math.sin((2 * Math.PI * i) / 140),
  ]);
  return {
    eda,
    acc,
    unidades_eda: 'WESAD_ORIGINAL',
    unidades_acc: 'WESAD_ORIGINAL',
  };
}
