'use strict'

const Database = use('Database')
// quando é arquivo do adonis utiliza o "use"
const User = use('App/Models/User')

class UserController {
  // ctx: contexto dessa requisicão
  // aqui esta sendo utlizado a desestruturação
  async store ({ request }) {
    // campos que vão ser pegos na requisição
    // onçy ou all
    const data = request.only(['username', 'email', 'password'])
    const addresses = request.input('addresses')

    // inicia transaction
    // trx:sigla para trasaction
    const trx = await Database.beginTransaction()
    // cria o usuário
    const user = await User.create(data, trx)

    // cria varios endereços, cada endereço que receber vai ser cadastrados na tabela de endereço
    await user.addresses().createMany(addresses, trx)

    await trx.commit()

    return user
  }
}

module.exports = UserController
