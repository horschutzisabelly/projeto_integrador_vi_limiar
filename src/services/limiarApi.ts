import type {ResultadoLimiar} from '../types/analiseIA';

export type SaudeLimiar = {
  status: string;
  algoritmo: string;
  features: string[];
  aviso: string;
};

export type JanelaSensores = {
  eda: number[];
  acc: number[][];
  unidades_eda: 'WESAD_ORIGINAL';
  unidades_acc: 'WESAD_ORIGINAL';
};

// Expo substitui esta referencia estatica pelo valor do .env.local.
// O endereco deve apontar para o computador que esta executando a API.
const API_URL = (process.env.EXPO_PUBLIC_LIMIAR_API_URL ?? '')
  .trim()
  .replace(/\/+$/, '');

const TIMEOUT_MS = 12000;

export function obterUrlAPI(): string {
  return API_URL;
}

async function requisicao<T>(caminho: string, dados?: unknown): Promise<T> {
  if (!API_URL || !/^https?:\/\//.test(API_URL)) {
    throw new Error(
      'Configure EXPO_PUBLIC_LIMIAR_API_URL no arquivo .env.local do aplicativo.',
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const resposta = await fetch(`${API_URL}${caminho}`, {
      method: dados === undefined ? 'GET' : 'POST',
      headers: {'Content-Type': 'application/json'},
      body: dados === undefined ? undefined : JSON.stringify(dados),
      signal: controller.signal,
    });

    let corpo: unknown;
    try {
      corpo = await resposta.json();
    } catch {
      throw new Error('A API respondeu com um formato inesperado.');
    }

    if (!resposta.ok) {
      const detalhe = (
        corpo && typeof corpo === 'object' && 'detail' in corpo
          ? (corpo as {detail: unknown}).detail
          : undefined
      );
      throw new Error(
        `Erro ${resposta.status} na API: ${
          typeof detalhe === 'string' ? detalhe : 'verifique o servidor e o modelo'
        }`,
      );
    }
    return corpo as T;
  } catch (erro) {
    if (controller.signal.aborted) {
      throw new Error('A API demorou para responder. Verifique a rede e o servidor.');
    }
    if (erro instanceof TypeError) {
      throw new Error(
        'Não foi possível conectar à API. Confira o IP, a mesma rede Wi-Fi e a porta 8000.',
      );
    }
    throw erro;
  } finally {
    clearTimeout(timer);
  }
}

function validarResultado(valor: ResultadoLimiar): ResultadoLimiar {
  if (
    !valor ||
    typeof valor.score_modelo !== 'number' ||
    !Number.isFinite(valor.score_modelo) ||
    typeof valor.limiar !== 'number' ||
    !Number.isFinite(valor.limiar) ||
    (valor.indicador_experimental !== 0 && valor.indicador_experimental !== 1) ||
    typeof valor.interpretacao !== 'string'
  ) {
    throw new Error('A API retornou uma previsão fora do formato esperado.');
  }
  return valor;
}

export function verificarAPI(): Promise<SaudeLimiar> {
  return requisicao<SaudeLimiar>('/health');
}

export async function analisarFeatures(
  caracteristicas: Record<string, number>,
): Promise<ResultadoLimiar> {
  return validarResultado(
    await requisicao<ResultadoLimiar>('/v1/predicao/features', {caracteristicas}),
  );
}

export async function analisarSensores(
  janela: JanelaSensores,
): Promise<ResultadoLimiar> {
  return validarResultado(
    await requisicao<ResultadoLimiar>('/v1/predicao/sensores', janela),
  );
}
