import { faker } from '@faker-js/faker';

import { postUsuario } from "../Users/requests/postUsuario"
import { deleteUsuario } from "../Users/requests/deleteUsuario"
import { postLogin } from '../Login/requests/postLogin'
import { postProduto } from './requests/postProduto'
import { deleteProduto } from './requests/deleteProduto'

describe('POST /produtos', () => {
    const nomeCompleto = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const admin = 'true';
    const padrao = 'false';

    let _id

    context('Sucesso', () => {
        beforeEach(() => {
            cy.postUsuario(nomeCompleto, email, password, admin)
                .then((res) => {
                    expect(res.status).to.eql(201)
                    _id = res.body._id
                })
            cy.postLogin(email, password)
                .then((res) => {
                    expect(res.status).to.eql(200)
                    Cypress.env('authorization', res.body.authorization)
                })
        })
        it('Cadastrar produtos', () => {
            const nomeProduto = faker.commerce.productName()
            const precoProduto = 150
            const descricaoProduto = faker.commerce.productDescription()
            const quantidadeProduto = 40
            const jwt = Cypress.env('authorization')

            cy.postProduto(nomeProduto, precoProduto, descricaoProduto, quantidadeProduto, jwt)
                .then((res) => {
                    expect(res.status).to.eql(201)
                    expect(res.body).to.have.property('message', 'Cadastro realizado com sucesso')
                    expect(res.body._id).is.not.null

                    cy.deleteProduto(res.body._id)
                        .then((res) => {
                            expect(res.status).to.eql(200)
                        })
                })

            cy.deleteUsuario(_id)
                .then((res) => {
                    expect(res.status).to.eql(200)
                })

        })
    })

    context('Falha', () => {
        beforeEach(() => {
            cy.postUsuario(nomeCompleto, email, password, admin)
                .then((res) => {
                    expect(res.status).to.eql(201)
                    _id = res.body._id
                })
            cy.postLogin(email, password)
                .then((res) => {
                    expect(res.status).to.eql(200)
                    Cypress.env('authorization', res.body.authorization)
                })
        })

        it.only('Cadastrar produto já existente', () => {

            const nomeProduto = faker.commerce.productName()
            const precoProduto = 150
            const descricaoProduto = faker.commerce.productDescription()
            const quantidadeProduto = 40
            const jwt = Cypress.env('authorization')
            let idProduto

            cy.postProduto(nomeProduto, precoProduto, descricaoProduto, quantidadeProduto, jwt)
                .then((res) => {
                    expect(res.status).to.eql(201)
                    expect(res.body).to.have.property('message', 'Cadastro realizado com sucesso')
                    expect(res.body._id).is.not.null
                    idProduto = res.body._id
                })
            cy.postProduto(nomeProduto, precoProduto, descricaoProduto, quantidadeProduto, jwt)
                .then((res) => {
                    expect(res.status).to.eql(400)
                    expect(res.body).to.have.property('message', 'Já existe produto com esse nome')

                    cy.deleteProduto(idProduto, jwt)
                        .then((res) => {
                            expect(res.status).to.eql(200)
                        })
                })

            cy.deleteUsuario(_id)
                .then((res) => {
                    expect(res.status).to.eql(200)
                })
        })

        it('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais', () => {

            const nomeProduto = faker.commerce.productName()
            const precoProduto = 150
            const descricaoProduto = faker.commerce.productDescription()
            const quantidadeProduto = 40

            cy.postProduto(nomeProduto, precoProduto, descricaoProduto, quantidadeProduto)
                .then((res) => {
                    expect(res.status).to.eql(401)
                    expect(res.body).to.have.property('message', 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
                    expect(res.body._id).is.not.null
                })

            cy.deleteUsuario(_id)
                .then((res) => {
                    expect(res.status).to.eql(200)
                })
        })
    })

    context('Falha - Não Admin', () => {
        beforeEach(() => {
            cy.postUsuario(nomeCompleto, email, password, padrao)
                .then((res) => {
                    expect(res.status).to.eql(201)
                    _id = res.body._id
                })
            cy.postLogin(email, password)
                .then((res) => {
                    expect(res.status).to.eql(200)
                    Cypress.env('authorization', res.body.authorization)
                })
        })

        it('Rota exclusiva para administradores', () => {
            const nomeProduto = faker.commerce.productName()
            const precoProduto = 150
            const descricaoProduto = faker.commerce.productDescription()
            const quantidadeProduto = 40
            const jwt = Cypress.env('authorization')

            cy.postProduto(nomeProduto, precoProduto, descricaoProduto, quantidadeProduto, jwt)
                .then((res) => {
                    expect(res.status).to.eql(403)
                    expect(res.body).to.have.property('message', 'Rota exclusiva para administradores')
                    expect(res.body._id).is.not.null
                })

            cy.deleteUsuario(_id)
                .then((res) => {
                    expect(res.status).to.eql(200)
                })
        })
    })
})