"""Testes técnicos locais sem carregar o dataset original WESAD."""
from pathlib import Path
import os
import numpy as np
import pandas as pd
import pytest
from fastapi.testclient import TestClient

from limiar_inferencia import carregar_bundle, inferir_features, inferir_sensores, marcar_sequencias
from api_limiar import app, get_modelo

BASE=Path(__file__).resolve().parents[1]
MODEL=BASE/'modelos/LIMIAR_N9_Random_Forest_experimental.joblib'
LR=BASE/'modelos/LIMIAR_N9_Regressao_Logistica_experimental.joblib'

@pytest.mark.parametrize('model_path',[MODEL,LR])
def test_bundle_features(model_path):
    b=carregar_bundle(model_path)  # Confie apenas nos bundles desta equipe.
    assert b['features']==['EDA_std','ACC_max','ACC_std','EDA_max']
    x=pd.DataFrame([{'EDA_std':.1,'ACC_max':64.,'ACC_std':3.,'EDA_max':1.7}])
    out=inferir_features(b,x)
    assert len(out)==1
    assert 0 <= float(out.score_modelo.iloc[0]) <= 1

@pytest.mark.parametrize('model_path',[MODEL,LR])
def test_sensores_sinteticos(model_path):
    b=carregar_bundle(model_path)
    eda=np.linspace(1,2,120)
    acc=np.tile([0.,0.,64.],(960,1))
    out=inferir_sensores(b,eda,acc)
    assert set(out['features_utilizadas'])==set(b['features'])

def test_api_local(monkeypatch):
    monkeypatch.setenv('LIMIAR_MODEL_PATH',str(MODEL))
    get_modelo.cache_clear()
    with TestClient(app) as client:
        assert client.get('/health').status_code==200
        r=client.post('/v1/predicao/features',json={'caracteristicas':{
            'EDA_std':0.1116,'ACC_max':141.665,'ACC_std':5.354,'EDA_max':1.311}})
        assert r.status_code==200
        assert client.post('/v1/predicao/features',json={'caracteristicas':{'EDA_std':.1}}).status_code==422
    get_modelo.cache_clear()

def test_sequencia_temporal():
    data=pd.DataFrame({'participante':['S2']*4,'inicio_s':[0,15,30,90],
                       'indicador_experimental':[1,1,1,1]})
    out=marcar_sequencias(data)
    assert out['janelas_consecutivas'].tolist()==[1,2,3,1]
