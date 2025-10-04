/* 
Nome: Felipe de Oliveira Guimarães Bataglini
RA: 2475421
Turma: EC48B - C81
*/

// app.js
const http = require('http');
const connectDB = require('./config/database');
require('dotenv').config();

// Importa os roteadores
const produtoRoutes = require('./routes/produtoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

// Conecta ao banco de dados
connectDB();

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  res.setHeader('Content-Type', 'application/json');

  // Lógica de roteamento principal
  if (pathname.startsWith('/api/produtos')) {
    produtoRoutes(req, res);
  } else if (pathname.startsWith('/api/clientes')) {
    clienteRoutes(req, res);
  } else if (pathname.startsWith('/api/pedidos')) {
    pedidoRoutes(req, res);
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  }
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});