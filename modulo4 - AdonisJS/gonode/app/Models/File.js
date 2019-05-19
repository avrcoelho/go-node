'use strict'

const Model = use('Model')
// pega dados do arquivo .env
const Env = use('Env')

class File extends Model {
  // criar campo virtual, campo que não existe na tabela
  static get computed () {
    // retorna o novo campo
    return ['url']
  }

  // aqui recebe o model. Por desestruturação pega o id do model
  // cria o novo campo get junto com o novo campo que criou no computed
  getUrl ({ id }) {
    // pega a variavel do arquivo .env
    // passa a rota criada de arquivos
    return `${Env.get('APP_URL')}/files/${id}`
  }
}

module.exports = File
