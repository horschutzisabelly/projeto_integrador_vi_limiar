"""Verificacao ponta a ponta HTTP da API com um modelo da equipe.

Executar no diretorio ml/: python -m pytest tests/test_integracao_api.py -q
Os dados da requisicao sao inteiramente artificiais.
"""
import os
from pathlib import Path

from fastapi.testclient import TestClient

from api_limiar import app, get_modelo


MODELO = Path(__file__).parents[1] / 'modelos' / 'LIMIAR_N9_Random_Forest_experimental.joblib'


def test_contrato_http_modelo_real(monkeypatch):
    assert MODELO.is_file(), 'Modelo N9 ausente. Inclua a pasta ml/modelos no checkout.'
    monkeypatch.setenv('LIMIAR_MODEL_PATH', str(MODELO))
    get_modelo.cache_clear()
    client = TestClient(app)
    try:
        health = client.get('/health')
        assert health.status_code == 200, health.text
        corpo = health.json()
        assert corpo['status'] == 'ok'
        assert corpo['algoritmo'] == 'Random_Forest'
        assert set(corpo['features']) == {'EDA_std', 'ACC_max', 'ACC_std', 'EDA_max'}

        exemplos = [
            {'EDA_std': 0.01, 'ACC_max': 76.32, 'ACC_std': 1.47, 'EDA_max': 0.42},
            {'EDA_std': 0.2, 'ACC_max': 135, 'ACC_std': 5, 'EDA_max': 4},
        ]
        for exemplo in exemplos:
            resposta = client.post('/v1/predicao/features', json={'caracteristicas': exemplo})
            assert resposta.status_code == 200, resposta.text
            payload = resposta.json()
            assert 0 <= payload['score_modelo'] <= 1
            assert 0 <= payload['limiar'] <= 1
            assert payload['indicador_experimental'] in (0, 1)

        resposta = client.post('/v1/predicao/sensores', json={
            'eda': [1.1] * 120,
            'acc': [[64.0, 0.0, 0.0]] * 960,
            'unidades_eda': 'WESAD_ORIGINAL',
            'unidades_acc': 'WESAD_ORIGINAL',
        })
        assert resposta.status_code == 200, resposta.text
        assert 'features_utilizadas' in resposta.json()
    finally:
        get_modelo.cache_clear()
