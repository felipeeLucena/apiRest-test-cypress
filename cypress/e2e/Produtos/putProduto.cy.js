import { faker } from '@faker-js/faker';

import { postUsuario } from "../Users/requests/postUsuario"
import { deleteUsuario } from "../Users/requests/deleteUsuario"
import { postLogin } from '../Login/requests/postLogin'
import { postProduto } from './requests/postProduto'
import { deleteProduto } from './requests/deleteProduto'
import { putProduto } from './requests/putProduto'

describe('PUT /produtos', () => {
    const nomeCompleto = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const admin = 'true';

    const nomeProduto = faker.commerce.productName()
    const precoProduto = 150
    const descricaoProduto = faker.commerce.productDescription()
    const quantidadeProduto = 40

    let _id
    let _idProduto
    context('Sucesso', () => {
        beforeEach(() => {
            cy.postUsuario(nomeCompleto, email, password, admin)
                .then(function (response) {
                    expect(response.status).to.eql(201);
                    _id = response.body._id;
                });
            cy.postLogin(email, password)
                .then((res) => {
                    expect(res.status).to.eql(200)
                    Cypress.env('authorization', res.body.authorization)
                    cy.postProduto(nomeProduto, precoProduto, descricaoProduto, quantidadeProduto, Cypress.env('authorization'))
                        .then((res) => {
                            expect(res.status).to.eql(201)
                            expect(res.body).to.have.property('message', 'Cadastro realizado com sucesso')
                            expect(res.body._id).is.not.null
                            _idProduto = res.body._id
                        })
                })
        });
        it('Editar dados do produto', () => {
            const nomeProdutoNovo = faker.commerce.productName()
            const precoProdutoNovo = 170
            const descricaoProdutoNovo = faker.commerce.productDescription()
            const quantidadeProdutoNovo = 45
            const jwt = Cypress.env('authorization')
            cy.putProduto(_idProduto, nomeProdutoNovo, precoProdutoNovo, descricaoProdutoNovo, quantidadeProdutoNovo, jwt)
                .then((res) => {
                    expect(res.status).to.eql(200)
                    expect(res.body).to.have.property('message', 'Registro alterado com sucesso')
                })
            cy.deleteProduto(_idProduto, jwt)
                .then((res) => {
                    expect(res.status).to.eq(200);
                })
            cy.deleteUsuario(_id)
                .then((res) => {
                    expect(res.status).to.eq(200);
                })
        })
        it('Inserir dados com PUT', () => {
            const nomeProdutoNovo = faker.commerce.productName()
            const precoProdutoNovo = 170
            const descricaoProdutoNovo = faker.commerce.productDescription()
            const quantidadeProdutoNovo = 45
            const jwt = Cypress.env('authorization')
            cy.putProduto('idInexistente@@', nomeProdutoNovo, precoProdutoNovo, descricaoProdutoNovo, quantidadeProdutoNovo, jwt)
                .then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
                    expect(response.body._id).is.not.null
                    cy.deleteProduto(response.body._id, jwt)
                        .then((res) => {
                            expect(res.status).to.eq(200);
                        })
                })
            cy.deleteProduto(_idProduto, jwt)
                .then((res) => {
                    expect(res.status).to.eq(200);
                })
            cy.deleteUsuario(_id)
                .then((res) => {
                    expect(res.status).to.eq(200);
                })
        })
    })
    context('Falha', () => {
        beforeEach(() => {
            cy.postUsuario(nomeCompleto, email, password, admin)
                .then(function (response) {
                    expect(response.status).to.eql(201);
                    _id = response.body._id;
                });
            cy.postLogin(email, password)
                .then((res) => {
                    expect(res.status).to.eql(200)
                    Cypress.env('authorization', res.body.authorization)
                    cy.postProduto(nomeProduto, precoProduto, descricaoProduto, quantidadeProduto, Cypress.env('authorization'))
                        .then((res) => {
                            expect(res.status).to.eql(201)
                            expect(res.body).to.have.property('message', 'Cadastro realizado com sucesso')
                            expect(res.body._id).is.not.null
                            _idProduto = res.body._id
                        })
                })
        });
        it('Inserir produto com put com um nome já cadastrado', () => {
            const precoProdutoNovo = 170
            const descricaoProdutoNovo = faker.commerce.productDescription()
            const quantidadeProdutoNovo = 45
            const jwt = Cypress.env('authorization')
            cy.putProduto('idInexistente@@', nomeProduto, precoProdutoNovo, descricaoProdutoNovo, quantidadeProdutoNovo, jwt)
                .then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body).to.have.property('message', 'Já existe produto com esse nome')
                    expect(response.body._id).is.not.null
                })
            cy.deleteProduto(_idProduto, jwt)
                .then((res) => {
                    expect(res.status).to.eq(200);
                })
            cy.deleteUsuario(_id)
                .then((res) => {
                    expect(res.status).to.eq(200);
                })
        })

    })
})