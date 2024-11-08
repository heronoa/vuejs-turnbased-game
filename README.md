# Jogo Multiplayer de Turno

Bem-vindo ao projeto de Jogo Multiplayer de Turno desenvolvido em Vue 3! Este é um jogo online onde jogadores podem criar personagens, fazer login, e lutar contra outros jogadores em batalhas de turno. Caso o sistema não encontre um oponente em até 15 segundos, o jogador enfrentará um oponente controlado pelo sistema.

## Tecnologias Utilizadas

### Frontend

- **Vue 3**: Framework principal do front-end.
- **Pinia**: Biblioteca de gerenciamento de estado para Vue 3.

### Backend

O backend foi desenvolvido por mim utilizando as seguintes tecnologias:

- **Node.js**
- **Colyseus.js**: Biblioteca para criação de jogos multiplayer em tempo real.
- **Express**: Framework para criar APIs e gerenciar as rotas.
- **MongoDB**: Banco de dados para armazenamento de informações de usuários, personagens e progresso.

## Funcionalidades

- **Autenticação**: Crie uma conta e faça login para acessar o jogo. (Garanto que seu email não será usado para nada além de autenticar o login e nem precisa ser um email real, não há confirmação)
- **Criação de Personagens**: Escolha entre três classes de personagens - Warrior, Mage e Scout.
- **Fila de Matchmaking**: Encontre um oponente em até 15 segundos; caso contrário, jogue contra um oponente controlado pela IA.
- **Sistema de Batalha em Turnos**: Participe de batalhas estratégicas contra outros jogadores ou contra a IA.

## Instalação

### Pré-requisitos

Certifique-se de ter **Node.js** e gerenciador de pacotes node de preferência **pnpm** mas pode ser **npm** instalados em seu sistema.

### Passo a Passo

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/jogo-multiplayer-turno.git
   ```

2. Navegue para o diretório do projeto::

   ```bash
   cd vuejs-turnbased-game
   ```

3. Instale as dependências:

   ```bash
   pnpm install

   ```

4. Rode os teste e2e com cypres (Opcional):

   ```bash
   pnpm test:e2e:dev

   ```

5. Inicie o servidor de desenvolvimento:

   ```bash
   pnpm dev

   ```

6. Abra o navegador e acesse <http://localhost:5173>.

## Estrutura do Projeto

- **src/**: Diretório principal do código fonte.
  - **assets/**: Arquivos estáticos, como imagens, fontes, etc.
  - **components/**: Componentes Vue reutilizáveis.
  - **errorHandlers/**: Funções e módulos para tratamento de erros.
    - **signUpHandlers.ts**: Módulo específico para tratamento de erros relacionados ao cadastro de usuários.
  - **router/**: Configuração das rotas do Vue Router.
    - **index.ts**: Arquivo principal para configuração das rotas.
  - **services/**: Serviços para interação com o backend.
    - **api.ts**: Configurações e funções para chamadas de API.
  - **stores/**: Diretório de armazenamento de estado usando Pinia.
    - **auth.ts**: Gerenciamento de estado para autenticação de usuários.
    - **colyseus.ts**: Estado relacionado ao Colyseus, para gerenciamento de sessões de jogo.
    - **game.ts**: Estado principal do jogo, incluindo lógica de batalha e status dos personagens.
  - **types/**: Tipos TypeScript utilizados em várias partes do projeto.
  - **utils/**: Funções utilitárias para uso geral.
  - **views/**: Páginas principais do jogo, como login, criação de personagem, tela de batalha, etc.

## Contribuindo

Sinta-se à vontade para enviar issues e pull requests! Fique atento ao husky que só permite commits que obedeçam a essa estrutura:

````bash
  "feat(opcional): meu commit de uma nova feature"
  "chore(opcional): meu commit de configuração"
  "fix(opcional): meu commit de correção"
  "refactor(opcional): meu commit de refactor"
```

## Licença

Este projeto é licenciado sob a licença MIT. Consulte o arquivo LICENSE para mais informações.
````
