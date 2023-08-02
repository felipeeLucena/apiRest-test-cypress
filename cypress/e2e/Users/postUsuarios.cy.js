import { faker } from '@faker-js/faker';

import { postUsuarios } from "./requests/postUsuarios"
import { deleteUsuario } from "./requests/deleteUsuarios"

/// <reference types= "cypress" />

describe('POST /usuarios', () => {

    const nomeCompleto = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    context('Sucesso', () => {

        it('Cadastrar usuário ADMINISTRADOR', () => {
            cy.postUsuarios(nomeCompleto, email, password, 'true')
                .then((response) => {
                    expect(response.status).to.eq(201)
                    expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso');
                    expect(response.body._id).to.not.be.null;
                    cy.deleteUsuario(response.body._id).then((response) => {
                        expect(response.status).to.eq(200);
                    });
                })
        })

        it('Cadastrar usuário PADRÃO', () => {
            cy.postUsuarios(nomeCompleto, email, password, 'false')
                .then((response) => {
                    expect(response.status).to.eq(201)
                    expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso');
                    expect(response.body._id).to.not.be.null;
                    cy.deleteUsuario(response.body._id).then((response) => {
                        expect(response.status).to.eq(200);
                    });
                })
        })
    })

    context('Falha', () => {

        let _id;

        it('Cadastro duplicado', () => {
            cy.postUsuarios('Beltrando da Casa de Pantanha', 'teste@teste.com', 'teste', 'true')
                .then((response) => {
                    expect(response.status).to.eq(201);
                    expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso');
                    expect(response.body._id).to.not.be.null;
                    _id = response.body._id;
                });

            cy.postUsuarios('Beltrando da Casa de Pantanha', 'teste@teste.com', 'teste', 'true')
                .then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body).to.have.property('message', 'Este email já está sendo usado');
                });

            cy.then(() => {
                cy.deleteUsuario(_id).then((response) => {
                    expect(response.status).to.eq(200);
                });
            });
        });

        it('Campo administrador diferente de string', () => {
            cy.postUsuarios(nomeCompleto, email, password, true)
                .then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body).to.have.property('administrador', "administrador deve ser 'true' ou 'false'")
                });
        })

        it('Senha diferente de string', () => {
            cy.postUsuarios(nomeCompleto, email, 123456, 'true')
                .then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body).to.have.property('password', 'password deve ser uma string')
                });
        })

        it('E-mail inválido', () => {
            cy.postUsuarios(nomeCompleto, 'teste', password, 'true')
                .then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body).to.have.property('email', "email deve ser um email válido")
                });
        })

        it('Submeter formulário sem dados nos campos', () => {
            cy.postUsuarios()
                .then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body).to.have.property('nome', 'nome é obrigatório')
                    expect(response.body).to.have.property('email', 'email é obrigatório')
                    expect(response.body).to.have.property('password', 'password é obrigatório')
                    expect(response.body).to.have.property('administrador', 'administrador é obrigatório')
                });
        })
    });
});