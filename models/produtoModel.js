/* 
Nome: Felipe de Oliveira Guimarães Bataglini
RA: 2475421
Turma: EC48B - C81
*/

// models/produtoModel.js
const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome do produto é obrigatório.'],
        trim: true // Remove espaços em branco do início e fim
    },
    descricao: {
        type: String,
        required: [true, 'A descrição do produto é obrigatória.']
    },
    preco: {
        type: Number,
        required: [true, 'O preço do produto é obrigatório.'],
        min: [0.01, 'O preço deve ser maior que zero.']
    },
    quantidadeEstoque: {
        type: Number,
        required: [true, 'A quantidade em estoque é obrigatória.'],
        min: [0, 'O estoque não pode ser negativo.']
    },
    categoria: {
        type: String,
        required: [true, 'A categoria é obrigatória.'],
        trim: true
    }
}, { timestamps: true });

const Produto = mongoose.model('Produto', produtoSchema);
module.exports = Produto;