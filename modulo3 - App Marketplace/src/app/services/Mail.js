const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const exphbs = require('express-handlebars')

const mailConfig = require('../../config/mail')

const transport = nodemailer.createTransport(mailConfig)

const viewPath = path.resolve(__dirname, '..', 'views', 'emails')

// define um middleware
// hbs configgura a maneira que o node lida com tamplates de email
transport.use('compile', hbs({
  viewEngine: exphbs.create({
    // direotrio onde vai armazenar os templates parciais
    // cria uma pasta partials dentro da pasta emails em views
    partialsDir: path.resolve(viewPath, 'partials')
  }),
  viewPath,
  // extesão que vai utilizar para os emails
  extName: '.hbs'
}))
module.exports = transport
