const request = require("supertest");
const nodemailer = require("nodemailer");

const app = require("../../src/app");
const truncate = require("../utils/truncate");
const factory = require("../factories");

// jest: variavel global da aplicação
jest.mock("nodemailer");

/* todo modulo daqui para baixo que importar o nodemailer, esse modulo não vai 
conter o que tem no require('nodemialer'), ele vai conter como se fosse um 
modulo fake que conseguimos monitorar tudo que o que sta sendo cjmado nesse modulo */

// fomr ade criar um obejto que quivale ao transport do nodemailer
// ela que contem o send mail
// jest.fn: mock de uma função. FUncção vazia que consegue monitorrar, consegue saber todos dados sobre ela
const transport = {
  sendMail: jest.fn()
};

// cria uma catagoria de testes
describe("Authentication", () => {
  // executa antes do teste
  beforeEach(async () => {
    await truncate();
  });

  // executa antes de todos os testes
  beforeAll(() => {
    // vai ser retornado o que tem dentro de const transport
    nodemailer.createTransport.mockReturnValue(transport);
  });

  it("should be able to authentication with valid credentials", async () => {
    // pega o facory e passa o dele que foi criado, ou seja, o User
    const user = await factory.create("User", {
      password: "123123"
    });

    const response = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: "123123"
      });

    expect(response.status).toBe(200);
  });

  it("should not be able to authenticate with invalid credentials", async () => {
    const user = await factory.create("User", {
      password: "123123"
    });

    const response = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: "123456"
      });

    expect(response.status).toBe(401);
  });

  it("should return jwt token when  authenticated", async () => {
    const user = await factory.create("User", {
      password: "123123"
    });

    const response = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: "123123"
      });

    expect(response.body).toHaveProperty("token");
  });

  it("should be able to access private routes when authenticated", async () => {
    const user = await factory.create("User");

    // verifica se esta autenticado
    const response = await request(app)
      .get("/dashboard")
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it("should not be able to access private  routes when not authenticated", async () => {
    const response = await request(app)
      .get("/dashboard")
      .set("Authorization", `Bearer 123456`);

    expect(response.status).toBe(401);
  });

  it("should not be able to access private  routes when not authenticated", async () => {
    const response = await request(app).get("/dashboard");

    expect(response.status).toBe(401);
  });

  it("Should receibe email notification when authenticated", async () => {
    const user = await factory.create("User", {
      password: "123123"
    });

    const response = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: "123123"
      });

    // espero que tenha sido chamado uma vez
    expect(transport.sendMail).toHaveBeenCalledTimes(1);
    // aqui tem todas as camads feitas para a API. Estamos peganso a primeira chamada
    expect(transport.sendMail.mock.calls[0][0].to).toBe(
      `${user.name} <${user.email}>`
    );
  });
});
