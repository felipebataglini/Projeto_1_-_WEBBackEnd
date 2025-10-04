/* 
Nome: Felipe de Oliveira Guimarães Bataglini
RA: 2475421
Turma: EC48B - C81
*/

// middlewares/validateFields.js

/**
 * Valida a presença de campos obrigatórios em um objeto.
 * @param {object} body - O objeto a ser validado (corpo da requisição).
 * @param {Array<string>} requiredFields - Uma lista com os nomes dos campos obrigatórios.
 */
function validateFields(body, requiredFields) {
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
        // Lança um erro com a lista de campos ausentes
        throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
    }
}

module.exports = { validateFields };