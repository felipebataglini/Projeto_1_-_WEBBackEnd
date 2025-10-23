/* 
Nome: Felipe de Oliveira Guimarães Bataglini
RA: 2475421
Turma: EC48B - C81
*/

// classes/Pedido.js
const mongoose = require('mongoose');
const Logger = require('../Logger');

// Importa as *outras classes* para usar seus métodos estáticos
const Produto = require('./Produto');
const Cliente = require('./Cliente');

// 1. Schemas do Mongoose
const itemPedidoSchema = new mongoose.Schema({
  produtoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto',
    required: true,
  },
  nomeProduto: String,
  quantidade: {
    type: Number,
    required: true,
    min: [1, 'A quantidade mínima é 1.'],
  },
  precoUnitario: {
    type: Number,
    required: true,
  },
}, { _id: false });

const pedidoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true,
  },
  itens: [itemPedidoSchema],
  valorTotal: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Processando', 'Enviado', 'Entregue', 'Cancelado'],
    default: 'Processando',
  },
  enderecoEntrega: {
    rua: String,
    numero: String,
    cidade: String,
    estado: String,
    cep: String,
  },
}, { timestamps: true });

const PedidoModel = mongoose.model('Pedido', pedidoSchema);

// 2. Classe de Gerenciamento
class Pedido {
  constructor(dados) {
    // Validação de campos obrigatórios
    const requiredFields = ['cliente', 'itens'];
    const missingFields = requiredFields.filter(field => !dados[field]);
    if (missingFields.length > 0) {
      throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
    }
    if (!Array.isArray(dados.itens) || dados.itens.length === 0) {
        throw new Error('O campo "itens" é obrigatório e deve conter produtos.');
    }
    this.dados = dados;
  }

  // CREATE
  async salvar() {
    try {
      const { cliente: clienteId, itens } = this.dados;

      // 1. Validar se o cliente existe
      const cliente = await Cliente.buscarPorId(clienteId);
      if (!cliente) {
        throw new Error('Cliente não encontrado.');
      }

      let valorTotal = 0;
      const itensProcessados = [];

      // 2. Processar cada item do pedido
      for (const item of itens) {
        const produto = await Produto.buscarPorId(item.produtoId);

        if (!produto) {
          throw new Error(`Produto com ID ${item.produtoId} não encontrado.`);
        }
        if (produto.quantidadeEstoque < item.quantidade) {
          throw new Error(`Estoque insuficiente para o produto: ${produto.nome}.`);
        }

        // 3. Decrementar o estoque (usando o método da classe Produto)
        const novoEstoque = produto.quantidadeEstoque - item.quantidade;
        await Produto.atualizar(produto._id, { quantidadeEstoque: novoEstoque });

        // 4. Calcular totais
        valorTotal += item.quantidade * produto.preco;
        itensProcessados.push({
          produtoId: item.produtoId,
          nomeProduto: produto.nome,
          quantidade: item.quantidade,
          precoUnitario: produto.preco,
        });
      }

      // 5. Criar o pedido
      const dadosPedido = {
        ...this.dados,
        itens: itensProcessados,
        valorTotal: valorTotal,
        enderecoEntrega: this.dados.enderecoEntrega || cliente.endereco,
      };

      const pedido = new PedidoModel(dadosPedido);
      return await pedido.save();

    } catch (error) {
      Logger.logError(error);
      throw error;
      // IMPORTANTE: Em um cenário real, precisaríamos de uma "transação"
      // para reverter as atualizações de estoque se algo falhar aqui.
      // Para este projeto, o fluxo linear é suficiente.
    }
  }

  // READ (todos)
  static async buscarTodos() {
    try {
      return await PedidoModel.find().populate('cliente', 'nome email');
    } catch (error) {
      Logger.logError(error);
      throw error;
    }
  }

  // READ (por ID)
  static async buscarPorId(id) {
    try {
      return await PedidoModel.findById(id).populate('cliente', 'nome email');
    } catch (error) {
      Logger.logError(error);
      throw error;
    }
  }
  
  // READ (customizado por cliente)
  static async buscarPorCliente(clienteId) {
    try {
      return await PedidoModel.find({ cliente: clienteId });
    } catch (error) {
      Logger.logError(error);
      throw error;
    }
  }

  // UPDATE (ex: atualizar status do pedido)
  static async atualizar(id, dados) {
    try {
      // Este método não deve permitir alterar itens ou valores, apenas status ou endereço
      const dadosPermitidos = {
          status: dados.status,
          enderecoEntrega: dados.enderecoEntrega
      };
      return await PedidoModel.findByIdAndUpdate(id, dadosPermitidos, { new: true });
    } catch (error) {
      Logger.logError(error);
      throw error;
    }
  }

  // DELETE
  static async deletar(id) {
    try {
      return await PedidoModel.findByIdAndDelete(id);
    } catch (error) {
      Logger.logError(error);
      throw error;
    }
  }
}

module.exports = Pedido;