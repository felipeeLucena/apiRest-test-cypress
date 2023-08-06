Cypress.Commands.add('getProdutos', () => {
    cy.api({
        method: 'GET',
        url: "/produtos/",
        failOnStatusCode: false,
    })
})

Cypress.Commands.add('getProdutosComFiltros', (tipo, dado) => {
    cy.api({
        method: 'GET',
        url: '/produtos?' + tipo + '=' + dado,
        failOnStatusCode: false
    })
})
