const Mail = require('../services/Mail')

class PurchaseMail {
  // usa a variavel key como get, pois caso queira usar Purchasemail.key fora da classe
  get key () {
    // retorna a chave unica
    return 'PurchaseMail'
  }

  // aqui envia o email
  // job que contem varias informações sobre o job
  // done: deve chamr ela assim que terminar o job
  async handle (job, done) {
    const {
      ad,
      user,
      content
    } = job.data

    await Mail.sendMail({
      from: '"André Coelho" <andrevrcoelho@hotmail.com>',
      to: ad.author.email,
      subject: `Solicitação de comprar: ${ad.title}`,
      // template de email
      template: 'purchase',
      // variaveis enviadas para o template
      context: {
        user,
        content,
        ad: ad
      }
    })

    // para finalizar e avisar o job que finalizou
    return done()
  }
}

module.exports = new PurchaseMail()
