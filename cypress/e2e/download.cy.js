describe('Download PDF', ()=> {

    it('Deve validar o conteúdo do recibo em PDF', ()=> {
        cy.visit('http://localhost:5173/')

        cy.get('[data-cy="download"]')
            .click()

         //   \n\nRecibo\nPapito Shop\nPAPITO.DEV\nAvenida Paulista, 777 - São Paulo\n11 99999-1001\nhey@papito.dev\nRecibo #: 123-456-7890Data: 22 de agosto de 2024\nCliente:\nJohn Doe\nRua Joaquim Floriano, 1000 - São Paulo\nCPF: 00000014141\nDescriçãoPreçoQuantidadeTotal\nMacbook Pro20.000120.000\niPhone 157.000214.000\nSubtotal24.000\nTotal24.000\nObservações:\nEntre em contato com hey@papito.dev para trocas, devoluções e garantia

        cy.task('readPdf', 'cypress/downloads/recibo.pdf')
            .should('contain', 'Papito Shop')
            .and('contain', 'Total24.000')

    })

})