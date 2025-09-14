# testing-pdf-file-cypress
# Guia Prático: Testes de PDF com Cypress e JavaScript

Este guia apresenta como implementar testes automatizados para validar o conteúdo de arquivos PDF usando Cypress.

## 📋 Pré-requisitos

- Node.js instalado
- Projeto Cypress configurado
- Aplicação web que gera/baixa PDFs

## 🚀 Passo 1: Instalação das Dependências

```bash
# Instalar Cypress (se ainda não tiver)
npm install cypress --save-dev

# Instalar biblioteca para leitura de PDF
npm install pdf-parse --save-dev
```

## 📁 Passo 2: Estrutura de Arquivos

Crie a seguinte estrutura no seu projeto:

```
projeto/
├── cypress/
│   ├── downloads/          # Pasta onde os PDFs serão baixados
│   ├── e2e/
│   │   └── pdf-test.cy.js  # Arquivo de teste
│   └── support/
│       └── helper.js       # Funções auxiliares
├── cypress.config.js       # Configuração do Cypress
└── package.json
```

## 🔧 Passo 3: Criar o Helper para Leitura de PDF

Crie o arquivo `cypress/support/helper.js`:

```javascript
// cypress/support/helper.js
const pdf = require('pdf-parse')
const path = require('path')
const fs = require('fs')

/**
 * Função para ler e extrair texto de arquivos PDF
 * @param {string} pathToPdf - Caminho para o arquivo PDF
 * @returns {Promise<string>} - Texto extraído do PDF
 */
const readPDF = (pathToPdf) => {
    return new Promise((resolve, reject) => {
        try {
            // Converte para caminho absoluto
            const pdfPath = path.resolve(pathToPdf)
            
            // Verifica se o arquivo existe
            if (!fs.existsSync(pdfPath)) {
                reject(new Error(`Arquivo PDF não encontrado: ${pdfPath}`))
                return
            }
            
            // Lê o arquivo PDF
            const pdfData = fs.readFileSync(pdfPath)
            
            // Extrai o texto usando pdf-parse
            pdf(pdfData)
                .then(function ({ text }) {
                    resolve(text)
                })
                .catch(function (error) {
                    reject(new Error(`Erro ao processar PDF: ${error.message}`))
                })
                
        } catch (error) {
            reject(new Error(`Erro ao ler arquivo: ${error.message}`))
        }
    })
}

module.exports = { readPDF }
```

## ⚙️ Passo 4: Configurar o Cypress

Edite o arquivo `cypress.config.js`:

```javascript
// cypress.config.js
const { readPDF } = require("./cypress/support/helper");

module.exports = {
  e2e: {
    // Configuração para downloads
    downloadsFolder: 'cypress/downloads',
    
    // Configuração de eventos Node.js
    setupNodeEvents(on, config) {
      // Registra a task customizada para leitura de PDF
      on('task', {
        readPDF
      })
      
      return config;
    },
    
    // Outras configurações úteis
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
  },
};
```

## 🧪 Passo 5: Criar o Teste de PDF

Crie o arquivo `cypress/e2e/pdf-test.cy.js`:

```javascript
// cypress/e2e/pdf-test.cy.js
describe('Testes de PDF', () => {
    
    beforeEach(() => {
        // Limpa a pasta de downloads antes de cada teste
        cy.task('exec', 'rm -rf cypress/downloads/*')
    })

    it('Deve baixar e validar conteúdo do PDF', () => {
        // 1. Acessa a página da aplicação
        cy.visit('http://localhost:3000') // Ajuste a URL conforme necessário
        
        // 2. Clica no botão de download do PDF
        cy.get('[data-cy="download-pdf"]') // Ajuste o seletor conforme necessário
            .click()
        
        // 3. Aguarda o download ser concluído (opcional)
        cy.wait(2000)
        
        // 4. Lê e valida o conteúdo do PDF
        cy.task('readPDF', 'cypress/downloads/documento.pdf') // Ajuste o nome do arquivo
            .then((pdfText) => {
                // Validações do conteúdo
                expect(pdfText).to.contain('Texto Esperado')
                expect(pdfText).to.contain('Outro Conteúdo')
                
                // Validações mais específicas
                expect(pdfText).to.match(/Total:\s*R\$\s*\d+,\d{2}/)
                expect(pdfText).to.include('Data: ')
            })
    })

    it('Deve validar múltiplos campos do PDF', () => {
        cy.visit('http://localhost:3000')
        
        cy.get('[data-cy="generate-report"]').click()
        
        cy.task('readPDF', 'cypress/downloads/relatorio.pdf')
            .should('contain', 'Relatório Mensal')
            .and('contain', 'Janeiro 2024')
            .and('match', /Total de vendas:\s*\d+/)
    })

    it('Deve validar PDF com dados dinâmicos', () => {
        // Dados de teste
        const dadosEsperados = {
            cliente: 'João Silva',
            valor: 'R$ 1.500,00',
            data: new Date().toLocaleDateString('pt-BR')
        }
        
        cy.visit('http://localhost:3000')
        
        // Preenche formulário antes de gerar PDF
        cy.get('[data-cy="cliente"]').type(dadosEsperados.cliente)
        cy.get('[data-cy="valor"]').type('1500')
        cy.get('[data-cy="gerar-pdf"]').click()
        
        cy.task('readPDF', 'cypress/downloads/fatura.pdf')
            .then((pdfText) => {
                expect(pdfText).to.contain(dadosEsperados.cliente)
                expect(pdfText).to.contain(dadosEsperados.valor)
                expect(pdfText).to.contain(dadosEsperados.data)
            })
    })
})
```

