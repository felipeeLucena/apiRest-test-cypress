Cypress.Commands.add('putUsuario', (id, nome, email, password, admin) => {
    cy.api({
        method: 'PUT',
        url: "/usuarios/" + id,
        body: {
            "nome": nome,
            "email": email,
            "password": password,
            "administrador": admin,
        }, failOnStatusCode: false,
    })
})