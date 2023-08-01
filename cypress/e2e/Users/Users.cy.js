/// <reference types= "cypress" />

describe('GET /usuarios', () => {

    context('Sucesso', () => {

        it('Buscar todos os usuários cadastrados', () => {
            cy.request({
                method: 'GET',
                url: "/usuarios",
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.not.be.empty;
                expect(response.body.usuarios[0]).to.have.any.keys('nome', 'email', 'password', 'administrador', '_id');
            })
        })

    })

})