## 🛠️ Passo 6: Configurações Adicionais (Opcional)

### Configurar timeout para downloads grandes:

```javascript
// cypress/support/e2e.js
Cypress.Commands.add('waitForDownload', (filename, timeout = 10000) => {
    const downloadsFolder = Cypress.config('downloadsFolder')
    const downloadedFilename = path.join(downloadsFolder, filename)
    
    cy.readFile(downloadedFilename, { timeout }).should('exist')
})
```

### Comando customizado para validação de PDF:

```javascript
// cypress/support/commands.js
Cypress.Commands.add('validatePDF', (filename, expectedContent) => {
    cy.task('readPDF', `cypress/downloads/${filename}`)
        .should('contain', expectedContent)
})

// Uso no teste:
cy.validatePDF('documento.pdf', 'Conteúdo Esperado')
```

## 🚦 Passo 7: Executar os Testes

```bash
# Executar todos os testes
npx cypress run

# Executar apenas testes de PDF
npx cypress run --spec "cypress/e2e/pdf-test.cy.js"

# Abrir interface gráfica
npx cypress open
```

## 📝 Dicas e Boas Práticas

### 1. **Aguardar Downloads**
```javascript
// Aguarda arquivo aparecer na pasta
cy.readFile('cypress/downloads/arquivo.pdf', { timeout: 10000 }).should('exist')
```

### 2. **Limpar Downloads**
```javascript
beforeEach(() => {
    // Limpa pasta de downloads
    cy.exec('rm -rf cypress/downloads/*')
})
```

### 3. **Validações Robustas**
```javascript
cy.task('readPDF', 'arquivo.pdf').then((text) => {
    // Remove espaços extras e quebras de linha
    const cleanText = text.replace(/\s+/g, ' ').trim()
    
    // Validações mais flexíveis
    expect(cleanText).to.match(/Total.*R\$.*\d+/)
    expect(cleanText).to.include('Cliente:')
})
```

### 4. **Tratamento de Erros**
```javascript
cy.task('readPDF', 'arquivo.pdf')
    .then((text) => {
        // Sucesso
        expect(text).to.contain('conteúdo')
    })
    .catch((error) => {
        // Falha - log do erro
        cy.log('Erro ao ler PDF:', error.message)
        throw error
    })
```

## 🐛 Troubleshooting

### Problema: "Arquivo não encontrado"
- Verifique se o caminho está correto
- Aguarde o download ser concluído
- Confirme que o arquivo foi baixado na pasta correta

### Problema: "Erro ao processar PDF"
- Verifique se o PDF não está corrompido
- Teste com um PDF simples primeiro
- Confirme que a biblioteca pdf-parse está instalada

### Problema: "Task não encontrada"
- Verifique se a task está registrada no `cypress.config.js`
- Confirme que o helper está sendo importado corretamente

## 📚 Exemplo Completo

Aqui está um exemplo funcional baseado no código que você forneceu:

```javascript
// Teste completo de recibo PDF
describe('Validação de Recibo PDF', () => {
    it('Deve validar conteúdo completo do recibo', () => {
        cy.visit('http://localhost:5173/')
        
        cy.get('[data-cy="download"]').click()
        
        cy.task('readPDF', 'cypress/downloads/recibo.pdf')
            .should('contain', 'Papito Shop')
            .and('contain', 'PAPITO.DEV')
            .and('contain', 'Avenida Paulista, 777 - São Paulo')
            .and('contain', 'John Doe')
            .and('contain', 'Macbook Pro')
            .and('contain', 'iPhone 15')
            .and('contain', 'Total24.000')
            .and('contain', 'hey@papito.dev')
    })
})
```

## ✅ Checklist Final

- [ ] Dependências instaladas (`pdf-parse`)
- [ ] Arquivo `helper.js` criado
- [ ] Task registrada no `cypress.config.js`
- [ ] Teste criado com validações
- [ ] Pasta `cypress/downloads` configurada
- [ ] Seletores corretos no teste
- [ ] Nomes de arquivos corretos
- [ ] Testes executando com sucesso


