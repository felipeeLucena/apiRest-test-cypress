Cypress.Commands.add('deleteUsuario', (id) => {
    cy.request({
        method: 'DELETE',
        url: "/usuarios/" + id,
    })
})