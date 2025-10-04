/* 
Nome: Felipe de Oliveira Guimarães Bataglini
RA: 2475421
Turma: EC48B - C81
*/

// routes/clienteRoutes.js
const clienteController = require('../controllers/clienteController');
const { getPostData } = require('../utils/utils');
const { logError } = require('../middlewares/errorLogger'); // IMPORTS ADICIONADOS
const { validateFields } = require('../middlewares/validateFields'); // IMPORTS ADICIONADOS

async function clienteRoutes(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;
  const id = pathname.split('/')[3];

  if (pathname === '/api/clientes/registrar' && method === 'POST') {
    try {
      const body = await getPostData(req);
      const clienteData = JSON.parse(body);

      // USO DA VALIDAÇÃO
      validateFields(clienteData, ['nome', 'email', 'password']);

      const novoCliente = await clienteController.registerCliente(clienteData);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(novoCliente));
    } catch (error) {
      // USO DO LOG DE ERRO
      logError(error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (pathname.startsWith('/api/clientes/') && method === 'GET' && id) {
    try {
      const cliente = await clienteController.getClienteById(id);
      if (cliente) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cliente));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Cliente não encontrado.' }));
      }
    } catch (error) {
      // USO DO LOG DE ERRO
      logError(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao buscar cliente.' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota de clientes não encontrada.' }));
  }
}

module.exports = clienteRoutes;