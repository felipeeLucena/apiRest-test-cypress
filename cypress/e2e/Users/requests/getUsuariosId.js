Cypress.Commands.add('getUsuarioId', (id) => {
    cy.api({
        method: 'GET',
        url: "/usuarios/" + id,
        failOnStatusCode: false,
    })
})