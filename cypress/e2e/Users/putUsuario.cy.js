import { faker } from '@faker-js/faker';
import { postUsuario } from "./requests/postUsuario"
import { putUsuario } from "./requests/putUsuario"
import { deleteUsuario } from "./requests/deleteUsuario"

describe('PUT /usuarios', () => {

    const nomeCompleto = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const admin = 'true';

    let beforeEachExecuted = false;
    let _id

    context('Sucesso', () => {

        beforeEach(() => {
            if (!beforeEachExecuted) {
                cy.postUsuario(nomeCompleto, email, password, admin)
                    .then(function (response) {
                        expect(response.status).to.eql(201);
                        _id = response.body._id;
                        beforeEachExecuted = true;
                    });
            }
        });

        it('Editar dados Usuário', () => {

            const PutnomeCompleto = faker.person.fullName();
            const PutEmail = faker.internet.email();
            const PutPassword = faker.internet.password();
            const PutAdmin = 'true';

            cy.putUsuario(_id, PutnomeCompleto, PutEmail, PutPassword, PutAdmin)
                .then((response) => {
                    expect(response.status).to.eql(200)
                    expect(response.body).to.have.property('message', 'Registro alterado com sucesso')
                })

            cy.deleteUsuario(_id)
                .then((response) => {
                    expect(response.status).to.eq(200);
                })
        })

        it('Inserir dados com PUT', () => {

            const putNome = 'Put Email'
            const putEmail = faker.internet.email()
            const putPassword = '123124'
            const putAdmin = 'false'

            cy.putUsuario('idInexistente@@', putNome, putEmail, putPassword, putAdmin)
                .then((response) => {
                    expect(response.status).to.eql(201)
                    expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
                    expect(response.body._id).is.not.null

                    cy.deleteUsuario(response.body._id)
                        .then((response) => {
                            expect(response.status).to.eq(200);
                        })

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
        });

        it('Tentar inserir usuário com put e e-mail em uso', () => {

            cy.putUsuario('idInexistente@@', nomeCompleto, email, password, admin)
                .then((response) => {
                    expect(response.status).to.eql(400);
                    expect(response.body).to.have.property('message', 'Este email já está sendo usado');
                });

            cy.deleteUsuario(_id)
                .then((response) => {
                    expect(response.status).to.eq(200);
                })

        });
    });

})