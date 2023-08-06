import { faker } from '@faker-js/faker';
import { getUsuarios, getUsuariosComFiltros } from "./requests/getUsuarios"
import { postUsuario } from "./requests/postUsuario"
import { deleteUsuario } from "./requests/deleteUsuario"

describe('GET /usuarios', () => {
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
        it('Buscar todos os usuários cadastrados', () => {
            cy.getUsuarios()
                .then((res) => {
                    expect(res.status).to.eq(200)
                    expect(res.body).to.not.be.empty;
                })
            cy.deleteUsuario(_id)
                .then((res) => {
                    expect(res.status).to.eq(200)
                })
        })
        it('Buscar usuário pelo e-mail', () => {
            cy.getUsuariosComFiltros('email', email)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.not.be.empty;
                })
            cy.deleteUsuario(_id)
                .then((res) => {
                    expect(res.status).to.eq(200)
                })
        })

        it('Buscar usuário pelo ID', () => {
            cy.getUsuariosComFiltros('_id', _id)
                .then((res) => {
                    expect(res.status).to.eq(200)
                    expect(res.body).to.not.be.empty;
                })
            cy.deleteUsuario(_id)
                .then((res) => {
                    expect(res.status).to.eq(200)
                })
        })
    })
})

