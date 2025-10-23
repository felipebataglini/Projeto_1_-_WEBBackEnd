/* 
Nome: Felipe de Oliveira Guimarães Bataglini
RA: 2475421
Turma: EC48B - C81
*/

// classes/Cliente.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Logger = require('../Logger');

// 1. Schema do Mongoose
const clienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é um campo obrigatório.'],
  },
  email: {
    type: String,
    required: [true, 'O email é um campo obrigatório.'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'A senha é um campo obrigatório.'],
    select: false, // Não retorna a senha em buscas por padrão
  },
  endereco: {
    rua: String,
    numero: String,
    cidade: String,
    estado: String,
    cep: String,
  },
}, { timestamps: true });

// Hook (middleware) do Mongoose para fazer o hash da senha ANTES de salvar
clienteSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    Logger.logError(error);
    next(error);
  }
});

const ClienteModel = mongoose.model('Cliente', clienteSchema);

// 2. Classe de Gerenciamento
class Cliente {
  constructor(dados) {
    // Validação de campos obrigatórios
    const requiredFields = ['nome', 'email', 'password'];
    const missingFields = requiredFields.filter(field => !dados[field]);
    if (missingFields.length > 0) {
      throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
    }
    this.dados = dados;
  }

  // CREATE
  async salvar() {
    try {
      // Verifica se o email já existe
      const emailExistente = await ClienteModel.findOne({ email: this.dados.email });
      if (emailExistente) {
        throw new Error('Este email já está cadastrado.');
      }
      const cliente = new ClienteModel(this.dados);
      return await cliente.save();
    } catch (error) {
      Logger.logError(error);
      throw error;
    }
  }

  // READ (todos)
  static async buscarTodos() {
    try {
      // O campo 'password' não será retornado por causa do 'select: false' no Schema
      return await ClienteModel.find();
    } catch (error) {
      Logger.logError(error);
      throw error;
    }
  }

  // READ (por ID)
  static async buscarPorId(id) {
    try {
      return await ClienteModel.findById(id);
    } catch (error) {
      Logger.logError(error);
      throw error;
    }
  }

  // UPDATE
  static async atualizar(id, dados) {
    try {
      // Se a senha estiver sendo atualizada, ela precisa ser hasheada
      if (dados.password) {
        dados.password = await bcrypt.hash(dados.password, 12);
      }
      return await ClienteModel.findByIdAndUpdate(id, dados, { new: true });
    } catch (error) {
      Logger.logError(error);
      throw error;
    }
  }

  // DELETE
  static async deletar(id) {
    try {
      return await ClienteModel.findByIdAndDelete(id);
    } catch (error) {
      Logger.logError(error);
      throw error;
    }
  }
}

module.exports = Cliente;