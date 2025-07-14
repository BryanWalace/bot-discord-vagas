# Bot de Vagas para Discord

Um bot para Discord focado em automatizar a busca e o anúncio de vagas de emprego, diretamente no seu servidor.

## ✨ Sobre o Projeto

Este bot foi criado para centralizar e automatizar a busca por oportunidades de emprego, utilizando técnicas de web scraping para coletar dados de portais de vagas. O objetivo é manter a comunidade atualizada com as últimas oportunidades, de forma configurável e inteligente.

Atualmente, o bot extrai dados do **Vagas.com.br**.

## 🚀 Funcionalidades

-   **Busca Manual:** Busque vagas instantaneamente com comandos simples.
-   **Busca Completa:** Opção para listar todas as vagas encontradas em uma busca.
-   **Configuração Interativa:** Um comando de administrador (`!vagas day`) que abre uma interface com menus e um formulário pop-up (modal) para configurar:
    - O canal de postagem automática.
    - O horário para o envio diário.
    - As palavras-chave para a busca.
-   **Agendamento Preciso:** Utiliza `node-cron` para realizar as buscas automáticas no horário exato definido pelo usuário.
-   **Mensagem de Boas-Vindas:** Apresenta-se automaticamente com instruções ao ser adicionado a um novo servidor.
-   **Comando de Ajuda:** Um comando `!help` que exibe as funcionalidades para qualquer usuário.

## 🛠️ Tecnologias Utilizadas

-   [Node.js](https://nodejs.org/en/)
-   [Discord.js](https://discord.js.org/)
-   [Axios](https://axios-http.com/)
-   [Cheerio](https://cheerio.js.org/)
-   [Node-Cron](https://www.npmjs.com/package/node-cron)
-   [Dotenv](https://www.npmjs.com/package/dotenv)

---

## ⚙️ Instalação e Configuração

Siga os passos abaixo para executar o bot em seu próprio ambiente.

### Pré-requisitos

-   **Node.js:** Versão 16.9.0 ou superior.
-   **Conta de Bot no Discord:** Você precisa ter uma aplicação e um token de bot gerados no [Portal de Desenvolvedores do Discord](https://discord.com/developers/applications).

### Passo a Passo

1.  **Clone o Repositório**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd [NOME_DA_PASTA_DO_PROJETO]
    ```

2.  **Instale as Dependências**
    Execute o comando abaixo na pasta do projeto para instalar todas as bibliotecas necessárias.
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente**
    Crie um arquivo chamado `.env` na raiz do projeto. Este arquivo guardará suas chaves secretas. Copie o conteúdo abaixo e substitua pelos seus valores.

    ```env
    # Token do seu bot, obtido no Portal de Desenvolvedores do Discord
    DISCORD_TOKEN=SEU_TOKEN_SUPER_SECRETO_AQUI

    # (Opcional) Chave de API do ScraperAPI, caso queira reintegrar no futuro
    SCRAPER_API_KEY=SUA_CHAVE_DE_API_AQUI
    ```

---

## ▶️ Como Executar

Após a instalação e configuração, inicie o bot com o seguinte comando no terminal:

```bash
node index.js

Se tudo estiver correto, você verá a mensagem:

> ✅ Bot pronto! Logado como `SeuBot#1234` no console.

---

## 🤖 Comandos Disponíveis

| Comando              | Permissão | Descrição                                                                 |
|----------------------|-----------|---------------------------------------------------------------------------|
| `!help`              | Todos     | Mostra uma mensagem de ajuda com a lista de todos os comandos.            |
| `!vagas <termo>`     | Todos     | Faz uma busca rápida pelas 5 vagas mais recentes para o termo pesquisado. Ex: `!vagas programador php` |
| `!vagasAll <termo>`  | Todos     | Busca e exibe **TODAS** as vagas encontradas para o termo. _Use com moderação para não poluir o chat!_ |
| `!vagas day`         | Admin     | Abre o menu interativo para configurar ou atualizar as postagens automáticas e diárias de vagas no servidor. |


---

## 📜 Histórico de Versões (Changelog)

### v1.0.0 (14/07/2025)
- **FEATURE:** Adicionado comando `!help`.
- **FEATURE:** Mensagem de boas-vindas ao entrar em um servidor.
- **REFACTOR:** Código reestruturado em pastas (`commands`, `events`, `services`).
- **FIX:** Corrigido bug de 45 caracteres no label do Modal de configuração.

### v0.8.0
- **FEATURE:** Comando `!vagasAll` para buscas sem limite.
- **FEATURE:** Interface do `!vagas day` permite configuração de palavras-chave via Modal.
- **FEATURE:** Seletor de horário adicionado ao `!vagas day`.
- **UPGRADE:** Agendamento migrado de `setInterval` para `node-cron`.

### v0.5.0
- **FEATURE:** Comando de configuração `!vagas day` com menus e botões.
- **FEATURE:** Implementada busca automática agendada.

### v0.2.0
- **FEATURE:** Scraper para o site [Vagas.com.br](https://www.vagas.com.br).
- **FEATURE:** Comando manual `!vagas <termo>`.

### v0.1.0
- **INIT:** Estrutura inicial do projeto com `discord.js` e conexão do bot.

---

## 📝 Licença

Distribuído sob a Licença MIT.

```text
MIT License

Copyright (c) 2025 [Nome Completo do Autor]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.