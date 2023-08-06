Cypress.Commands.add('postProduto', (nome, preco, descricao, quantidade, jwt) => {
    cy.api({
        method: 'POST',
        url: '/produtos',
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
        }, failOnStatusCode: false
    })
})