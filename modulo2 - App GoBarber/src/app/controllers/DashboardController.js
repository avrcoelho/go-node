const { User } = require('../models')

class DashboardController {
  // o unico metodo que vai ter no dash board é o index, pois só tem pagina e mais nada
  async index (req, res) {
    const providers = await User.findAll({ where: { provider: true } })

    return res.render('dashboard', { providers })
  }
}

module.exports = new DashboardController()
