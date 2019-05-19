const Ad = require('../nodels/Ad')

class AdController {
  // metodo para listagem
  async index (req, res) {
    const filters = {
      purchasedBy: null
    }

    if (req.query.price_min || req.query.price_max) {
      filters.price = {}

      if (req.query.price_min) {
        // $gte busca os resultados que tenha preço menor que...
        // gte é do mongoose
        filters.price.$gte = req.query.price_min
      }

      if (req.query.price_max) {
        // $lte busca os resultados que tenha preço menor que...
        // lte é do mongoose
        filters.price.$lte = req.query.price_max
      }
    }

    if (req.query.title) {
      // esta utilizando o RegExp para ver se o titulo esta em qualquer lugar
      // 'i' tranforma em case sensitive
      filters.title = new RegExp(req.query.title, 'i')
    }

    // troca o find para paginate para usar paginação
    // primeiro filtro
    const ads = await Ad.paginate(filters, {
      page: req.query.page || 1,
      limit: 20,
      // data decrecente DESC
      sort: '-createdAt',
      // popula os dados ao author
      populate: ['author']
    })

    return res.json({
      ads
    })
  }
  // mostrar unico registro
  async show (req, res) {
    const ad = await Ad.findById(req.params.id)

    return res.json({
      ad
    })
  }

  // inserir
  async store (req, res) {
    const ad = await Ad.create({
      ...req.body,
      author: req.userId
    })

    return res.json(ad)
  }

  // atualizar
  async update (req, res) {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      // depois de dar o update ele vai atualizar a infomrção na const ad coma snovas informações
      new: true
    })

    return res.json(ad)
  }

  // deletar
  async destroy (req, res) {
    await Ad.findByIdAndDelete(req.params.id)

    return res.send()
  }
}

module.exports = new AdController()
