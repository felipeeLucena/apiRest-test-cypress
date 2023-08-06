Cypress.Commands.add('putProduto', (id, nome, preco, descricao, quantidade, jwt) => {
    cy.api({
        method: 'PUT',
        url: "/produtos/" + id,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: jwt
        },
        body: {
            "nome": nome,
            "preco": preco,
            "descricao": descricao,
            "quantidade": quantidade
        }, failOnStatusCode: false,
    })
})