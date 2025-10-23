/* 
Nome: Felipe de Oliveira Guimarães Bataglini
RA: 2475421
Turma: EC48B - C81
*/

// Logger.js
const fs = require('fs');

class Logger {
  /**
   * Registra um erro em error.log.
   * @param {Error} error - O objeto de erro a ser registrado.
   */
  static logError(error) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] - ERROR: ${error.message}\nSTACK: ${error.stack}\n\n`;

    fs.appendFile('error.log', logMessage, (err) => {
      if (err) {
        console.error('Falha CRÍTICA ao escrever no arquivo de log:', err);
      }
    });
    // Também exibe o erro no console para feedback imediato
    console.error(`Erro capturado: ${error.message}`);
  }
}

module.exports = Logger;