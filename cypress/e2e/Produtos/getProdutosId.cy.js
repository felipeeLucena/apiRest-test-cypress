import { faker } from '@faker-js/faker';

import { postUsuario } from "../Users/requests/postUsuario"
import { deleteUsuario } from "../Users/requests/deleteUsuario"
import { postLogin } from '../Login/requests/postLogin'
import { postProduto } from './requests/postProduto'
import { getProdutoId } from './requests/getProdutoId'
import { deleteProduto } from './requests/deleteProduto'

describe('GET /produtos/id', () => {
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
                .then((res) => {
                    expect(res.status).to.eql(201)
                    _id = res.body._id
                })
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
        })

        it('Buscar produto pelo ID', () => {
            const jwt = Cypress.env('authorization')
            cy.getProdutoId(_idProduto)
                .then((res) => {
                    expect(res.status).to.eql(200);
                    expect(res.body).to.have.property('_id', _idProduto);
                    expect(res.body).to.have.property('nome', nomeProduto);
                    expect(res.body).to.have.property('preco', precoProduto);
                    expect(res.body).to.have.property('descricao', descricaoProduto);
                    expect(res.body).to.have.property('quantidade', quantidadeProduto);
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
                .then((res) => {
                    expect(res.status).to.eql(201)
                    _id = res.body._id
                })
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
        })
        it('Buscar Produto com ID inválido', () => {
            const jwt = Cypress.env('authorization')
            cy.getProdutoId('id@@')
                .then((res) => {
                    expect(res.status).to.eql(400)
                    expect(res.body).to.have.property('message', 'Produto não encontrado')
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