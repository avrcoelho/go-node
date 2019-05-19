const moment = require('moment')
const {
  Op
} = require('sequelize')

const {
  User,
  Appointment
} = require('../models')

class AppointmentController {
  async create (req, res) {
    // findByPk: busca o suuario pelo id dele
    const provider = await User.findByPk(req.params.provider)

    return res.render('appointments/create', {
      provider
    })
  }

  async store (req, res) {
    const {
      id
    } = req.session.user
    const {
      provider
    } = req.params
    const {
      date
    } = req.body

    console.log(date)

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      date
    })

    return res.redirect('/app/dashboard')
  }

  async show (req, res) {
    const {
      id: provider
    } = req.session.user
    const date = moment(parseInt(req.params.date))

    const appointments = await Appointment.findAll({
      include: [{
        model: User,
        as: 'user'
      }],
      where: {
        provider_id: provider,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      }
    })

    return res.render('schedule/index', {
      appointments
    })
  }
}

module.exports = new AppointmentController()
