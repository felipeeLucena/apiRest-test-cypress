Cypress.Commands.add('getUsuarioId', (id) => {
    cy.request({
        method: 'GET',
        url: "/usuarios/" + id,
        failOnStatusCode: false,
    })
})