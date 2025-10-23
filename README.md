# Projeto 1 - E-commerce API
Este projeto consiste em uma API back-end para um sistema de e-commerce, desenvolvida como Projeto 1 da disciplina de **Programação Web Back-End**. A aplicação foi construída utilizando Node.js, com MongoDB como banco de dados.

## Funcionalidades Principais
* **Gerenciamento de Produtos:** API completa com operações de Criar, Ler, Atualizar e Deletar (CRUD) produtos.
* **Gerenciamento de Clientes:** Endpoint para registro de novos clientes com armazenamento seguro de senhas (hash).
* **Sistema de Pedidos:** Lógica para criação de pedidos, vinculando clientes a produtos, com validação de estoque.
* **Validação de Dados:** Verificação de campos obrigatórios em todas as rotas de criação e atualização.
* **Log de Erros:** Sistema robusto que captura e armazena todas as exceções em um arquivo `error.txt` para facilitar a depuração.

## Tecnologias Utilizadas
* **Node.js:** Ambiente de execução do lado do servidor.
* **MongoDB:** Banco de dados NoSQL para armazenamento dos dados.
* **Mongoose:** Biblioteca para modelagem de objetos do MongoDB.
* **bcrypt:** Biblioteca para hashing de senhas.
* **dotenv:** Para gerenciamento de variáveis de ambiente.

## Instalação e Execução
Siga os passos abaixo para executar o projeto localmente.

### 1. Pré-requisitos
* [Node.js](https://nodejs.org/) (versão 14 ou superior)
* [MongoDB](https://www.mongodb.com/try/download/community) rodando na sua máquina.

### 2. Clone o Repositório
```sh
git clone https://github.com/felipebataglini/Projeto_1_-_WEBBackEnd
cd <nome-da-pasta>
```

### 3. Instale as Dependências
Execute o comando abaixo na pasta raiz do projeto para instalar as bibliotecas necessárias.
```sh
npm install
```

### 4. Configure as Variáveis de Ambiente
Crie um arquivo chamado .env na raiz do projeto e adicione o seguinte conteúdo. Você pode alterar os valores se sua configuração for diferente.
```sh
# Configuração do Banco de Dados
DB_HOST=localhost
DB_PORT=27017
DB_NAME=ecommerceDB

# Configuração do Servidor
PORT=3000
```

### 5. Iniciando o teste
Para rodar o teste completo da API, execute o comando abaixo no terminal, dentro da pasta raiz do projeto.
```sh
node app.js
```