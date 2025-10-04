// routes/pedidoRoutes.js
const pedidoController = require('../controllers/pedidoController');
const { getPostData } = require('../utils/utils');
const { logError } = require('../middlewares/errorLogger'); // IMPORTS ADICIONADOS
const { validateFields } = require('../middlewares/validateFields'); // IMPORTS ADICIONADOS

async function pedidoRoutes(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;
  const clienteId = pathname.split('/')[4]; 

  if (pathname === '/api/pedidos' && method === 'POST') {
    try {
      const body = await getPostData(req);
      const pedidoData = JSON.parse(body);

      // USO DA VALIDAÇÃO
      validateFields(pedidoData, ['cliente', 'itens']);
      if (!Array.isArray(pedidoData.itens) || pedidoData.itens.length === 0) {
        throw new Error('O campo "itens" é obrigatório e deve ser uma lista de produtos.');
      }

      const novoPedido = await pedidoController.createPedido(pedidoData);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(novoPedido));
    } catch (error) {
      // USO DO LOG DE ERRO
      logError(error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (pathname.startsWith('/api/pedidos/cliente/') && method === 'GET' && clienteId) {
    try {
      const pedidos = await pedidoController.getPedidosByCliente(clienteId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(pedidos));
    } catch (error) {
      // USO DO LOG DE ERRO
      logError(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao listar pedidos.' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota de pedidos não encontrada.' }));
  }
}

module.exports = pedidoRoutes;