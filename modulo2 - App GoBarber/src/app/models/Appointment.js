module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    date: DataTypes.DATE
  })

  // associar model com usuario
  Appointment.associate = models => {
    // define que o appointemnte pertence a um usuairo
    // quem agendou o serviço
    // foreignKey: nome da chave que vai guardar o relacionamento
    // belongsTo vai armazenar o id da chave estrangeira na propria tabela appointment
    Appointment.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'user_id'
    })
    // tambem é prestado por um usuario
    Appointment.belongsTo(models.User, {
      as: 'provider',
      foreignKey: 'provider_id'
    })
  }

  return Appointment
}
