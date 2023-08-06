Cypress.Commands.add('getProdutoId', (id) => {
    cy.api({
        method: 'GET',
        url: "/produtos/" + id,
        failOnStatusCode: false,
    })
})