'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  // como se fosse o constructor da classe
  // toda classe que for criada ou intanciada ele vai ser chamado
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        // criptografa a senha do usuario automaticamente
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  // pode ter mais de 1 enderço
  addresses () {
    return this.hasMany('App/Models/UserAddress')
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  // nome do relacionamento com projetos
  projects () {
    // pode ter muito porjetos
    return this.hasMany('App/Models/Project')
  }

  // nome do relacionamento com tarefas
  task () {
    // pode ter muito porjetos
    return this.hasMany('App/Models/Task')
  }
}

module.exports = User
