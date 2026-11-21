# LIMIAR

Aplicativo acadêmico desenvolvido no Projeto Integrador VI, com o objetivo de estudar o uso de inteligência artificial no acompanhamento de sinais fisiológicos e investigar sua possível aplicação na identificação de padrões relacionados à sobrecarga sensorial em pessoas com Transtorno do Espectro Autista (TEA).

O projeto combina um aplicativo mobile desenvolvido em React Native com modelos de aprendizado de máquina treinados em Python, utilizando o dataset WESAD.

Atualmente, conseguimos concluir o treinamento experimental dos modelos e realizar a integração entre o aplicativo e a inteligência artificial por meio de uma API FastAPI.

A integração já foi testada em um iPhone utilizando Expo Go, com dados artificiais enviados ao modelo Random Forest e resultados apresentados diretamente no aplicativo.

**Importante:** o LIMIAR ainda é um protótipo acadêmico. Os modelos foram treinados para diferenciar condições de referência e stress experimental no WESAD, não sendo validados para diagnosticar ou identificar sobrecarga sensorial em pessoas com TEA.

## Objetivo

Desenvolver um aplicativo mobile capaz de acompanhar informações relacionadas a sinais fisiológicos, apresentar resultados de análises, registrar eventos e permitir que o usuário forneça feedback sobre sua experiência.

A proposta é utilizar modelos de inteligência artificial para analisar padrões desses sinais e, futuramente, estudar a possibilidade de integração com dispositivos vestíveis.

Nesta etapa, o projeto já permite enviar dados artificiais para um modelo treinado e visualizar as previsões no aplicativo.

## Tecnologias utilizadas

**Frontend**
- React Native
- Expo
- TypeScript

**Backend e inteligência artificial**
- Python
- FastAPI
- Uvicorn
- Scikit-learn
- Pandas
- NumPy
- Joblib

**Ferramentas utilizadas**
- Google Colab
- Visual Studio Code
- Git e GitHub
- Expo Go

O SQLite está previsto para o armazenamento local das informações, mas sua integração ainda não foi concluída.

## Inteligência Artificial

A parte de inteligência artificial foi desenvolvida utilizando o dataset WESAD, que contém sinais fisiológicos registrados em diferentes condições experimentais.

Durante o desenvolvimento, trabalhamos inicialmente com o Isolation Forest e, posteriormente, realizamos comparações com Random Forest e Regressão Logística.

Para melhorar a avaliação dos modelos, utilizamos validação por participante (Leave-One-Participant-Out — LOPO), separando os participantes utilizados no treinamento daqueles utilizados no teste de cada rodada.

Também realizamos seleção de características e ajustes nos limiares de classificação.

### Modelos utilizados

Os dois modelos finais desta etapa foram:

- Random Forest
- Regressão Logística

### Resultados obtidos

| Modelo | Recall | F1-score | Taxa de falsos positivos |
|---|---:|---:|---:|
| Random Forest | 40,4% | 49,9% | 8,0% |
| Regressão Logística | 55,3% | 60,7% | 13,3% |

A Regressão Logística apresentou melhores resultados de recall e F1-score, enquanto o Random Forest apresentou menor taxa de falsos positivos.

Para a primeira integração com o aplicativo, utilizamos o Random Forest com limiar experimental de 72%.

As características utilizadas pelo modelo são:

- `EDA_std`: desvio-padrão da atividade eletrodérmica;
- `EDA_max`: valor máximo da atividade eletrodérmica;
- `ACC_std`: desvio-padrão da magnitude da aceleração;
- `ACC_max`: valor máximo da magnitude da aceleração.

Os modelos treinados estão disponíveis na pasta `ml/modelos/`.

## Integração da IA com o aplicativo

Após finalizar a etapa de treinamento, desenvolvemos uma API utilizando FastAPI para permitir a comunicação entre a inteligência artificial e o aplicativo React Native.

O funcionamento acontece da seguinte forma:

1. O aplicativo envia dados para a API FastAPI.
2. A API recebe os dados e os encaminha ao modelo treinado.
3. O modelo Random Forest realiza a previsão.
4. A API devolve o score, o limiar e a classificação experimental.
5. O aplicativo apresenta o resultado para o usuário.
6. A análise é registrada no histórico da sessão.

A integração já está funcionando com dados artificiais, sem a necessidade de conectar um sensor físico.

### Funcionalidades implementadas

- Tela de análise experimental com IA;
- Comunicação entre React Native e FastAPI;
- Verificação de conexão com o backend;
- Envio de características fisiológicas artificiais;
- Envio de janelas sintéticas de EDA e acelerômetro;
- Execução de previsões utilizando o Random Forest;
- Exibição do score e limiar utilizados;
- Histórico das análises realizadas durante a sessão;
- Tratamento de erros de conexão e respostas da API.

As previsões experimentais são apresentadas separadamente dos alertas fictícios que já existiam no aplicativo.

## Estrutura do projeto

