# LIMIAR — Conclusão da fase de treino (experimental)

Dados: WESAD baseline (1) versus stress (2), 15 participantes.
Janelas totais: 5770; comparáveis: 1840; teste externo pós-calibração: 1525.
Avaliação: Leave-One-Participant-Out externo; seleção e limiar nas dobras internas.
Random Forest treinado em todos os 15 participantes para inferência exploratória,
com resultados de desempenho reportados SOMENTE pela validação externa.

## Métricas macro externas (por participante)

| modelo              |   accuracy |   precision |   recall |    f1 |   fpr_baseline |   auc |
|:--------------------|-----------:|------------:|---------:|------:|---------------:|------:|
| Random_Forest       |      0.695 |       0.797 |    0.404 | 0.499 |          0.080 | 0.865 |
| Regressao_Logistica |      0.730 |       0.846 |    0.553 | 0.607 |          0.133 | 0.879 |

## Política de alertas exploratória

Critério predefinido: 3 janelas positivas consecutivas e 300 s de cooldown.
Os alertas são baseados em previsões externas; sem labels disponíveis para inferência.

| modelo              |   consecutivas |   cooldown_s |   falsos_alertas |   alertas_stress |   horas_baseline |   falsos_alertas_por_hora |   participantes_com_alerta_stress |   participantes_com_stress |   latencia_mediana_detectados_s |   latencia_p95_detectados_s |
|:--------------------|---------------:|-------------:|-----------------:|-----------------:|-----------------:|--------------------------:|----------------------------------:|---------------------------:|--------------------------------:|----------------------------:|
| Random_Forest       |              1 |          300 |               15 |               30 |            3.637 |                     4.124 |                                14 |                         15 |                          30.000 |                     214.500 |
| Random_Forest       |              2 |          300 |               10 |               24 |            3.637 |                     2.749 |                                14 |                         15 |                          45.000 |                     327.000 |
| Random_Forest       |              3 |          300 |                4 |               19 |            3.637 |                     1.100 |                                13 |                         15 |                          60.000 |                     492.000 |
| Regressao_Logistica |              1 |          300 |               17 |               34 |            3.637 |                     4.674 |                                15 |                         15 |                          30.000 |                     138.000 |
| Regressao_Logistica |              2 |          300 |               14 |               32 |            3.637 |                     3.849 |                                15 |                         15 |                          45.000 |                     289.500 |
| Regressao_Logistica |              3 |          300 |                8 |               26 |            3.637 |                     2.199 |                                13 |                         15 |                          60.000 |                     156.000 |

## Contrato de integração

Features finais: ['EDA_std', 'ACC_max', 'ACC_std', 'EDA_max']. Limiar RF (interno) 0.7200.
Formato de bundle compatível com `limiar_inferencia.py` do Notebook 8.
Dispositivo físico deverá fornecer EDA e ACC em escalas validadas.

## Aviso científico

WESAD registra stress experimental, não sobrecarga sensorial nem meltdown/shutdown.
Não utilizar como diagnóstico, alerta clínico ou decisão automatizada de saúde.
Antes de alegar uso real, exige validação prospectiva com população-alvo,
sensores reais e aprovação ética, além de segurança e LGPD.

## Arquivos

- `LIMIAR_N9_Random_Forest_experimental.joblib`: modelo principal experimental.
- `LIMIAR_N9_Regressao_Logistica_experimental.joblib`: comparativo supervisionado.
- Isolation Forest: manter artefatos e resultados históricos do Notebook 7.
- `LOPO_predicoes_externas.csv`: previsões válidas para avaliar desempenho externo.
- `LOPO_alertas_sensibilidade.csv`: comparação exploratória de 1, 2 e 3 janelas.
- `LOPO_alertas_politica_3janelas.csv`: eventos e scores externos.
- `manifesto_final.json`: ambiente, fontes, métricas e configurações.
- PNGs: gráficos de modelos, alertas e série temporal.

## Comparação com limiar fixo (ponto de referência)

A tabela abaixo avalia exatamente os mesmos scores LOPO do RF, sem novo treinamento.
O limiar 0,50 foi escolhido como referência antes de olhar o teste, não como
uma política de segurança validada. A versão de limiar ajustado foi escolhida
apenas com as dobras internas de treinamento.

| cenario                           |   recall |    f1 |   fpr |   falsos_alertas_h_k3 |
|:----------------------------------|---------:|------:|------:|----------------------:|
| RF limiar 0,50 (referência fixa)  |    0.617 | 0.644 | 0.178 |                 2.749 |
| RF limiar interno (meta FPR<=15%) |    0.404 | 0.499 | 0.080 |                 1.100 |

O compromisso é claro: aumentar o limiar reduz falsos positivos, mas
piora a detecção de stress. Uma taxa de 1,1 falso alerta/hora de baseline ainda
seria elevada para um sistema que interrompe a rotina da pessoa; não utilizar
esses alertas em usuários reais.

## Comparação cautelosa com o Notebook 7

No benchmark anterior (N7), RF teve F1 macro 0,661, recall 0,643 e FPR 0,179;
Regressão Logística teve F1 macro 0,635, recall 0,603 e FPR 0,144.
Na N9 houve nova configuração de árvores, restrição a features EDA/ACC e
limiar ajustado, portanto são experimentos relacionados, **não resultados
intercambiáveis ou evidência de melhora universal**. A N9 dá ênfase ao custo
de falsos positivos e ao comportamento de alertas.

## Interpretação final

- O melhor F1 na N9 foi de Regressão Logística, enquanto o RF com limiar
  conservador gerou menos falsos alertas/h de baseline.
- Nenhuma opção alcançou qualidade suficiente para recomendação de alertas
  clínicos. Os 15 participantes e cerca de 3,64 horas de baseline avaliado
  tornam instáveis as taxas de alertas.
- Arquivos `joblib` definitivos são apenas artefatos experimentais treinados
  com as 1.840 janelas rotuladas; **não usar os mesmos dados para alegar
  desempenho generalizado**. As métricas válidas vêm das 1.525 janelas
  com predições externas Leave-One-Participant-Out.
- A fase técnica de treino sobre o WESAD pode ser dada como executada;
  permanece pendente a validação de sinais reais, população-alvo, protocolo
  de consentimento/ética e proteção de dados antes de uso.
