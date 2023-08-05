Cypress.Commands.add('postUsuario', (nome, email, password, admin) => {
    cy.api({
        method: 'POST',
        url: "/usuarios",
        body: {
            "nome": nome,
            "email": email,
            "password": password,
            "administrador": admin,
        }
        , failOnStatusCode: false
    })
})
