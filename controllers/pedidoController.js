// controllers/pedidoController.js
const Pedido = require('../models/pedidoModel');
const Produto = require('../models/produtoModel');
const Cliente = require('../models/clienteModel');

/**
 * Cria um novo pedido.
 * @param {object} dadosPedido - Dados do pedido ({ clienteId, itens, enderecoEntrega }).
 * @returns {Promise<object>} O documento do pedido salvo.
 */
async function createPedido(dadosPedido) {
  const { cliente: clienteId, itens } = dadosPedido;

  // 1. Validar se o cliente existe
  const cliente = await Cliente.findById(clienteId);
  if (!cliente) {
    throw new Error('Cliente não encontrado.');
  }

  let valorTotal = 0;
  const itensProcessados = [];

  // 2. Processar cada item do pedido
  for (const item of itens) {
    const produto = await Produto.findById(item.produtoId);

    if (!produto) {
      throw new Error(`Produto com ID ${item.produtoId} não encontrado.`);
    }

    if (produto.quantidadeEstoque < item.quantidade) {
      throw new Error(`Estoque insuficiente para o produto: ${produto.nome}.`);
    }

    // 3. Decrementar o estoque
    produto.quantidadeEstoque -= item.quantidade;
    await produto.save();

    // 4. Calcular o subtotal e o valor total
    const subtotal = item.quantidade * produto.preco;
    valorTotal += subtotal;

    itensProcessados.push({
      produtoId: item.produtoId,
      nomeProduto: produto.nome,
      quantidade: item.quantidade,
      precoUnitario: produto.preco,
    });
  }

  // 5. Criar o pedido com os dados processados
  const novoPedido = new Pedido({
    cliente: clienteId,
    itens: itensProcessados,
    valorTotal: valorTotal,
    status: 'Processando', // Status inicial
    enderecoEntrega: dadosPedido.enderecoEntrega || cliente.endereco, // Usa o endereço do pedido ou o do cliente
  });

  return await novoPedido.save();
}

/**
 * Busca todos os pedidos de um cliente específico.
 * @param {string} clienteId - O ID do cliente.
 * @returns {Promise<Array<object>>} Uma lista de pedidos do cliente.
 */
async function getPedidosByCliente(clienteId) {
  return await Pedido.find({ cliente: clienteId }).populate('itens.produtoId', 'nome preco');
}

module.exports = {
  createPedido,
  getPedidosByCliente,
};