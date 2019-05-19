// tem que ter () pois esse export esporta uam função
// com isso ele vai exportar todos os arquivos da pasta controllers
module.exports = require('require-dir')()
