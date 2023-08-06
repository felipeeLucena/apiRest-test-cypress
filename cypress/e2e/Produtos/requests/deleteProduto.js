Cypress.Commands.add('deleteProduto', (id, jwt) => {
    cy.api({
        method: 'DELETE',
        url: "/produtos/" + id,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: jwt
        },
        failOnStatusCode: false,
    })
})