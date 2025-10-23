/* 
Nome: Felipe de Oliveira Guimarães Bataglini
RA: 2475421
Turma: EC48B - C81
*/

// classes/Produto.js
const mongoose = require('mongoose');
const Logger = require('../Logger');

// O Schema do Mongoose define a estrutura no banco
const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  preco: { type: Number, required: true },
  quantidadeEstoque: { type: Number, required: true },
  categoria: { type: String, required: true },
}, { timestamps: true });

const ProdutoModel = mongoose.model('Produto', produtoSchema);

// A classe gerencia as operações de CRUD
class Produto {
  constructor(dados) {
    // Validação de campos obrigatórios no construtor
    const requiredFields = ['nome', 'descricao', 'preco', 'quantidadeEstoque', 'categoria'];
    const missingFields = requiredFields.filter(field => !dados[field]);
    if (missingFields.length > 0) {
      throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
    }
    this.dados = dados;
  }

  // CREATE
  async salvar() {
    try {
      const produto = new ProdutoModel(this.dados);
      return await produto.save();
    } catch (error) {
      Logger.logError(error);
      throw error;
    }
  }

  // READ (todos)
  static async buscarTodos() {
    try {
      return await ProdutoModel.find();
    } catch (error) {
      Logger.logError(error);
      throw error;
    }
  }

  // READ (por ID)
  static async buscarPorId(id) {
    try {
      return await ProdutoModel.findById(id);
    } catch (error) {
      Logger.logError(error);
      throw error;
    }
  }

  // UPDATE
  static async atualizar(id, dados) {
    try {
      return await ProdutoModel.findByIdAndUpdate(id, dados, { new: true });
    } catch (error) {
      Logger.logError(error);
      throw error;
    }
  }

  // DELETE
  static async deletar(id) {
    try {
      return await ProdutoModel.findByIdAndDelete(id);
    } catch (error) {
      Logger.logError(error);
      throw error;
    }
  }
}

module.exports = Produto;