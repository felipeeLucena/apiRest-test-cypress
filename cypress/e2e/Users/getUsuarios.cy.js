import { faker } from '@faker-js/faker';
import { getUsuarios, getUsuariosComFiltros } from "./requests/getUsuarios"
import { postUsuarios } from "./requests/postUsuario"

/// <reference types= "cypress" />

describe('GET /usuarios', () => {

    context('Sucesso', () => {

        const nomeCompleto = faker.person.fullName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const admin = 'true';
        let hasUser

        beforeEach(() => {
            cy.getUsuarios()
                .then((response) => {
                    expect(response.status).to.eq(200)
                    if (response.body.length === 0) {
                        cy.postUsuarios(nomeCompleto, email, password, admin)
                        expect(response.status).to.eql(201)
                    } else {
                        hasUser = true
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

            cy.getUsuarios()
                .then((response) => {
                    expect(response.status).to.eq(200)
                    console.log(hasUser)
                    if (hasUser === true) {
                        cy.getUsuariosComFiltros('email', response.body.usuarios[0].email)
                            .then((res) => {
                                expect(response.status).to.eq(200)
                                expect(response.body).to.not.be.empty;
                            })
                    }
                })

        })

        it.only('Buscar usuário pelo ID', () => {

            cy.getUsuarios()
                .then((response) => {
                    expect(response.status).to.eq(200)
                    if (hasUser === true) {
                        cy.getUsuariosComFiltros('_id', response.body.usuarios[0]._id)
                            .then((res) => {
                                expect(res.status).to.eq(200)
                                expect(res.body).to.not.be.empty;
                            })
                    }
                })
        })

    })
})

