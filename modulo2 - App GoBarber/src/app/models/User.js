const bcrypt = require('bcryptjs')

// sequelize: instacia do banco de dados
// DataTypes: tipos de colunas que pode ser usadas
module.exports = (sequelize, DataTypes) => {
  // primerio nomed o model, user
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING,
    // esse campo virtual só vai existir na palicação enão na base de dados
    password: DataTypes.VIRTUAL,
    password_hash: DataTypes.STRING,
    provider: DataTypes.BOOLEAN
  }, {
    hooks: {
      // criação da criptografia da senha seja feita tanto na criação quanto na atualizzação
      beforeSave: async user => {
        if (user.password) {
          // 8 é a força da criptografia
          user.password_hash = await bcrypt.hash(user.password, 8)
        }
      }
    }
  })

  User.prototype.checkPassword = function (password) {
    // comprara a senha digitada no login com a senha no banco
    return bcrypt.compare(password, this.password_hash)
  }

  return User
}
