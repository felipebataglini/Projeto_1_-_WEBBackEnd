/* 
Nome: Felipe de Oliveira Guimarães Bataglini
RA: 2475421
Turma: EC48B - C81
*/

// controllers/produtoController.js
const Produto = require('../models/produtoModel');

/**
 * Cria um novo produto no banco de dados.
 * @param {object} dadosProduto - Os dados do produto a ser criado.
 * @returns {Promise<object>} O documento do produto salvo.
 */
async function createProduto(dadosProduto) {
  const produto = new Produto(dadosProduto);
  return await produto.save();
}

/**
 * Lista todos os produtos do banco de dados.
 * @returns {Promise<Array<object>>} Uma lista de todos os produtos.
 */
async function getAllProdutos() {
  return await Produto.find();
}

/**
 * Busca um produto pelo seu ID.
 * @param {string} id - O ID do produto.
 * @returns {Promise<object|null>} O documento do produto ou null se não for encontrado.
 */
async function getProdutoById(id) {
  return await Produto.findById(id);
}

/**
 * Atualiza um produto existente.
 * @param {string} id - O ID do produto a ser atualizado.
 * @param {object} dadosAtualizacao - Os campos a serem atualizados.
 * @returns {Promise<object|null>} O documento do produto atualizado.
 */
async function updateProduto(id, dadosAtualizacao) {
  // { new: true } garante que o objeto retornado seja a versão atualizada.
  return await Produto.findByIdAndUpdate(id, dadosAtualizacao, { new: true, runValidators: true });
}

/**
 * Deleta um produto do banco de dados.
 * @param {string} id - O ID do produto a ser deletado.
 * @returns {Promise<object|null>} O documento do produto que foi deletado.
 */
async function deleteProduto(id) {
  return await Produto.findByIdAndDelete(id);
}

module.exports = {
  createProduto,
  getAllProdutos,
  getProdutoById,
  updateProduto,
  deleteProduto,
};