```text
projeto_integrador_vi_limiar/
│
├── assets/
│
├── docs/
│   └── INTEGRACAO_IA.md
│
├── ml/
│   ├── api_limiar.py
│   ├── limiar_inferencia.py
│   ├── treinar_limiar_final.py
│   ├── requirements.txt
│   │
│   ├── modelos/
│   │   ├── LIMIAR_N9_Random_Forest_experimental.joblib
│   │   └── LIMIAR_N9_Regressao_Logistica_experimental.joblib
│   │
│   ├── notebooks/
│   ├── resultados/
│   └── tests/
│
├── src/
│   ├── components/
│   ├── fixtures/
│   ├── hooks/
│   ├── screens/
│   ├── services/
│   ├── styles/
│   ├── types/
│   └── validacao/
│
├── .env.example
├── App.tsx
├── package.json
└── README.md
```

## Como executar o projeto

### 1. Requisitos

Antes de começar, é necessário ter:

- Git;
- Node.js em versão LTS;
- npm;
- Python;
- Visual Studio Code ou outro editor;
- Expo Go compatível com a versão do Expo utilizada no projeto.

Para testar em um celular físico, o computador e o celular devem estar conectados à mesma rede Wi-Fi.

### 2. Clonar o repositório

Clone o repositório:

```bash
git clone https://github.com/horschutzisabelly/projeto_integrador_vi_limiar.git
```

Entre na pasta:

```bash
cd projeto_integrador_vi_limiar
```

Certifique-se de utilizar a versão atualizada da branch principal:

```bash
git switch main
git pull origin main
```

### 3. Instalar as dependências do aplicativo

Na raiz do projeto, execute:

```bash
npm install
```

Para verificar o código TypeScript:

```bash
npx tsc --noEmit
```

Se não aparecerem erros, o aplicativo estará pronto para ser iniciado.

### 4. Instalar as dependências da IA

Abra um terminal e entre na pasta `ml`:

```bash
cd ml
```

Instale as bibliotecas Python:

```bash
python -m pip install -r requirements.txt
```

Para executar os testes automatizados:

```bash
python -m pytest -q
```

### 5. Configurar o modelo Random Forest

No Windows PowerShell, dentro da pasta `ml`, execute:

```powershell
$env:LIMIAR_MODEL_PATH = "$((Get-Location).Path)\modelos\LIMIAR_N9_Random_Forest_experimental.joblib"
```

Esse comando define o modelo que será carregado pela API.

### 6. Iniciar a API FastAPI

No mesmo terminal, execute:

```powershell
python -m uvicorn api_limiar:app --host 0.0.0.0 --port 8000
```

O servidor será iniciado na porta 8000.

Mantenha esse terminal aberto enquanto estiver testando o aplicativo.

**Atenção:** essa configuração disponibiliza a API na rede local. Utilize somente uma rede privada confiável. O backend ainda não possui autenticação ou HTTPS e não deve ser exposto à internet.

Para confirmar que a API está funcionando, abra no navegador do computador:

http://127.0.0.1:8000/health

A resposta deverá conter:

```json
{
  "status": "ok",
  "algoritmo": "Random_Forest",
  "features": [
    "EDA_std",
    "ACC_max",
    "ACC_std",
    "EDA_max"
  ]
}
```

A resposta completa também contém um aviso sobre o caráter experimental do modelo.

### 7. Descobrir o IP do computador

Abra outro terminal do PowerShell e execute:

```powershell
ipconfig
```

Procure o endereço IPv4 do adaptador Wi-Fi utilizado pelo computador.

Exemplo:

```text
192.168.0.15
```

Esse endereço é apenas um exemplo. Cada integrante deverá utilizar o IP do próprio computador.

### 8. Configurar o endereço da API

Na raiz do projeto, copie o arquivo `.env.example` para `.env.local`.

No PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Abra o arquivo `.env.local` e configure o endereço:

```env
EXPO_PUBLIC_LIMIAR_API_URL=http://192.168.0.15:8000
```

Substitua `192.168.0.15` pelo IPv4 do seu computador.

O arquivo `.env.local` não deve ser enviado ao GitHub, pois contém configurações específicas do ambiente local.

### 9. Testar a conexão pelo celular

Com a API funcionando, conecte o celular à mesma rede Wi-Fi do computador.

Abra o navegador do celular e acesse o endereço IP configurado, seguido de `/health`.

Exemplo:

```text
http://192.168.0.15:8000/health
```

Se o navegador apresentar a resposta com `"status": "ok"`, significa que o celular consegue acessar a API.

Caso não funcione, confira o IP, a rede Wi-Fi e as configurações do Firewall do Windows.

### 10. Iniciar o Expo

Abra um segundo terminal na raiz do projeto, mantendo a FastAPI executando no primeiro.

Execute:

```bash
npx expo start
```

O Expo apresentará um QR Code para abrir o aplicativo no Expo Go.

Se houver problemas de autenticação, utilize:

```bash
npx expo login
```

Confira a conta conectada:

```bash
npx expo whoami
```

Entre com a mesma conta utilizada no Expo Go do celular.

Se necessário, reinicie o servidor:

```bash
npx expo start --clear
```

Se a conexão do Expo não funcionar pela rede local, tente:

```bash
npx expo start --tunnel
```

