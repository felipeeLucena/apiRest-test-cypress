import { faker } from '@faker-js/faker';
import { getUsuarios, getUsuariosComFiltros } from "./requests/getUsuarios"
import { postUsuarios } from "./requests/postUsuarios"

/// <reference types= "cypress" />

describe('GET /usuarios', () => {

    context('Sucesso', () => {

        const nomeCompleto = faker.person.fullName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const admin = 'true';

        beforeEach(() => {
            cy.getUsuarios()
                .then((response) => {
                    if (response.body.length === 0) {
                        cy.postUsuarios(nomeCompleto, email, password, admin)
                            .then((response) => {
                                expect(response.status).to.eql(201);
                            })
                    }
                })
        })

        it('Buscar todos os usuários cadastrados', () => {

            cy.getUsuarios()
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.not.be.empty;
                })

        })

        it('Buscar usuário pelo e-mail', () => {
            cy.getUsuariosComFiltros('email', email)
                .then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body.usuarios[0]).to.have.property('email', email)
                })
        })


    })

})

