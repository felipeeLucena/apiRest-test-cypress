import { faker } from '@faker-js/faker';
import { getUsuarioId } from './requests/getUsuariosId'
import { postUsuario } from "./requests/postUsuario"
import { deleteUsuario } from "./requests/deleteUsuario"

/// <reference types= "cypress" />

describe('GET /usuarios/id', () => {
    context('Sucesso', () => {
        const nomeCompleto = faker.person.fullName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const admin = 'true';
        let _id;
        beforeEach(() => {
            cy.postUsuario(nomeCompleto, email, password, admin)
                .then((response) => {
                    expect(response.status).to.eql(201);
                    _id = response.body._id;
                })
        })
        it('Buscar Usuário pelo ID', () => {
            cy.getUsuarioId(_id)
                .then((response) => {
                    expect(response.status).to.eql(200);
                    expect(response.body).to.have.property('_id', _id);
                    expect(response.body).to.have.property('nome', nomeCompleto);
                    expect(response.body).to.have.property('password', password);
                    expect(response.body).to.have.property('administrador', admin);
                    expect(response.body).to.have.property('email', email);
                });
            cy.deleteUsuario(_id)
                .then((res) => {
                    expect(res.status).to.eql(200);
                })
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
