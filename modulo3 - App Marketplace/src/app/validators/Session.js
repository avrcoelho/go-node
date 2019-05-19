const Joi = require('joi')

module.exports = {
  // validar o body do ad
  body: {
    // verifica se é tipo string e se é obrigatorio
    // isso é comparado com o model
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }
}
