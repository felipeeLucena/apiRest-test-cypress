import { faker } from '@faker-js/faker';

import { postUsuario } from '../Users/requests/postUsuario'
import { postLogin } from './requests/postLogin'
import { deleteUsuario } from '../Users/requests/deleteUsuario'


describe('POST /login', () => {
    context('Sucesso', () => {
        const nomeCompleto = faker.person.fullName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const admin = 'true';

        let _id

        beforeEach(() => {
            cy.postUsuario(nomeCompleto, email, password, admin)
                .then((res) => {
                    expect(res.status).to.eql(201)
                    _id = res.body._id
                })
        })

        it('Login com sucesso', () => {
            cy.postLogin(email, password)
                .then((res) => {
                    expect(res.status).to.eql(200)
                })
            cy.deleteUsuario(_id)
                .then((res) => {
                    expect(res.status).to.eql(200)
                })
        })
    })
    context('Falha', () => {

        const email = faker.internet.email();
        const password = faker.internet.password();
       
        it('Login apenas com o e-mail', () => {
            cy.postLogin(email)
                .then((res) => {
                    expect(res.status).to.eql(400)
                    expect(res.body).to.have.property('password', 'password é obrigatório')
                })
        })

        it('Login apenas com a senha', () => {
            cy.postLogin({ password: password })
                .then((res) => {
                    expect(res.status).to.eql(400)
                    expect(res.body).to.have.property('email', 'email deve ser uma string')
                })
        })

        it('Login com e-mail e senha vazios', () => {
            
            cy.postLogin()
                .then((res) => {
                    expect(res.status).to.eql(400)
                    expect(res.body).to.have.property('email', 'email é obrigatório')
                    expect(res.body).to.have.property('password', 'password é obrigatório')
                })
        })

    })
})
