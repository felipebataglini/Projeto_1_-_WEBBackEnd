/* 
Nome: Felipe de Oliveira Guimarães Bataglini
RA: 2475421
Turma: EC48B - C81
*/

// models/pedidoModel.js
const mongoose = require('mongoose');

const itemPedidoSchema = new mongoose.Schema({
    produtoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
        required: true
    },
    nomeProduto: String,
    quantidade: {
        type: Number,
        required: true,
        min: [1, 'A quantidade mínima de um item é 1.']
    },
    precoUnitario: {
        type: Number,
        required: true
    }
}, { _id: false }); // _id: false para não criar IDs para subdocumentos

const pedidoSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    itens: [itemPedidoSchema],
    valorTotal: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Processando', 'Enviado', 'Entregue', 'Cancelado'],
        default: 'Processando'
    },
    enderecoEntrega: {
        rua: String,
        numero: String,
        cidade: String,
        estado: String,
        cep: String
    }
}, { timestamps: true });

const Pedido = mongoose.model('Pedido', pedidoSchema);
module.exports = Pedido;