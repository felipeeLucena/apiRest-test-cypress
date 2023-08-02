Cypress.Commands.add('getUsuarios', () => {
    cy.request({
        method: 'GET',
        url: "/usuarios",
    })
})


Cypress.Commands.add('getUsuariosComFiltros', (tipo, dado) => {
    cy.request({
        method: 'GET',
        url: '/usuarios?' + tipo + '=' + dado,
        failOnStatusCode: false
    })
})

