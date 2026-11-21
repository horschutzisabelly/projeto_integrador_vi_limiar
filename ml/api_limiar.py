"""API experimental do LIMIAR: executar localmente com uvicorn api_limiar:app.

Necessário apontar LIMIAR_MODEL_PATH para .joblib confiável da equipe.
Nenhum endpoint representa diagnóstico, recomendação de saúde ou alerta clínico.
"""
import os
from functools import lru_cache
from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from limiar_inferencia import AVISO, carregar_bundle, inferir_features, inferir_sensores
import pandas as pd

app = FastAPI(title='LIMIAR — API experimental WESAD', version='0.1.0')

@lru_cache(maxsize=1)
def get_modelo():
    path = os.getenv('LIMIAR_MODEL_PATH')
    if not path:
        raise RuntimeError('Defina LIMIAR_MODEL_PATH com um modelo confiável da equipe.')
    return carregar_bundle(path)

class FeatureRequest(BaseModel):
    caracteristicas: dict[str, float]

class SensorRequest(BaseModel):
    eda: list[float] = Field(min_length=120, max_length=120)
    acc: list[list[float]] = Field(min_length=960, max_length=960)
    unidades_eda: Literal['WESAD_ORIGINAL']
    unidades_acc: Literal['WESAD_ORIGINAL']

@app.get('/health')
def health():
    try:
        b = get_modelo()
        return {'status':'ok', 'algoritmo':b['algoritmo'], 'features':b['features'], 'aviso':AVISO}
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc))

@app.post('/v1/predicao/features')
def predicao_features(body: FeatureRequest):
    try:
        row = inferir_features(get_modelo(), pd.DataFrame([body.caracteristicas])).iloc[0]
        return {'score_modelo':float(row['score_modelo']),
                'limiar':float(row['limiar']),
                'indicador_experimental':int(row['indicador_experimental']),
                'interpretacao':str(row['interpretacao']), 'aviso':AVISO}
    except (ValueError, TypeError) as exc:
        raise HTTPException(status_code=422, detail=str(exc))

@app.post('/v1/predicao/sensores')
def predicao_sensores(body: SensorRequest):
    try:
        return inferir_sensores(get_modelo(), body.eda, body.acc,
                                unidades_eda=body.unidades_eda,
                                unidades_acc=body.unidades_acc)
    except (ValueError, TypeError) as exc:
        raise HTTPException(status_code=422, detail=str(exc))
