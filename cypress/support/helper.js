// Importa a biblioteca pdf-parse para extrair texto de arquivos PDF
// Esta biblioteca converte o conteúdo binário do PDF em texto legível
const pdf = require('pdf-parse')

// Importa o módulo path do Node.js para manipulação de caminhos de arquivos
// Garante compatibilidade entre diferentes sistemas operacionais (Windows/Linux/Mac)
const path = require('path')

// Importa o módulo fs (file system) do Node.js para operações de arquivo
// Permite ler arquivos do sistema de forma síncrona ou assíncrona
const fs = require('fs')

/**
 * Função para ler e extrair texto de arquivos PDF
 * @param {string} pathToPdf - Caminho relativo ou absoluto para o arquivo PDF
 * @returns {Promise<string>} - Promise que resolve com o texto extraído do PDF
 */
const readPDF = (pathToPdf) => {
    // Retorna uma Promise para operação assíncrona
    // Permite que o Cypress aguarde a conclusão da leitura do PDF
    return new Promise((resolve) => {
        
        // Converte o caminho fornecido em um caminho absoluto
        // path.resolve() garante que o caminho seja válido independente do diretório atual
        const pdfPath = path.resolve(pathToPdf)
        
        // Lê o arquivo PDF de forma síncrona como buffer binário
        // fs.readFileSync() carrega todo o conteúdo do arquivo na memória
        const pdfData = fs.readFileSync(pdfPath)
        
        // Processa o buffer do PDF usando a biblioteca pdf-parse
        // pdf() é uma função assíncrona que extrai o texto do PDF
        pdf(pdfData)
            .then(function ({ text }) {
                // Desestruturação: extrai apenas a propriedade 'text' do resultado
                // O objeto retornado por pdf-parse contém: { text, numpages, numrender, info, metadata }
                
                // Resolve a Promise com o texto extraído
                // Este texto será retornado para o teste Cypress
                resolve(text)
            })
            // Nota: Não há tratamento de erro (.catch())
            // Em caso de falha, a Promise ficará pendente indefinidamente
    })
}

// Exporta a função readPDF para ser usada em outros arquivos
// Permite importação via: const { readPDF } = require('./helper')
module.exports = { readPDF }