O modo Tunnel ajuda na conexão com o Expo, mas não substitui a configuração do endereço da API.

## Acesso demonstrativo

Para entrar no aplicativo LIMIAR, utilize:

- **E-mail:** `limiar@gmail.com`
- **Senha:** `Limiar123`

Esses dados são fixos e utilizados somente para demonstração.

O cadastro e a redefinição de senha ainda não alteram as credenciais utilizadas no login.

## Como testar a inteligência artificial

Após entrar no aplicativo:

1. Acesse o painel principal.
2. Clique em **Abrir análise com IA**.
3. Verifique a conexão com a API.
4. Confirme que aparece **Conectado · Random Forest**.
5. Execute os três exemplos disponíveis.

### Exemplo A — Referência artificial

Envia um conjunto de características artificiais para testar o comportamento do modelo em um exemplo de referência.

### Exemplo B — Variação artificial

Envia outro conjunto de características artificiais para testar uma classificação de variação experimental.

### Exemplo C — Sinais EDA/ACC

Envia uma janela sintética correspondente a 30 segundos de dados fisiológicos, contendo:

- 120 amostras de EDA;
- 960 amostras de acelerômetro triaxial.

A API calcula as características a partir desses sinais e utiliza o modelo treinado para realizar a previsão.

### Resultados dos testes realizados

Em 21/11/2026, realizamos testes da integração utilizando um iPhone com Expo Go.

| Teste | Score | Limiar | Resultado |
|---|---:|---:|---|
| Exemplo A | 4,2% | 72,0% | Referência experimental |
| Exemplo B | 79,0% | 72,0% | Variação experimental |
| Exemplo C | 55,9% | 72,0% | Referência experimental |

Esses resultados foram obtidos utilizando o modelo Random Forest.

Os scores são saídas do classificador e não representam probabilidades clínicas de sobrecarga sensorial.

Também conseguimos visualizar os registros das análises no histórico da sessão.

## Endpoints da API

A FastAPI disponibiliza os seguintes endpoints:

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/health` | Verifica o funcionamento da API e do modelo |
| POST | `/v1/predicao/features` | Realiza previsão utilizando características calculadas |
| POST | `/v1/predicao/sensores` | Realiza previsão utilizando janelas EDA/ACC |

As respostas das previsões incluem o score do modelo, o limiar e a classificação experimental.

## Documentação adicional

Para mais detalhes sobre o treinamento e a integração, consulte:

- `ml/README.md`: documentação da inteligência artificial;
- `ml/resultados/RELATORIO_FINAL.md`: resultados e métricas dos modelos;
- `docs/INTEGRACAO_IA.md`: instruções técnicas da integração;
- `ml/notebooks/`: notebooks utilizados no desenvolvimento;
- `ml/tests/`: testes automatizados.

## Limitações atuais

Apesar dos avanços, algumas partes do LIMIAR ainda estão em desenvolvimento:

- A coleta de dados por sensores reais ainda não foi integrada;
- Os exemplos utilizados nas análises são artificiais;
- O histórico da IA é mantido somente durante a sessão;
- O armazenamento SQLite ainda não foi implementado;
- O sistema de autenticação continua demonstrativo;
- A API ainda não possui autenticação e HTTPS para uso remoto;
- O monitoramento contínuo e a política temporal de alertas ainda não estão integrados ao aplicativo;
- Os modelos ainda não foram validados para detectar sobrecarga sensorial em pessoas com TEA.

## Próximos passos

As próximas etapas previstas para o projeto são:

1. Estudar e definir um dispositivo vestível compatível com os sinais utilizados no treinamento;
2. Desenvolver a coleta e o processamento contínuo dos sinais;
3. Implementar o armazenamento persistente das análises;
4. Avaliar estratégias de alertas com controle de falsos positivos;
5. Realizar novos testes de integração e validação;
6. Melhorar a segurança e a privacidade dos dados;
7. Continuar evoluindo a interface e a experiência do usuário.

## Status atual do projeto

**Treinamento experimental da IA:** concluído.

**Comparação dos modelos:** concluída.

**API FastAPI:** implementada e testada.

**Integração React Native + IA:** implementada e testada com dados artificiais.

**Testes em iPhone pelo Expo Go:** realizados com sucesso.

**Integração com sensores físicos:** pendente.

**Persistência dos dados:** pendente.

**Validação para sobrecarga sensorial:** pendente.

## Considerações finais

Com essa atualização, conseguimos avançar da etapa de treinamento da inteligência artificial para uma integração funcional com o aplicativo LIMIAR.

O aplicativo já consegue enviar dados artificiais para o backend, receber previsões calculadas pelo modelo treinado e apresentar os resultados na interface.

Todo o código está organizado e disponível no GitHub para que os integrantes da equipe possam reproduzir os testes e continuar o desenvolvimento.

O foco das próximas etapas será trabalhar com dados fisiológicos reais, melhorar o armazenamento das informações e continuar avaliando a confiabilidade da inteligência artificial.

---

**Projeto Integrador VI — LIMIAR**

*Última atualização: 21/11/2026.*
