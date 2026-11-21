# LIMIAR — integração experimental da IA com o aplicativo

## Objetivo

Esta atualização conecta o aplicativo Expo/React Native à API FastAPI já existente na pasta `ml/`. É uma **integração ponta a ponta para demonstração acadêmica**, não a coleta por sensores físicos nem um detector clínico.

## O que foi feito

- Tela **Análise experimental** acessível pelo botão do painel;
- Cliente HTTP com verificação de saúde, timeout e mensagens de erro;
- Três rotas de teste: dois vetores artificiais de features e uma janela sintética EDA/ACC;
- Visualização do `score_modelo`, `limiar` e `indicador_experimental` efetivamente calculados no backend;
- Histórico das análises da sessão no painel e na tela Histórico;
- Separação explícita entre eventos fictícios originais e resultados experimentais da IA;
- Sem dependências JavaScript novas; sem mudança de autenticação, notificações ou sensor físico.

## Rodar a API no computador (Windows PowerShell)

Instale Python e o pacote de dependências da pasta `ml/` (faça isso uma vez):

```powershell
cd ml
python -m pip install -r requirements.txt
$env:LIMIAR_MODEL_PATH = "$((Get-Location).Path)\modelos\LIMIAR_N9_Random_Forest_experimental.joblib"
python -m uvicorn api_limiar:app --host 0.0.0.0 --port 8000
```

> Atenção: `0.0.0.0` permite acesso na rede local. Use apenas numa rede de teste confiável; o protótipo não tem autenticação nem HTTPS. Não exponha a porta à internet. O terminal da API precisa permanecer aberto.

Teste no computador: `http://127.0.0.1:8000/health`.

## Rodar o aplicativo

Na raiz do repositório:

1. Copie `.env.example` para `.env.local`.
2. No `.env.local`, substitua o IP de exemplo pelo **IPv4 do computador que executa a API**. Encontre-o com `ipconfig` no Windows. Exemplo: `EXPO_PUBLIC_LIMIAR_API_URL=http://192.168.1.50:8000`.
3. O celular e o computador devem estar na mesma rede Wi-Fi; firewall do Windows deve permitir a porta 8000 em rede privada.
4. Execute:

```powershell
npm install
npx tsc --noEmit
npx expo start
```

Acesse no celular pelo Expo Go (ou por um build de desenvolvimento, conforme a compatibilidade da versão do Expo). Abra o app, faça o login **demonstrativo** que o app já oferecia, entre em **Abrir análise com IA** e pressione **Testar conexão novamente**. Em seguida, use os três exemplos.

- Se aparecer `Servidor não conectado`, confirme o endereço IP, a porta, o terminal da API e o firewall. `localhost` no celular é o próprio celular, não seu computador.
- No simulador Android padrão, o host da máquina pode ser `http://10.0.2.2:8000`; no celular físico, use o IPv4 da máquina.
- Para uso pelo navegador (Expo Web), será necessário configurar CORS no FastAPI para a origem local do Expo. Esta entrega foi direcionada ao aplicativo mobile.
- No backend, o modelo selecionado pelo `LIMIAR_MODEL_PATH` pode ser trocado para `LIMIAR_N9_Regressao_Logistica_experimental.joblib` e a API reiniciada.

## Contrato HTTP

- `GET /health` → estado da API, algoritmo, features e aviso;
- `POST /v1/predicao/features` → `{ "caracteristicas": { "EDA_std": ..., "ACC_max": ..., "ACC_std": ..., "EDA_max": ... } }`;
- `POST /v1/predicao/sensores` → `{ "eda": [120 números], "acc": [[x,y,z], ... 960], "unidades_eda":"WESAD_ORIGINAL", "unidades_acc":"WESAD_ORIGINAL" }`.

A inferência retorna `score_modelo`, `limiar`, `indicador_experimental`, `interpretacao` e `aviso`. Um `indicador_experimental: 1` não representa diagnóstico, episódio de TEA ou alerta a usuário real.

## Não está incluído nesta etapa

- Coleta Bluetooth e streaming de um wearable;
- Verificação do hardware, calibração e mapeamento de unidades/escala/amostragem do sensor ao WESAD;
- Implementação de autenticação, privacidade e acesso remoto seguro para a API;
- Persistência SQLite dos eventos/feedback e associação a usuário;
- Monitoramento de 30 s com passo de 15 s em tempo real e política temporal de três janelas/cooldown;
- Testes ponta a ponta em um aparelho real ou validação clínica.

O aplicativo mantém o evento fictício original nas telas de Alerta e Detalhes; as previsões da IA aparecem **separadamente** no Painel, na tela nova e no Histórico. Não confundir os dois fluxos.

## Próxima fase sugerida

Após validar a demonstração com a equipe, escolher o wearable e especificar transporte, aquisição, formato de janela, sincronização, privacidade, persistência local e política de notificações (somente após avaliação ética/técnica).
