Cypress.Commands.add('deleteUsuario', (id) => {
    cy.api({
        method: 'DELETE',
        url: "/usuarios/" + id,
    })
})