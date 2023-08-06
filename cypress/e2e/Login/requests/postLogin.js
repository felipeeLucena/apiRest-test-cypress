Cypress.Commands.add('postLogin', (email, password) => {
    cy.api({
        method: 'POST',
        url: '/login',
        body: {
            "email": email,
            "password": password
        },  failOnStatusCode: false
    })
})