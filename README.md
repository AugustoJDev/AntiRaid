# ![poppy](https://cdn.glitch.com/d5849b6d-b525-43f0-a87c-280ff619d588%2FWebp.net-resizeimage%20(2).png?v=1627787432690) AntiRaid com Mongoose e MegaDB ![poppy](https://cdn.glitch.com/d5849b6d-b525-43f0-a87c-280ff619d588%2FWebp.net-resizeimage%20(2).png?v=1627787432690)
Uma source simples e aberta de Anti Raid criada para auxiliar os usuários com a proteção de seus servidores. Esse projeto possui também um sistema exclusivo de exceções, em que o dono do servidor pode adicionar usuários para usarem seus comandos **não principais** através do comando `/antiraid exception <user>`, e a lista de exceções adicionadas pelo comando `/antiraid list`.

### 📁 Sessões
- 📦 [Dependências](#dependences)
- 📜 [Como Usar](#how-to-use)
- 🔧 [Comandos](#commands)
- ⚠ [Atenção](#danger)

<a name="dependences"></a>
### 📦 Dependências
Nome | Versão | Download |
--------- | ------ | ------ |
[@discordjs/builders](https://www.npmjs.com/package/@discordjs/builders/v/0.13.0) | 0.13.0 | @discordjs/builders@0.13.0 |
[@discordjs/rest](https://www.npmjs.com/package/@discordjs/rest/v/0.2.0-canary.0) | 0.2.0-canary.0 | @discordjs/rest@0.2.0-canary.0 |
[colors](https://www.npmjs.com/package/colors/v/1.4.0) | 1.4.0 | colors@1.4.0 |
[discord-api-types](https://www.npmjs.com/package/discord-api-types/v/0.33.0) | 0.33.0 | discord-api-types@0.33.0 |
[discord.js](https://www.npmjs.com/package/discord.js/v/13.1.0) | 13.1.0 | discord.js@13.1.0 |
[dotenv](https://www.npmjs.com/package/dotenv/v/11.0.0) | 11.0.0 | dotenv@11.0.0 |
[express](https://www.npmjs.com/package/express/v/4.18.1) | 4.18.1 | express@4.18.1 |
[megadb](https://www.npmjs.com/package/megadb/v/3.4.0) | 3.4.0 | megadb@3.4.0 |
[mongoose](https://www.npmjs.com/package/mongoose/v/6.3.3) | 6.3.3 | mongoose@6.3.3 |
[ms](https://www.npmjs.com/package/ms/v/2.1.3) | 2.1.3 | ms@2.1.3 |
[table](https://www.npmjs.com/package/table/v/6.8.0) | 6.8.0 | table@6.8.0 |

<a name="how-to-use"></a>
### 📜 Como Usar
Primeiramente, vamos começar fornecendo as informações que precisaremos na `.env`. Nela, terão os 2 campos:
```enviroments
TOKEN=
URI=
```
Em `TOKEN`, você deve colar a token do seu bot, por exemplo:
```enviroments
TOKEN=OTgxMkYzMTQ0GjM4MzUwJQZ7.GT33eA.LRzirErli3GQfhQWYCUTeALNJv3-ZrtPOivs9A0
```
Já em `URI`, coloque o link de acesso ao seu cluster da [MongoDB](https://cloud.mongodb.com/), por exemplo:
```enviroments
URI=mongodb+srv://kamai:muitobonito@whatsapp.gravy.mongodb.net/?retryWrites=true&w=majority
```
Após configurar isso, basta ligar o bot e começar o uso do modo que desejar.

<a name="commands"></a>
### 🔧 Comandos
A lista de todos os comandos disponíveis no bot pode ser acessada através do comando `/ajuda`.</br>
Você pode acessar o painel de módulos usando o comando `/painel`. Nesse painel estão as informações dos módulos de proteção, como o status deles ( ligado/desligado ), o limite de usuários que podem ser banidos antes de uma punição de ban/kick ser ativada, entre outras coisas.</br>
Caso haja algum comando que apresente problemas, entre em contato pela aba de issues, listando as seguintes coisa:
- Comando
- Erro
Após o envio dessas informações, aguarde um período de 24 horas para ter resposta sobre o erro ocorrido, junto da correção do mesmo.

<a name="danger"></a>
### ⚠ Atenção
Após a liberação dos Sponsors, quando a meta de 5 apoiadores for batida, será liberado um painel web do módulo anti raid totalmente **open source**, para você e seus amigos usarem do modo que desejarem em seus projetos. Então após a liberação, torne-se um apoiador para que o projeto seja liberado o quanto antes!
