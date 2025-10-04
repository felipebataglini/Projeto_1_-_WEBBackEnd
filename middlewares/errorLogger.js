/* 
Nome: Felipe de Oliveira Guimarães Bataglini
RA: 2475421
Turma: EC48B - C81
*/

// middlewares/errorLogger.js
const fs = require('fs');

function logError(error) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] - ERROR: ${error.message}\nSTACK: ${error.stack}\n\n`;

  fs.appendFile('error.log', logMessage, (err) => {
    if (err) {
      console.error('Falha ao escrever no arquivo de log:', err);
    }
  });
}

module.exports = { logError };