const moment = require('moment')
const { Op } = require('sequelize')
const { Appointment } = require('../models')

class AvaliableController {
  async index (req, res) {
    const date = moment(parseInt(req.query.date))

    console.log(date)

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.provider,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      }
    })

    const schedule = [
      '8:00',
      '9:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00'
    ]

    const avaliable = schedule.map(time => {
      const [hour, minute] = time.split(':')
      const value = date.hour(hour).minute(minute).second(0)
      console.log(value)

      return {
        time,
        value: value.format(),
        //  verifica se os horarios ja passou ou não passou
        avaliable: value.isAfter(moment()) && !appointments.find(a => moment(a.date).format('HH:mm') === time)
      }
    })

    console.log(moment())

    return res.render('avaliable/index', { avaliable })
  }
}

module.exports = new AvaliableController()
