# LIMIAR

Aplicativo acadêmico desenvolvido no Projeto Integrador VI, destinado a demonstrar o acompanhamento de alterações em sinais fisiológicos, com foco na investigação de padrões relacionados à sobrecarga sensorial em pessoas com Transtorno do Espectro Autista (TEA).

## Objetivo

Construir uma experiência mobile que permita consultar o estado apresentado pela análise, receber avisos, acompanhar eventos anteriores e registrar a percepção do usuário sobre os alertas.

O projeto prevê o uso do dataset WESAD, processamento em Python, integração de um modelo de inteligência artificial e armazenamento local em SQLite.

## Executar o projeto

### Requisitos

- Node.js em versão LTS.
- npm.
- Git.
- Expo Go compatível com a versão do projeto, para testes em dispositivo físico.

### Instalação

Clone o repositório:

```bash
git clone https://github.com/horschutzisabelly/projeto_integrador_vi_limiar.git
```

Entre na pasta:

```bash
cd projeto_integrador_vi_limiar
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npx expo start
```

Escaneie o QR Code com o Expo Go no Android ou com a câmera do iPhone.

Para conexão local, mantenha computador e celular na mesma rede Wi-Fi. Caso a conexão direta não funcione, utilize:

```bash
npx expo start --tunnel
```

Mantenha o terminal aberto durante os testes. Para encerrar, pressione `Ctrl + C`.

### Autenticação do Expo

Se o ambiente solicitar login:

```bash
npx expo login
```

Para conferir a conta conectada:

```bash
npx expo whoami
```

A conta Expo pertence ao ambiente de desenvolvimento e é diferente do acesso demonstrativo do LIMIAR.

## Acesso demonstrativo

- **E-mail:** `limiar@gmail.com`
- **Senha:** `Limiar123`

Esses dados são fixos para demonstração. Não representam uma integração com o Gmail.

O cadastro e a redefinição de senha ainda não modificam as credenciais de acesso.
