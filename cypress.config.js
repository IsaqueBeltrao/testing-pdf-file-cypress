// Importa a função readPDF do arquivo helper localizado em cypress/support/
// Esta função é responsável por ler e extrair texto de arquivos PDF
const { readPDF } = require("./cypress/support/helper");

// Exporta a configuração principal do Cypress
module.exports = {
  // Configuração específica para testes end-to-end (e2e)
  e2e: {
    // Função que configura eventos do Node.js para o Cypress
    // Parâmetros:
    // - on: função para registrar event listeners
    // - config: objeto de configuração do Cypress
    setupNodeEvents(on, config) {
      
      // Registra uma task customizada chamada 'readPDF'
      // Tasks são funções que rodam no processo Node.js (não no browser)
      // Úteis para operações que o browser não pode fazer (ler arquivos, acessar banco de dados, etc.)
      on('task', {
        readPDF  // Registra a função readPDF como uma task disponível nos testes
      })
      
      // Nota: Poderia retornar config se modificações fossem necessárias
      // return config;
    },
  },
};

