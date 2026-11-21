"""LIMIAR: inferência EXPERIMENTAL (baseline/stress do WESAD).

Não é um detector validado de sobrecarga sensorial, meltdown ou shutdown.
Carregar joblib somente de fontes confiáveis: desserialização executa código.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Mapping, Sequence

import joblib
import numpy as np
import pandas as pd

FS_EDA = 4
FS_ACC = 32
JANELA_S = 30
PASSO_S = 15
AMOSTRAS_EDA = JANELA_S * FS_EDA
AMOSTRAS_ACC = JANELA_S * FS_ACC
FEATURES_PERMITIDAS = {
    'BVP_mean', 'BVP_std', 'BVP_min', 'BVP_max',
    'EDA_mean', 'EDA_std', 'EDA_min', 'EDA_max',
    'ACC_mean', 'ACC_std', 'ACC_max',
}
FEATURES_SENSOR_2 = {
    'EDA_mean', 'EDA_std', 'EDA_min', 'EDA_max',
    'ACC_mean', 'ACC_std', 'ACC_max',
}
AVISO = (
    'Protótipo experimental de identificação de padrões associados a baseline/stress '
    'do WESAD. NÃO validado para sobrecarga sensorial, nem adequado para alertas clínicos.'
)


def carregar_bundle(caminho: str | Path) -> dict[str, Any]:
    """Somente para modelo já treinado e confiável produzido pela equipe."""
    bundle = joblib.load(caminho)
    if not isinstance(bundle, dict):
        raise ValueError('Formato não suportado: esperado bundle com metadados.')
    campos = {'modelo', 'algoritmo', 'features', 'limiar', 'personalizado'}
    if not campos.issubset(bundle):
        raise ValueError(f'Bundle incompleto: {sorted(campos-set(bundle))}')
    features = bundle['features']
    if not isinstance(features, (list, tuple)) or not features or len(features) != len(set(features)):
        raise ValueError('Lista de features ausente, vazia ou duplicada.')
    if not set(features).issubset(FEATURES_PERMITIDAS):
        raise ValueError('Bundle solicita features não reconhecidas.')
    if bundle['personalizado']:
        raise ValueError('Este serviço não suporta modelo personalizado sem protocolo de calibração.')
    modelo = bundle['modelo']
    if not hasattr(modelo, 'predict'):
        raise ValueError('O modelo salvo não possui predict().')
    n = getattr(modelo, 'n_features_in_', None)
    if n is not None and int(n) != len(features):
        raise ValueError('Quantidade de features incompatível com o modelo salvo.')
    if not np.isfinite(float(bundle['limiar'])):
        raise ValueError('Limiar inválido.')
    return bundle


def _validar_frame(frame: pd.DataFrame, features: Sequence[str]) -> pd.DataFrame:
    ausentes = [c for c in features if c not in frame.columns]
    if ausentes:
        raise ValueError(f'Features ausentes: {ausentes}')
    if frame.empty:
        raise ValueError('O dataset está vazio.')
    dados = frame.loc[:, list(features)].apply(pd.to_numeric, errors='raise')
    valores = dados.to_numpy(dtype=float)
    if not np.isfinite(valores).all():
        raise ValueError('Features contêm NaN, infinito ou valores inválidos.')
    return dados.astype(float)


def pontuar(bundle: dict[str, Any], frame: pd.DataFrame) -> np.ndarray:
    features = bundle['features']
    dados = _validar_frame(frame, features)
    nome = bundle['algoritmo']
    if nome.startswith('IF_'):
        return -np.asarray(bundle['modelo'].decision_function(dados.to_numpy()), dtype=float)
    if nome in {'Random_Forest', 'Regressao_Logistica'}:
        return np.asarray(bundle['modelo'].predict_proba(dados.to_numpy())[:, 1], dtype=float)
    raise ValueError(f'Algoritmo não suportado: {nome}')


def inferir_features(bundle: dict[str, Any], frame: pd.DataFrame) -> pd.DataFrame:
    """Aceita features previamente calculadas; ignora completamente qualquer label presente."""
    s = pontuar(bundle, frame)
    limiar = float(bundle['limiar'])
    y = (s > limiar).astype(int)
    resultado = pd.DataFrame({
        'score_modelo': s,
        'limiar': limiar,
        'indicador_experimental': y,
        'interpretacao': np.where(
            y == 1, 'padrao_stress_experimental_WESAD', 'padrao_baseline_experimental_WESAD'
        ),
    }, index=frame.index)
    for coluna in ['participante', 'janela', 'inicio_s', 'fim_s']:
        if coluna in frame.columns:
            resultado.insert(len(resultado.columns), coluna, frame[coluna])
    resultado['uso'] = 'APENAS_PESQUISA'
    return resultado


def extrair_features_janela(eda: Sequence[float], acc: Sequence[Sequence[float]], *,
                             unidades_eda: str = 'WESAD_ORIGINAL',
                             unidades_acc: str = 'WESAD_ORIGINAL') -> dict[str, float]:
    """30 s; EDA 4 Hz (120) e ACC tri-axial 32 Hz (960x3).

    Requer sinais nas mesmas unidades/escala do WESAD original. Não faz conversão
    automática nem resample; usar outra pulseira exige validar essa compatibilidade.
    """
    if unidades_eda != 'WESAD_ORIGINAL' or unidades_acc != 'WESAD_ORIGINAL':
        raise ValueError('Unidades incompatíveis: valide/converta os sensores antes da inferência.')
    e = np.asarray(eda, dtype=float)
    a = np.asarray(acc, dtype=float)
    if e.shape != (AMOSTRAS_EDA,) or a.shape != (AMOSTRAS_ACC, 3):
        raise ValueError(
            f'Esperado EDA ({AMOSTRAS_EDA},) e ACC ({AMOSTRAS_ACC},3); '
            f'recebido EDA {e.shape}, ACC {a.shape}'
        )
    if not np.isfinite(e).all() or not np.isfinite(a).all():
        raise ValueError('Sinais inválidos: NaN/infinito.')
    magnitude = np.sqrt(np.sum(a*a, axis=1))
    return {
        'EDA_mean': float(e.mean()),
        'EDA_std': float(e.std(ddof=0)),
        'EDA_min': float(e.min()),
        'EDA_max': float(e.max()),
        'ACC_mean': float(magnitude.mean()),
        'ACC_std': float(magnitude.std(ddof=0)),
        'ACC_max': float(magnitude.max()),
    }


def inferir_sensores(bundle: dict[str, Any], eda: Sequence[float],
                     acc: Sequence[Sequence[float]], *,
                     unidades_eda: str = 'WESAD_ORIGINAL',
                     unidades_acc: str = 'WESAD_ORIGINAL') -> dict[str, Any]:
    if not set(bundle['features']).issubset(FEATURES_SENSOR_2):
        raise ValueError(
            'O modelo necessita BVP ou de outras features; esta interface usa somente EDA+ACC.'
        )
    f = extrair_features_janela(
        eda, acc, unidades_eda=unidades_eda, unidades_acc=unidades_acc
    )
    r = inferir_features(bundle, pd.DataFrame([f])).iloc[0]
    return {
        'score_modelo': float(r['score_modelo']),
        'limiar': float(r['limiar']),
        'indicador_experimental': int(r['indicador_experimental']),
        'interpretacao': str(r['interpretacao']),
        'features_utilizadas': {k: float(f[k]) for k in bundle['features']},
        'aviso': AVISO,
    }


def marcar_sequencias(resultado: pd.DataFrame, consecutivas: int = 3) -> pd.DataFrame:
    """Marca persistência no replay: somente janelas em ordem e com passo de 15 s.

    Isto não é calibrado/validado para uso clínico; é um recurso de visualização.
    """
    if consecutivas < 1:
        raise ValueError('consecutivas precisa ser >= 1')
    if not {'participante', 'inicio_s', 'indicador_experimental'}.issubset(resultado.columns):
        raise ValueError('O replay precisa de participante, inicio_s e indicador_experimental.')
    d = resultado.copy().sort_values(['participante', 'inicio_s'])
    streak = []
    for _, g in d.groupby('participante', sort=False):
        c = 0
        anterior = None
        for _, r in g.iterrows():
            tempo = float(r['inicio_s'])
            contiguo = anterior is not None and abs(tempo-anterior-PASSO_S) < 1e-6
            if int(r['indicador_experimental']) == 1:
                c = (c + 1) if contiguo else 1
            else:
                c = 0
            streak.append(c)
            anterior = tempo
    d['janelas_consecutivas'] = streak
    d['sequencia_experimental'] = (d['janelas_consecutivas'] >= consecutivas).astype(int)
    return d.sort_index()


def main() -> None:
    parser = argparse.ArgumentParser(description='Replay experimental LIMIAR a partir de features CSV')
    parser.add_argument('--modelo', required=True)
    parser.add_argument('--csv', required=True)
    parser.add_argument('--saida', required=True)
    parser.add_argument('--consecutivas', type=int, default=3)
    args = parser.parse_args()
    bundle = carregar_bundle(args.modelo)
    data = pd.read_csv(args.csv)
    predito = inferir_features(bundle, data)
    if {'participante', 'inicio_s'}.issubset(predito.columns):
        predito = marcar_sequencias(predito, args.consecutivas)
    Path(args.saida).parent.mkdir(parents=True, exist_ok=True)
    predito.to_csv(args.saida, index=False)
    print(json.dumps({'janelas': len(predito), 'arquivo': args.saida,
                      'modelo': bundle['algoritmo'], 'features': bundle['features'],
                      'aviso': AVISO}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
