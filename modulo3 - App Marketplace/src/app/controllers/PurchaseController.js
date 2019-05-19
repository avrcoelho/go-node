const Ad = require('../nodels/Ad')
const User = require('../nodels/User')
const Purchase = require('../nodels/Purchase')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async index (req, res) {
    const purchase = await Purchase.paginate({}, {
      page: req.query.page || 1,
      limit: 20,
      // data decrecente DESC
      sort: '-createdAt',
      // popula os dados ao author
      populate: ['user', 'author']
    })

    return res.json({
      purchase
    })
  }

  async store (req, res) {
    // throw new Error()
    // ad:. ID de compra
    // content: mensagem enviado pelo solicitante
    const {
      ad,
      content
    } = req.body

    // informações do anuncio com intenção de compra
    const purchaseAd = await Ad.findById(ad).populate('author')

    if (purchaseAd.purchasedBy) {
      return res.json({ error: 'item não encontado' }).status(404)
    }

    // buscar informçoes do usuaro logado
    const user = await User.findById(req.userId)

    // insere no banco a intenção de compra
    await Purchase.create({ ...req.body, user: req.userId, author: purchaseAd.author })

    // executar a fila
    // faz o envio de email em background, assim não demora muito a reposta
    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()
    // save(): para salvar o job no radis e para ele executar a fila

    return res.send()
  }

  async update (req, res) {
    const { id } = req.params
    const { purchasedBy } = req.body

    const ad = await Ad.findByIdAndUpdate(id, { purchasedBy }, {
      // depois de dar o update ele vai atualizar a infomrção na const ad coma snovas informações
      new: true
    })

    return res.json(ad)
  }
}

module.exports = new PurchaseController()
