'use strict'

const moment = require('moment')
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      // input: só pega um campo da reuisição
      const email = request.input('email')
      // findByOrFail: se não encontrar ele retorna um erro e cai no catch
      const user = await User.findByOrFail('email', email)

      // cria o token para o suuário
      // tamanho de 10
      // hex: string hexa decimal
      user.token = crypto.randomBytes(10).toString('hex')
      // anota o token com a data atual
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        // tamplete de email
        // utiliza array porque o email pode ter uma ver~soa texto
        ['emails.forgot_password'],
        // parametros enviados para o temaplte
        { email, token: user.token, link: `${request.input('redirect_url')}?token=${user.token}` },
        message => {
          message
            .to(user.email)
            .from('andrevrcoelho@hotmail.com', 'André Coelho')
            .subject('Recuperação de senha')
        }
      )
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Esse email não existe' } })
    }
  }

  async update ({ request, response }) {
    try {
      // all: pega todos os dados da requisição
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at)
        // pega a data atual, tira 2 dias e verifica se isso é maior que a data do token

      if (tokenExpired) {
        return response
          .status(401)
          .send({ error: { message: 'Token expirado' } })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()

      return response
        .status(201)
        .send({ error: { message: 'Senha alterada com sucesso' } })
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo deu errado ao resetar a sua senha' } })
    }
  }
}

module.exports = ForgotPasswordController
