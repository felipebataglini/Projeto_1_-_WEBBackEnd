// controllers/clienteController.js
const Cliente = require('../models/clienteModel');

/**
 * Registra um novo cliente. A senha é hasheada automaticamente pelo hook no model.
 * @param {object} dadosCliente - Dados do cliente (nome, email, password, endereco).
 * @returns {Promise<object>} O documento do cliente salvo.
 */
async function registerCliente(dadosCliente) {
  // Verifica se o email já está em uso
  const emailExistente = await Cliente.findOne({ email: dadosCliente.email });
  if (emailExistente) {
    // Lança um erro que será capturado pela camada de rota
    throw new Error('Este email já está cadastrado.');
  }

  const cliente = new Cliente(dadosCliente);
  await cliente.save();
  
  // Converte o documento Mongoose para um objeto JS para remover a senha
  const clienteObj = cliente.toObject();
  delete clienteObj.password;

  return clienteObj;
}

/**
 * Busca um cliente pelo seu ID. A senha não será retornada.
 * @param {string} id - O ID do cliente.
 * @returns {Promise<object|null>} O documento do cliente.
 */
async function getClienteById(id) {
    // O campo 'password' não será retornado por causa do 'select: false' no model
  return await Cliente.findById(id);
}

module.exports = {
  registerCliente,
  getClienteById,
};