/* 
Nome: Felipe de Oliveira Guimarães Bataglini
RA: 2475421
Turma: EC48B - C81
*/

// database.js
const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
  try {
    const dbURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    await mongoose.connect(dbURI);
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (err) {
    console.error("Erro na conexão com o MongoDB:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;