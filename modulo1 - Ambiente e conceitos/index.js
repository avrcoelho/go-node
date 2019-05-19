const express = require('express')
const nunjucks = require('nunjucks')

const app = express()

nunjucks.configure('views', {
  // manipular nome dos arquivos, fazer auto escape dinamicamente
  autoescape: true,
  express: app,
  // faz como se fosse o nodemon
  watch: true
})

// saber lidar com as informações de um form html
app.use(express.urlencoded({
  extended: false
}))

// set seta configurações globais
app.set('view engine', 'njk')

const users = ['André', 'Sabrina', 'Heloíza', 'Zilma', 'Janes']

app.get('/', (req, res) => {
  // primeiro paraemtro o ome da template
  return res.render('list', {
    users
  })
})

app.get('/new', (req, res) => {
  return res.render('new')
})

app.post('/create', (req, res) => {
  users.push(req.body.user)
  return res.redirect('/')
})

app.listen(3000)
