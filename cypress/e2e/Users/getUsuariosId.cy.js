import { faker } from '@faker-js/faker';
import { getUsuarioId } from './requests/getUsuariosId'
import { postUsuarios } from "./requests/postUsuarios"
import { deleteUsuario } from "./requests/deleteUsuario"

/// <reference types= "cypress" />

describe('GET /usuarios/id', () => {
    context('Sucesso', () => {
        let _id;
        it('Buscar Usuário pelo ID', () => {
            const nomeCompleto = faker.person.fullName();
            const email = faker.internet.email();
            const password = faker.internet.password();
            const admin = 'true';

            cy.postUsuarios(nomeCompleto, email, password, admin)
                .then((response) => {
                    expect(response.status).to.eql(201);
                    _id = response.body._id;

                    cy.wrap(_id).then((id) => {

                        cy.getUsuarioId(id)
                            .then((response) => {
                                expect(response.status).to.eql(200);
                                expect(response.body).to.have.property('_id', id);
                                expect(response.body).to.have.property('nome', nomeCompleto);
                                expect(response.body).to.have.property('password', password);
                                expect(response.body).to.have.property('administrador', admin);
                                expect(response.body).to.have.property('email', email);
                            });

                        cy.deleteUsuario(id).then((response) => {
                            expect(response.status).to.eq(200);
                        });
                    });
                });
        });
    });


    context('Falha', () => {
        it('Usuário não encontrado', () => {
            cy.getUsuarioId('@@@')
                .then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body).to.have.property('message', 'Usuário não encontrado')
                })
        })
    })
});
