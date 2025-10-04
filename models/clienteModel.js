// models/clienteModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const clienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome é um campo obrigatório.']
    },
    email: {
        type: String,
        required: [true, 'O email é um campo obrigatório.'],
        unique: true, // Garante que não hajam dois clientes com o mesmo email
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'A senha é um campo obrigatório.'],
        select: false // Não retorna a senha em consultas por padrão
    },
    endereco: {
        rua: String,
        numero: String,
        cidade: String,
        estado: String,
        cep: String
    }
}, { timestamps: true });

// Middleware (hook) do Mongoose que é executado ANTES de salvar o documento
clienteSchema.pre('save', async function(next) {
    // Se a senha não foi modificada, pula para o próximo middleware
    if (!this.isModified('password')) {
        return next();
    }
    // Gera o hash da senha com um custo de 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const Cliente = mongoose.model('Cliente', clienteSchema);
module.exports = Cliente;