import { faker } from '@faker-js/faker';
//Usuários
import { postUsuarios } from "../Users/requests/postUsuario"
import { deleteUsuario } from "../Users/requests/deleteUsuario"
//Login
import { postLogin } from '../Login/requests/postLogin'
//Produtos
import { getProdutos, getProdutoComFiltros } from "../Produtos/requests/getProdutos"
import { postProduto } from "../Produtos/requests/postProduto"
import { deleteProduto } from "../Produtos/requests/deleteProduto"

/// <reference types= "cypress" />

describe('GET /produtos', () => {

    context('Sucesso', () => {

        const nomeCompleto = faker.person.fullName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const admin = 'true';
        let _idProduto
        let _id

        const nomeProduto = faker.commerce.productName()
        const precoProduto = 150
        const descricaoProduto = faker.commerce.productDescription()
        const quantidadeProduto = 40

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
        it('Buscar todos os produtos cadastrados', () => {
            const jwt = Cypress.env('authorization')
            cy.getProdutos()
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.not.be.empty;
                })

            cy.deleteProduto(_idProduto, jwt)
                .then((response) => {
                    expect(response.status).to.eq(200)
                })

            cy.deleteUsuario(_id)
                .then((response) => {
                    expect(response.status).to.eq(200)
                })

        })
        it('Buscar produto pelo nome do produto', () => {
            const jwt = Cypress.env('authorization')
            cy.getProdutosComFiltros('nome', nomeProduto)
                .then((res) => {
                    expect(res.status).to.eq(200)
                    expect(res.body).to.not.be.empty;
                })
            cy.deleteProduto(_idProduto, jwt)
                .then((response) => {
                    expect(response.status).to.eq(200)
                })

            cy.deleteUsuario(_id)
                .then((response) => {
                    expect(response.status).to.eq(200)
                })
        })
    })
})

