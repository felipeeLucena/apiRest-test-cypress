Cypress.Commands.add('getUsuarios', () => {
    cy.request({
        method: 'GET',
        url: "/usuarios",
    })
})

