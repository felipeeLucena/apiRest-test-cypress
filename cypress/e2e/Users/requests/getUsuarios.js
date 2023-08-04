Cypress.Commands.add('getUsuarios', () => {
    cy.api({
        method: 'GET',
        url: "/usuarios",
    })
})


Cypress.Commands.add('getUsuariosComFiltros', (tipo, dado) => {
    cy.api({
        method: 'GET',
        url: '/usuarios?' + tipo + '=' + dado,
        failOnStatusCode: false
    })
})

