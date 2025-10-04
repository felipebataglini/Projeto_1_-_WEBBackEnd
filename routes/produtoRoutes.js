/* 
Nome: Felipe de Oliveira Guimarães Bataglini
RA: 2475421
Turma: EC48B - C81
*/

// routes/produtoRoutes.js
const produtoController = require('../controllers/produtoController');
const { getPostData } = require('../utils/utils');
const { logError } = require('../middlewares/errorLogger');
const { validateFields } = require('../middlewares/validateFields');

async function produtoRoutes(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;
  const id = pathname.split('/')[3];

  if (pathname === '/api/produtos' && method === 'GET') {
    // ... (código para GET de todos os produtos, sem alterações)
  } else if (pathname === '/api/produtos' && method === 'POST') {
    try {
      const body = await getPostData(req);
      const produtoData = JSON.parse(body);

      // USO DA VALIDAÇÃO
      validateFields(produtoData, ['nome', 'descricao', 'preco', 'quantidadeEstoque', 'categoria']);

      const novoProduto = await produtoController.createProduto(produtoData);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(novoProduto));
    } catch (error) {
      // USO DO LOG DE ERRO
      logError(error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (pathname.startsWith('/api/produtos/') && method === 'GET' && id) {
    // ... (código para GET por ID, adicione logError no catch)
  } else if (pathname.startsWith('/api/produtos/') && method === 'PUT' && id) {
    // ... (código para PUT, adicione logError no catch)
  } else {
    // ...
  }
}

module.exports = produtoRoutes;