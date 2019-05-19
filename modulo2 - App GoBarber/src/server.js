const express = require('express')
const session = require('express-session')
const LokiStore = require('connect-loki')(session)
const nunjucks = require('nunjucks')
const path = require('path')
const flash = require('connect-flash')
const dateFilter = require('nunjucks-date-filter')

class App {
  constructor () {
    this.express = express()
    // verifica se é dev ou prod
    this.isDev = process.env.NODE_ENV !== 'production'

    this.middlewares()
    this.views()
    this.routes()
  }

  middlewares () {
    this.express.use(express.urlencoded({
      extended: false
    }))
    // esse flash é como se ele criasse uma sessão só para o próximo carregamento da página
    //  ele é bom para mostrar os erros, que é para o que ele é usado
    this.express.use(flash())

    this.express.use(session({
      // nome da sessão
      name: 'root',
      // criptografar a sessão
      secret: 'myAppSecret',
      resave: false,
      saveUninitialized: true,
      store: new LokiStore({
        path: path.resolve(__dirname, '..', 'tmp', 'sessions.db')
      })
    }))
  }

  views () {
    const env = nunjucks.configure(path.resolve(__dirname, 'app', 'views'), {
      //   só assiste o reistart das views em dev
      watch: this.isDev,
      express: this.express,
      autoescape: true
    })

    env.addFilter('date', dateFilter)

    // para acessar a pasta public e ler os arquivos
    this.express.use(express.static(path.resolve(__dirname, 'public')))

    this.express.set('view engine', 'njk')
  }

  routes () {
    this.express.use(require('./routes'))
  }
}

// só vai precisar passar o express para ser usado em outros arquivos
module.exports = new App().express
