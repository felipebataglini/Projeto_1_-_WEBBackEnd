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

  // Rota para listar todos os produtos
  if (pathname === '/api/produtos' && method === 'GET') {
    try {
      const produtos = await produtoController.getAllProdutos();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(produtos));
    } catch (error) {
      logError(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro interno ao listar produtos.' }));
    }
  // Rota para criar um novo produto
  } else if (pathname === '/api/produtos' && method === 'POST') {
    try {
      const body = await getPostData(req);
      const produtoData = JSON.parse(body);
      validateFields(produtoData, ['nome', 'descricao', 'preco', 'quantidadeEstoque', 'categoria']);
      const novoProduto = await produtoController.createProduto(produtoData);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(novoProduto));
    } catch (error) {
      logError(error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  // Rota para buscar um produto por ID
  } else if (pathname.startsWith('/api/produtos/') && method === 'GET' && id) {
    try {
      const produto = await produtoController.getProdutoById(id);
      if (produto) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(produto));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Produto não encontrado.' }));
      }
    } catch (error) {
      logError(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro interno ao buscar o produto.' }));
    }
  // Rota para atualizar um produto
  } else if (pathname.startsWith('/api/produtos/') && method === 'PUT' && id) {
    try {
      const body = await getPostData(req);
      const produtoAtualizado = await produtoController.updateProduto(id, JSON.parse(body));
       if (produtoAtualizado) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(produtoAtualizado));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Produto não encontrado para atualização.' }));
      }
    } catch (error) {
        logError(error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
  // Rota não encontrada
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota de produtos não encontrada.' }));
  }
}

module.exports = produtoRoutes;