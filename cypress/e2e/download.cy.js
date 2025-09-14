describe('Download PDF', () => {
    it('Deve validar conteudo do recibo em PDF', () => {
        // Visita a página
        cy.visit('http://localhost:5173/')
        
        // Clica no botão de download
        cy.get('[data-cy="download"]').click()
        
        // Lê o PDF baixado e valida o conteúdo
        cy.task('readPDF', 'cypress/downloads/recibo.pdf')
            .should('contain', 'Papito Shop')
            .and('contain', 'Total24.000')
    })
})
