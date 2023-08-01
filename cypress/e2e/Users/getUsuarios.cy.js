import { getUsuarios } from "./requests/getUsuarios"

/// <reference types= "cypress" />

describe('GET /usuarios', () => {

    context('Sucesso', () => {

        it('Buscar todos os usuários cadastrados', () => {
            cy.getUsuarios().then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.not.be.empty;
            })

          
        })

    })

})

