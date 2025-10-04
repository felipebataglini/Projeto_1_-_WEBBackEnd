# Projeto 1 - E-commerce API
Este projeto consiste em uma API back-end para um sistema de e-commerce, desenvolvida como Projeto 1 da disciplina de **Programação Web Back-End**. A aplicação foi construída utilizando Node.js, com MongoDB como banco de dados.

## Funcionalidades Principais
* **Gerenciamento de Produtos:** API completa com operações de Criar, Ler, Atualizar e Deletar (CRUD) produtos.
* **Gerenciamento de Clientes:** Endpoint para registro de novos clientes com armazenamento seguro de senhas (hash).
* **Sistema de Pedidos:** Lógica para criação de pedidos, vinculando clientes a produtos, com validação de estoque.
* **Validação de Dados:** Verificação de campos obrigatórios em todas as rotas de criação e atualização.
* **Log de Erros:** Sistema robusto que captura e armazena todas as exceções em um arquivo `error.log` para facilitar a depuração.

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
Caso o erro `Cannot find module 'dotenv'` ocorra, basta instalar a biblioteca na pasta raiz do projeto utilizando o comando abaixo.
```sh
npm install dotenv
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

### 5. Inicie o Servidor
Com o MongoDB em execução, inicie a aplicação com o seguinte comando:
```sh
npm start
```
Você deverá ver a mensagem `Servidor rodando em http://localhost:3000` no seu terminal.

## Testes
Utilize o cURL para testar os endpoints do projeto.

### Endpoints de produtos
#### Criar um novo produto
```sh
curl -X POST http://localhost:3000/api/produtos -H "Content-Type: application/json" -d "{\"nome\":\"Teclado Mecânico\",\"descricao\":\"Teclado com switches blue\",\"preco\":350,\"quantidadeEstoque\":25,\"categoria\":\"Periféricos\"}"
```
#### Listar todos os produtos
```sh
curl http://localhost:3000/api/produtos
```

#### Buscar um produto por ID
```sh
curl http://localhost:3000/api/produtos/ID_DO_PRODUTO
```

### Endpoints de Clientes
#### Registrar um novo cliente
```
curl -X POST http://localhost:3000/api/clientes/registrar -H "Content-Type: application/json" -d "{\"nome\":\"Maria Souza\",\"email\":\"maria@email.com\",\"password\":\"senhaForte123\",\"endereco\":{\"rua\":\"Rua das Flores\",\"numero\":\"123\",\"cidade\":\"São Paulo\",\"estado\":\"SP\",\"cep\":\"01234-567\"}}"
```

#### Buscar um cliente por ID
```
curl http://localhost:3000/api/clientes/ID_DO_CLIENTE
```

### Endpoints de pedidos
#### Criar um novo pedido
```
curl -X POST http://localhost:3000/api/pedidos -H "Content-Type: application/json" -d "{\"cliente\":\"ID_DO_CLIENTE\",\"itens\":[{\"produtoId\":\"ID_DO_PRODUTO\",\"quantidade\":2}]}"
```

#### Listar pedidos de um cliente
```
curl http://localhost:3000/api/pedidos/cliente/ID_DO_CLIENTE
```