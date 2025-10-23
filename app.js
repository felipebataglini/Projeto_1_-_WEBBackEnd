/* 
Nome: Felipe de Oliveira Guimarães Bataglini
RA: 2475421
Turma: EC48B - C81
*/

// app.js
const mongoose = require('mongoose');
const connectDB = require('./database');
const Logger = require('./Logger');

// Importa as classes
const Cliente = require('./classes/Cliente');
const Produto = require('./classes/Produto');
const Pedido = require('./classes/Pedido');

async function main() {
  console.log('--- INICIANDO APLICAÇÃO DE TESTE ---');
  await connectDB();

  let clienteId, produtoId, pedidoId;

  try {
    // --- TESTE DA CLASSE CLIENTE ---
    console.log('\n--- INICIANDO TESTES DE CLIENTE ---');

    // 1. Criar Cliente
    console.log('\n1. Criando um novo cliente...');
    const dadosNovoCliente = {
      nome: 'Felipe Bataglini',
      email: `felipe.bataglini@teste${Date.now()}.com`, // Email único para cada teste
      password: 'senha123',
      endereco: { rua: 'Rua Teste', numero: '123', cidade: 'Teste', estado: 'TS', cep: '00000-000' }
    };
    const novoCliente = new Cliente(dadosNovoCliente);
    const clienteSalvo = await novoCliente.salvar();
    clienteId = clienteSalvo._id;
    console.log('Cliente salvo:', { _id: clienteSalvo._id, nome: clienteSalvo.nome, email: clienteSalvo.email });

    // 2. Buscar Cliente por ID
    console.log('\n2. Buscando cliente por ID...');
    const clienteEncontrado = await Cliente.buscarPorId(clienteId);
    console.log('Cliente encontrado:', clienteEncontrado);

    // 3. Atualizar Cliente
    console.log('\n3. Atualizando endereço do cliente...');
    const dadosUpdateCliente = { endereco: { cidade: 'Cidade Atualizada' } };
    const clienteAtualizado = await Cliente.atualizar(clienteId, dadosUpdateCliente);
    console.log('Cliente atualizado:', clienteAtualizado);

    // --- TESTE DA CLASSE PRODUTO ---
    console.log('\n--- INICIANDO TESTES DE PRODUTO ---');

    // 4. Criar Produto
    console.log('\n4. Criando um novo produto...');
    const dadosNovoProduto = {
      nome: 'Headset Gamer',
      descricao: 'Headset com microfone cancelador de ruído.',
      preco: 450,
      quantidadeEstoque: 30,
      categoria: 'Periféricos'
    };
    const novoProduto = new Produto(dadosNovoProduto);
    const produtoSalvo = await novoProduto.salvar();
    produtoId = produtoSalvo._id;
    console.log('Produto salvo:', produtoSalvo);

    // 5. Buscar Produto por ID
    console.log('\n5. Buscando produto por ID...');
    const produtoEncontrado = await Produto.buscarPorId(produtoId);
    console.log('Produto encontrado:', produtoEncontrado);

    // 6. Atualizar Produto
    console.log('\n6. Atualizando estoque do produto...');
    const dadosUpdateProduto = { quantidadeEstoque: 25 };
    const produtoAtualizado = await Produto.atualizar(produtoId, dadosUpdateProduto);
    console.log('Produto atualizado:', produtoAtualizado);
    
    // --- TESTE DA CLASSE PEDIDO ---
    console.log('\n--- INICIANDO TESTES DE PEDIDO ---');

    // 7. Criar Pedido
    console.log('\n7. Criando um novo pedido...');
    const dadosNovoPedido = {
      cliente: clienteId,
      itens: [
        { produtoId: produtoId, quantidade: 2 }
      ]
    };
    const novoPedido = new Pedido(dadosNovoPedido);
    const pedidoSalvo = await novoPedido.salvar();
    pedidoId = pedidoSalvo._id;
    console.log('Pedido salvo:', pedidoSalvo);
    console.log('Verificando se o estoque do produto foi atualizado...');
    const produtoAposPedido = await Produto.buscarPorId(produtoId);
    console.log('Novo estoque do produto:', produtoAposPedido.quantidadeEstoque);

    // 8. Buscar Pedido por Cliente
    console.log('\n8. Buscando pedidos do cliente Felipe Bataglini...');
    const pedidosCliente = await Pedido.buscarPorCliente(clienteId);
    console.log(`Pedidos encontrados (${pedidosCliente.length}):`, pedidosCliente);

    // 9. Atualizar Pedido
    console.log('\n9. Atualizando status do pedido...');
    const dadosUpdatePedido = { status: 'Enviado' };
    const pedidoAtualizado = await Pedido.atualizar(pedidoId, dadosUpdatePedido);
    console.log('Pedido atualizado:', pedidoAtualizado);

    // --- TESTE DE VALIDAÇÃO E LOG ---
    console.log('\n--- INICIANDO TESTE DE VALIDAÇÃO ---');
    console.log('\n10. Tentando criar produto com campos faltando (deve falhar)...');
    try {
      // O erro será lançado aqui mesmo, no construtor da classe
      const produtoFalho = new Produto({ nome: 'Produto Incompleto' }); 
      await produtoFalho.salvar();
    } catch (error) {
      // Como houve o erro, é chamado o logger
      Logger.logError(error); 
  
      console.log('Teste de falha bem-sucedido. Erro capturado:', error.message);
      console.log('Verifique o arquivo error.log para detalhes.');
    }

  } catch (error) {
    // Se um erro inesperado ocorrer, o Logger.js o capturará da classe
    console.error('\n--- OCORREU UM ERRO INESPERADO NA EXECUÇÃO PRINCIPAL ---');
    console.error(error.message);
    console.error('Verifique o error.log para a stack trace completa.');
  } finally {
    // --- LIMPEZA DOS DADOS DE TESTE ---
    // Sempre executa, mesmo se houver erros, para limpar o banco
    console.log('\n--- INICIANDO LIMPEZA DO BANCO DE DADOS ---');
    try {
      if (pedidoId) {
        await Pedido.deletar(pedidoId);
        console.log('Pedido de teste deletado.');
      }
      if (produtoId) {
        await Produto.deletar(produtoId);
        console.log('Produto de teste deletado.');
      }
      if (clienteId) {
        await Cliente.deletar(clienteId);
        console.log('Cliente de teste deletado.');
      }
    } catch (error) {
      console.error('Erro durante a limpeza do banco:', error.message);
      Logger.logError(error);
    }
    
    // Encerra a conexão
    await mongoose.connection.close();
    console.log('\nConexão com o MongoDB encerrada.');
    console.log('--- APLICAÇÃO DE TESTE CONCLUÍDA ---');
  }
}

// Executa a função principal
main();