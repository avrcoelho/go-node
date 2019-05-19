// faker: gera dados aleatórios
const faker = require("faker");
const { factory } = require("factory-girl");

const { User } = require("../src/app/models");

// da um nome para o factory
// de o mesmo nome que o model
factory.define("User", User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
});

module.exports = factory;
