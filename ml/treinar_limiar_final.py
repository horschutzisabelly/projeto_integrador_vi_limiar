"""LIMIAR | fechamento experimental do treinamento sobre WESAD.

Protocolo: teste Leave-One-Participant-Out, ajuste do limiar em validação
interna GroupKFold, seleção de features APENAS em dados de treino.
Não avalia sobrecarga sensorial, nem fornece diagnóstico.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import platform
import warnings
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

import joblib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import sklearn
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.feature_selection import f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, confusion_matrix, f1_score,
                             precision_score, recall_score, roc_auc_score)
from sklearn.model_selection import GroupKFold, LeaveOneGroupOut
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

SEED = 42
JANELA_S, PASSO_S, CALIBRACAO = 30, 15, 20
FPR_MAX_INTERNO = 0.15  # meta experimental, nunca garantida externamente
FEATURES_CANDIDATAS = [
    'EDA_mean', 'EDA_std', 'EDA_min', 'EDA_max',
    'ACC_mean', 'ACC_std', 'ACC_max',
]
N_FEATURES = 4
MODELOS = ('Random_Forest', 'Regressao_Logistica')
POLITICA_PRIMARIA = {'consecutivas': 3, 'cooldown_s': 300}


def carregar(path):
    bruto = pd.read_csv(path)
    req = ['participante', 'janela', 'inicio_s', 'fim_s', 'label'] + FEATURES_CANDIDATAS
    faltantes = sorted(set(req) - set(bruto.columns))
    if faltantes:
        raise ValueError(f'Colunas ausentes: {faltantes}')
    if bruto[req].isna().any().any() or not np.isfinite(bruto[FEATURES_CANDIDATAS].to_numpy(float)).all():
        raise ValueError('Valores nulos/não-finitos no CSV')
    dados = bruto.loc[bruto.label.isin([1, 2]), req].copy()
    dados = dados.sort_values(['participante', 'inicio_s', 'janela']).reset_index(drop=True)
    if len(dados.participante.unique()) < 5:
        raise ValueError('É necessário ter pelo menos cinco participantes')
    if (dados.fim_s - dados.inicio_s != JANELA_S).any():
        raise ValueError('Duração de janela inesperada')
    dados['y'] = (dados.label == 2).astype(int)
    # Calibração deliberada usa as primeiras 20 janelas baseline de cada pessoa.
    # Todas as janelas sobrepostas a esse trecho ficam FORA da avaliação.
    calib = {}
    for pessoa, bloco in dados.groupby('participante'):
        primeiros = bloco.loc[bloco.y.eq(0)].nsmallest(CALIBRACAO, 'inicio_s')
        if len(primeiros) < CALIBRACAO:
            raise ValueError(f'Participante {pessoa} com baseline insuficiente')
        calib[pessoa] = float(primeiros.fim_s.max())
    dados['avaliavel'] = [t >= calib[p] for p, t in zip(dados.participante, dados.inicio_s)]
    return bruto, dados, calib


def selecionar_features(train):
    # Cada participante e estado contribui uma mediana; sem usar o teste.
    grupos = (train.groupby(['participante', 'y'], as_index=False)[FEATURES_CANDIDATAS]
              .median())
    with warnings.catch_warnings():
        warnings.simplefilter('ignore', RuntimeWarning)
        f, _ = f_classif(grupos[FEATURES_CANDIDATAS], grupos.y)
    f = np.nan_to_num(f, nan=-1, posinf=1e12, neginf=-1)
    ix = sorted(range(len(f)), key=lambda k: (-f[k], k))[:N_FEATURES]
    return [FEATURES_CANDIDATAS[k] for k in ix]


def criar_modelo(nome):
    if nome == 'Random_Forest':
        return RandomForestClassifier(n_estimators=80, min_samples_leaf=2,
                    class_weight='balanced_subsample', max_features='sqrt',
                    random_state=SEED, n_jobs=1)
    if nome == 'Regressao_Logistica':
        return Pipeline([('scaler', StandardScaler()),
            ('clf', LogisticRegression(max_iter=1500, class_weight='balanced',
                                      random_state=SEED))])
    if nome == 'IF_global':
        return Pipeline([('scaler', StandardScaler()),
            ('if', IsolationForest(n_estimators=120, contamination=0.05,
                                  random_state=SEED, n_jobs=2))])
    raise ValueError(nome)


def treinar(nome, frame, features):
    m = criar_modelo(nome)
    frame = frame.loc[frame.y.eq(0)] if nome == 'IF_global' else frame
    m.fit(frame[features].to_numpy(float), frame.y.to_numpy(int)) if nome != 'IF_global' else m.fit(frame[features].to_numpy(float))
    return m


def pontuar(nome, modelo, frame, features):
    X = frame[features].to_numpy(float)
    if nome == 'IF_global':
        return -np.asarray(modelo.decision_function(X), dtype=float)
    return np.asarray(modelo.predict_proba(X)[:, 1], dtype=float)


def escolher_limiar(y, score, nome):
    y = np.asarray(y, dtype=int)
    s = np.asarray(score, dtype=float)
    if nome == 'IF_global':
        grid = np.unique(np.r_[0.0, np.quantile(s, np.linspace(0.05, 0.99, 100))])
    else:
        grid = np.unique(np.r_[0.5, np.linspace(0.05, 0.95, 91),
                                 np.quantile(s, np.linspace(0.02, 0.98, 70))])
    best = None
    for t in grid:
        yp = s > t
        fpr = float(np.mean(yp[y == 0]))
        if fpr > FPR_MAX_INTERNO + 1e-12:
            continue
        f = f1_score(y, yp, zero_division=0)
        r = recall_score(y, yp, zero_division=0)
        key = (f, r, -fpr, -float(t))
        if best is None or key > best[0]:
            best = (key, float(t), fpr)
    if best is None:
        # Em caso extremo, evita classificar todo baseline como positivo.
        return float(np.max(s) + 1e-9)
    return best[1]


def validacao_interna(nome, train):
    inner = GroupKFold(n_splits=3)
    yv, sv = [], []
    for ii, vi in inner.split(train, train.y, groups=train.participante):
        tr = train.iloc[ii]
        val = train.iloc[vi]
        val = val[val.avaliavel]
        feats = selecionar_features(tr)
        modelo = treinar(nome, tr, feats)
        yv.extend(val.y.to_list())
        sv.extend(pontuar(nome, modelo, val, feats))
    return escolher_limiar(yv, sv, nome)


def medidas(y, score, t):
    y = np.asarray(y, dtype=int)
    score = np.asarray(score, dtype=float)
    yp = (score > t).astype(int)
    tn, fp, fn, tp = confusion_matrix(y, yp, labels=[0, 1]).ravel()
    return {'accuracy': accuracy_score(y, yp),
            'precision': precision_score(y, yp, zero_division=0),
            'recall': recall_score(y, yp, zero_division=0),
            'f1': f1_score(y, yp, zero_division=0),
            'fpr_baseline': fp/(fp+tn) if fp+tn else np.nan,
            'auc': roc_auc_score(y, score) if np.unique(y).size == 2 else np.nan,
            'tn': int(tn), 'fp': int(fp), 'fn': int(fn), 'tp': int(tp)}


def validacao_externa(dados):
    logs, predicoes, selecionadas = [], [], []
    outer = LeaveOneGroupOut()
    for i, (ti, vi) in enumerate(outer.split(dados, dados.y, groups=dados.participante), 1):
        treino = dados.iloc[ti]
        teste = dados.iloc[vi]
        teste = teste[teste.avaliavel].copy()
        feats = selecionar_features(treino)
        participante = str(teste.participante.iloc[0])
        print(f'LOPO {i:02d}/15 | teste={participante} | features={feats}', flush=True)
        selecionadas.append({'participante_teste': participante, 'features': ';'.join(feats)})
        for nome in MODELOS:
            th = validacao_interna(nome, treino)
            mod = treinar(nome, treino, feats)
            s = pontuar(nome, mod, teste, feats)
            met = medidas(teste.y, s, th)
            logs.append({'participante': participante, 'modelo': nome,
                         'limiar': th, 'n': len(teste), **met})
            predicoes.append(pd.DataFrame({
                'participante': teste.participante.to_numpy(),
                'janela': teste.janela.to_numpy(),
                'inicio_s': teste.inicio_s.to_numpy(),
                'fim_s': teste.fim_s.to_numpy(),
                'y_real': teste.y.to_numpy(),
                'modelo': nome, 'score': s, 'limiar': th,
                'predicao': (s > th).astype(int)}))
    return pd.DataFrame(logs), pd.concat(predicoes, ignore_index=True), pd.DataFrame(selecionadas)


def uniao_intervalos(frame):
    if frame.empty:
        return 0.0
    total, inicio, fim = 0.0, None, None
    for row in frame.sort_values('inicio_s').itertuples():
        a, b = float(row.inicio_s), float(row.fim_s)
        if inicio is None:
            inicio, fim = a, b
        elif a <= fim:
            fim = max(b, fim)
        else:
            total += fim - inicio
            inicio, fim = a, b
    return (total + fim - inicio) if inicio is not None else 0.0


def alertas_grupo(g, consecutivas, cooldown_s):
    g = g.sort_values(['inicio_s', 'janela']).copy()
    contagem, anterior, ultimo_alerta = 0, None, -np.inf
    out = []
    for r in g.itertuples(index=False):
        ok = anterior is not None and abs(float(r.inicio_s)-anterior-PASSO_S) < 1e-6
        if r.predicao:
            contagem = contagem+1 if ok else 1
        else:
            contagem = 0
        instante = float(r.fim_s)
        alerta = bool(contagem >= consecutivas and instante-ultimo_alerta >= cooldown_s)
        if alerta:
            ultimo_alerta = instante
        out.append(alerta)
        anterior = float(r.inicio_s)
    g['alerta'] = np.asarray(out, dtype=bool)
    return g


def analisar_alertas(previsoes):
    # Critérios pré-fixados; comparação de sensibilidade, sem ajustar em labels de teste.
    frames, summaries = [], []
    for nome, df in previsoes.groupby('modelo'):
        for k in [1, 2, 3]:
            partes = [alertas_grupo(g, k, POLITICA_PRIMARIA['cooldown_s'])
                      for _, g in df.groupby('participante')]
            com_alertas = pd.concat(partes, ignore_index=True)
            if k == 3:
                frames.append(com_alertas)
            per_subject = []
            for participante, bloco in com_alertas.groupby('participante'):
                baseline = bloco[bloco.y_real.eq(0)]
                stress = bloco[bloco.y_real.eq(1)]
                falsa = int(baseline.alerta.sum())
                verdadeira = int(stress.alerta.sum())
                horas = uniao_intervalos(baseline) / 3600.0
                alerta_stress = stress.loc[stress.alerta]
                inicio = stress.inicio_s.min() if len(stress) else np.nan
                latencia = float(alerta_stress.fim_s.min()-inicio) if len(alerta_stress) else np.nan
                per_subject.append({'participante':participante,
                    'falsos_alertas':falsa, 'alertas_stress':verdadeira,
                    'horas_baseline':horas, 'latencia_primeiro_stress_s':latencia,
                    'houve_alerta_stress': int(verdadeira>0)})
            sub = pd.DataFrame(per_subject)
            summaries.append({'modelo':nome,'consecutivas':k,
                'cooldown_s': POLITICA_PRIMARIA['cooldown_s'],
                'falsos_alertas':int(sub.falsos_alertas.sum()),
                'alertas_stress':int(sub.alertas_stress.sum()),
                'horas_baseline':float(sub.horas_baseline.sum()),
                'falsos_alertas_por_hora':float(sub.falsos_alertas.sum()/sub.horas_baseline.sum()),
                'participantes_com_alerta_stress':int(sub.houve_alerta_stress.sum()),
                'participantes_com_stress':int(len(sub)),
                'latencia_mediana_detectados_s':float(sub.latencia_primeiro_stress_s.median()),
                'latencia_p95_detectados_s':float(sub.latencia_primeiro_stress_s.quantile(.95))})
    return pd.DataFrame(summaries), pd.concat(frames, ignore_index=True)


def bootstrap_participantes(logs, nome='Random_Forest', n=1000):
    df = logs[logs.modelo.eq(nome)].reset_index(drop=True)
    a = df[['recall','f1','fpr_baseline']].to_numpy(float)
    rng = np.random.default_rng(SEED)
    draws = np.mean(a[rng.integers(0,len(a),size=(n,len(a)))], axis=1)
    return {k:{'lower_95':float(np.quantile(draws[:,i],.025)),
               'upper_95':float(np.quantile(draws[:,i],.975))}
            for i,k in enumerate(['recall','f1','fpr_baseline'])}


def charts(outdir, macro, alerts, preditos):
    fig, ax = plt.subplots(figsize=(9,4))
    nomes = macro.modelo.tolist()
    ax.bar(nomes, 100*macro.f1, label='F1')
    ax.plot(nomes, 100*macro.recall, marker='o', color='black', label='Recall')
    ax.set_title('WESAD: validação LOPO (macro por participante)')
    ax.set_ylabel('Porcentagem (%)');ax.set_ylim(0,100);ax.legend()
    plt.xticks(rotation=12);fig.tight_layout();fig.savefig(outdir/'comparacao_modelos.png',dpi=150);plt.close(fig)
    df = alerts[alerts.modelo=='Random_Forest'].sort_values('consecutivas')
    fig, ax = plt.subplots(figsize=(8,4))
    ax.bar(df.consecutivas.astype(str), df.falsos_alertas_por_hora)
    ax.set_xlabel('Janelas positivas consecutivas');ax.set_ylabel('Falsos alertas/h baseline')
    ax.set_title('RF: efeito da persistência (cooldown 5 min)')
    fig.tight_layout();fig.savefig(outdir/'alertas_rf.png',dpi=150);plt.close(fig)
    exemplo = preditos[(preditos.modelo=='Random_Forest') & (preditos.participante=='S2')].sort_values('inicio_s')
    fig,ax=plt.subplots(figsize=(10,4))
    ax.plot(exemplo.fim_s/60, exemplo.score, label='Score RF externo')
    ax.plot(exemplo.fim_s/60, exemplo.limiar, '--',label='Limiar interno')
    ax.fill_between(exemplo.fim_s/60, 0, 1, where=exemplo.y_real.eq(1),alpha=.1,label='Stress anotado')
    ax.set_ylabel('Score');ax.set_xlabel('Minuto da sessão');ax.set_ylim(0,1)
    ax.set_title('S2: previsões realmente externas ao treinamento');ax.legend()
    fig.tight_layout();fig.savefig(outdir/'serie_temporal_S2.png',dpi=150);plt.close(fig)


def exportar(path_csv, outdir):
    outdir.mkdir(parents=True, exist_ok=True)
    bruto, dados, calibracoes = carregar(path_csv)
    print(f'Dados WESAD: {len(bruto)} totais, {len(dados)} baseline/stress, '
          f'{sum(dados.avaliavel)} avaliáveis, {dados.participante.nunique()} pessoas',flush=True)
    logs, preds, feats = validacao_externa(dados)
    assert len(preds)==len(dados[dados.avaliavel])*len(MODELOS), 'Cobertura externa incompleta'
    assert preds.groupby(['modelo','participante']).size().min()>0
    # Métricas macro por participante, mais métricas globais sem assumir independência de janelas.
    macro = logs.groupby('modelo',as_index=False)[['accuracy','precision','recall','f1','fpr_baseline','auc']].mean()
    glob = []
    for nome, group in preds.groupby('modelo'):
        m = medidas(group.y_real.to_numpy(),group.score.to_numpy(), np.inf)  # substitui com a previsão externa por fold
        y=group.y_real.to_numpy(int);yp=group.predicao.to_numpy(int)
        tn,fp,fn,tp=confusion_matrix(y,yp,labels=[0,1]).ravel()
        m.update({'accuracy':accuracy_score(y,yp),'precision':precision_score(y,yp,zero_division=0),
                  'recall':recall_score(y,yp,zero_division=0),'f1':f1_score(y,yp,zero_division=0),
                  'fpr_baseline':fp/(tn+fp),'tn':int(tn),'fp':int(fp),
                  'fn':int(fn),'tp':int(tp)})
        glob.append({'modelo':nome,'n':len(group),**m})
    global_df=pd.DataFrame(glob)
    alert_summary, alerts_3 = analisar_alertas(preds)
    selected = selecionar_features(dados)
    # Limiar definitivo calculado apenas com CV por participante; depois modelo treina todos.
    bundles = {}
    limiares = {}
    for nome in MODELOS:
        th=validacao_interna(nome,dados)
        fitted=treinar(nome,dados,selected)
        b={'modelo':fitted,'algoritmo':nome,'features':selected,'limiar':th,
           'personalizado':False,'dataset':'WESAD','escopo':'baseline_vs_stress_experimental',
           'validacao':'LOPO aninhada; artefato final treinado em todos os 15 participantes',
           'versao':'N9_final_experimental','calibracao_baseline_janelas':CALIBRACAO,
           'politica_alertas_experimental':POLITICA_PRIMARIA}
        model_path=outdir/f'LIMIAR_N9_{nome}_experimental.joblib'
        joblib.dump(b,model_path,compress=3)
        bundles[nome]=str(model_path.name)
        limiares[nome]=float(th)
    logs.to_csv(outdir/'LOPO_metricas_por_participante.csv',index=False)
    preds.to_csv(outdir/'LOPO_predicoes_externas.csv',index=False)
    feats.to_csv(outdir/'LOPO_features_por_dobra.csv',index=False)
    macro.to_csv(outdir/'LOPO_metricas_macro.csv',index=False)
    global_df.to_csv(outdir/'LOPO_metricas_globais.csv',index=False)
    alert_summary.to_csv(outdir/'LOPO_alertas_sensibilidade.csv',index=False)
    alerts_3.to_csv(outdir/'LOPO_alertas_politica_3janelas.csv',index=False)
    charts(outdir,macro,alert_summary,preds)
    digest=hashlib.sha256(Path(path_csv).read_bytes()).hexdigest()
    manifest={'data_execucao':datetime.now(timezone.utc).isoformat(),
         'python':platform.python_version(),'scikit_learn':sklearn.__version__,
         'fonte_sha256':digest,'janelas_totais':int(len(bruto)),
         'janelas_baseline_stress':int(len(dados)),
         'janelas_teste_externo':int(dados.avaliavel.sum()),
         'participantes':int(dados.participante.nunique()),
         'labels':{'1':'baseline','2':'stress_experimental'},
         'calibracao':{'janelas_baseline_por_pessoa':CALIBRACAO,
            'avaliacao': 'apenas janelas com inicio_s >= fim da 20a janela baseline'},
         'selecao_features':'ANOVA em medianas por participante e estado, somente treino de cada dobra',
         'features_candidatas':FEATURES_CANDIDATAS,'features_modelo_final':selected,
         'threshold':limiares,'modelos_salvos':bundles,
         'validacao_externa':'LeaveOneGroupOut por pessoa',
         'validacao_interna':'GroupKFold(3) por participante, meta FPR<=0.15',
         'politica_alertas':POLITICA_PRIMARIA,
         'intervalo_bootstrap_rf_participantes':bootstrap_participantes(logs),
         'metricas_macro':macro.set_index('modelo').round(6).to_dict('index'),
         'alertas_rf_3janelas':alert_summary[(alert_summary.modelo=='Random_Forest') & (alert_summary.consecutivas==3)].iloc[0].to_dict(),
         'observacao':'Métricas exploratórias de stress experimental WESAD. Dados de treino não são teste independente prospectivo; não é validador de sobrecarga sensorial.',
         'limites':['15 participantes apenas; janelas sobrepostas não são independentes',
                    'WESAD não representa sobrecarga sensorial em população autista',
                    'Não foi realizado teste em wearable físico nem validação prospectiva',
                    'Características EDA/ACC exigem validação de unidades/escala e sensores',
                    'Política de alertas 3 janelas + cooldown 5 min é experimental',
                    'Não empregar como diagnóstico ou alerta médico']}
    with open(outdir/'manifesto_final.json','w',encoding='utf-8') as f:
        json.dump(manifest,f,ensure_ascii=False,indent=2,default=lambda v:float(v) if isinstance(v,np.floating) else int(v) if isinstance(v,np.integer) else str(v))
    lines=['# LIMIAR — Conclusão da fase de treino (experimental)', '',
           'Dados: WESAD baseline (1) versus stress (2), 15 participantes.',
           f'Janelas totais: {len(bruto)}; comparáveis: {len(dados)}; teste externo pós-calibração: {dados.avaliavel.sum()}.',
           'Avaliação: Leave-One-Participant-Out externo; seleção e limiar nas dobras internas.',
           'Random Forest treinado em todos os 15 participantes para inferência exploratória,',
           'com resultados de desempenho reportados SOMENTE pela validação externa.', '',
           '## Métricas macro externas (por participante)', '',macro.to_markdown(index=False,floatfmt='.3f'),'',
           '## Política de alertas exploratória', '',
           'Critério predefinido: 3 janelas positivas consecutivas e 300 s de cooldown.',
           'Os alertas são baseados em previsões externas; sem labels disponíveis para inferência.',
           '', alert_summary.to_markdown(index=False,floatfmt='.3f'), '',
           '## Contrato de integração', '',
           f'Features finais: {selected}. Limiar RF (interno) {limiares["Random_Forest"]:.4f}.',
           'Formato de bundle compatível com `limiar_inferencia.py` do Notebook 8.',
           'Dispositivo físico deverá fornecer EDA e ACC em escalas validadas.', '',
           '## Aviso científico', '',
           'WESAD registra stress experimental, não sobrecarga sensorial nem meltdown/shutdown.',
           'Não utilizar como diagnóstico, alerta clínico ou decisão automatizada de saúde.',
           'Antes de alegar uso real, exige validação prospectiva com população-alvo,',
           'sensores reais e aprovação ética, além de segurança e LGPD.', '',
           '## Arquivos', '',
           '- `LIMIAR_N9_Random_Forest_experimental.joblib`: modelo principal experimental.',
           '- `LIMIAR_N9_Regressao_Logistica_experimental.joblib`: comparativo supervisionado.',
           '- Isolation Forest: manter artefatos e resultados históricos do Notebook 7.',
           '- `LOPO_predicoes_externas.csv`: previsões válidas para avaliar desempenho externo.',
           '- `LOPO_alertas_sensibilidade.csv`: comparação exploratória de 1, 2 e 3 janelas.',
           '- `LOPO_alertas_politica_3janelas.csv`: eventos e scores externos.',
           '- `manifesto_final.json`: ambiente, fontes, métricas e configurações.',
           '- PNGs: gráficos de modelos, alertas e série temporal.', '']
    (outdir/'RELATORIO_FINAL.md').write_text('\n'.join(lines),encoding='utf8')
    print('### METRICAS_MACRO',flush=True)
    print(macro.round(4).to_string(index=False),flush=True)
    print('### ALERTAS_3JANELAS',flush=True)
    print(alert_summary[alert_summary.consecutivas.eq(3)].round(4).to_string(index=False),flush=True)
    print('### FINAL_FEATURES',selected,'THRESHOLDS',limiares,flush=True)
    print('SAIDA',outdir,flush=True)
    return manifest


if __name__=='__main__':
    p=argparse.ArgumentParser()
    p.add_argument('--csv',default='features_consolidado.csv')
    p.add_argument('--saida',default='LIMIAR_N9_Resultados')
    a=p.parse_args()
    exportar(Path(a.csv),Path(a.saida))
