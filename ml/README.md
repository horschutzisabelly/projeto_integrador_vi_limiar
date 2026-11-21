# LIMIAR — Inteligência Artificial (protótipo experimental)

Este diretório acrescenta ao app Expo/React Native a **parte de pesquisa e inferência** em Python, sem modificar o aplicativo atual. O modelo foi estudado no WESAD para diferenciar **baseline** e **stress experimental**. **Não detecta sobrecarga sensorial autista de maneira validada e não deve gerar alertas clínicos.**

## Conteúdo

- `treinar_limiar_final.py` — treinamento e validação por participante (LOPO), incluindo seleção de atributos e limiar interno.
- `notebooks/` — Notebooks 8 e 9 para demonstração e reprodução no Google Colab.
- `limiar_inferencia.py` e `api_limiar.py` — inferência experimental e API FastAPI local.
- `modelos/` — dois artefatos `joblib` experimentais treinados no WESAD (Random Forest e Regressão Logística).
- `resultados/` — tabelas agregadas, relatório, configuração de execução e gráficos.
- `tests/` — testes de consistência técnica, sem dados individuais.

## Execução local (Python)

No terminal, dentro da pasta `ml/`:

```bash
python -m pip install -r requirements.txt
python -m pytest -q
```

Para rodar a API no Windows PowerShell:

```powershell
$env:LIMIAR_MODEL_PATH = "$((Get-Location).Path)\modelos\LIMIAR_N9_Random_Forest_experimental.joblib"
python -m uvicorn api_limiar:app --host 127.0.0.1 --port 8000
```

Ela disponibiliza `GET /health`, `POST /v1/predicao/features` e `POST /v1/predicao/sensores`. A API **não** tem segurança de produção; não a exponha na internet. Os sinais de dispositivo físico exigem validação de unidades, amostragem e sincronização. Arquivos `joblib` só devem ser carregados de fonte confiável.

### Reproduzir o treinamento

O CSV `features_consolidado.csv` deve ser obtido no Drive autorizado do projeto e **não faz parte deste repositório público**. Coloque-o na pasta `ml/` somente no seu computador (está ignorado pelo Git) e execute:

```bash
python treinar_limiar_final.py --csv features_consolidado.csv --saida resultados_privados
```

O treinamento completo já foi executado em 20/11/2026; reproduzir é opcional. Os modelos finais foram ajustados com todos os participantes. **Não avalie generalização executando métricas no mesmo CSV de treino**: para isso, consulte as avaliações externas separadas por participante em `resultados/`.

## Resultados publicados (exploratórios)

| Modelo | Recall médio | F1 médio | FPR de baseline médio |
|---|---:|---:|---:|
| Random Forest | 0,404 | 0,499 | 0,080 |
| Regressão Logística | 0,553 | 0,607 | 0,133 |

A política simulada de 3 janelas consecutivas e 300 s de espera gerou cerca de 1,10 e 2,20 falsos alertas por hora de baseline (Random Forest e Regressão Logística, respectivamente). O período avaliado é curto e os números não são validação de alertas clínicos.

## Limites e origem do WESAD

O dataset WESAD possui dados fisiológicos de 15 participantes em condições de laboratório. Os dados brutos, as *features* por indivíduo e as predições por janela estão armazenados no Drive privado da equipe e deliberadamente não foram adicionados ao repositório público. Para uso e atribuição, consulte os [termos oficiais do WESAD](https://www.eti.uni-siegen.de/ubicomp/home/datasets/icmi18/index.html.en).

Referência: Schmidt et al. (2018), *Introducing WESAD, a Multimodal Dataset for Wearable Stress and Affect Detection*, ICMI '18. DOI: 10.1145/3242969.3242985.

**Próximo passo:** validar sensores e processamento online, integrar a API ao app e realizar avaliação independente e revisão ética antes de qualquer teste com usuários reais.
