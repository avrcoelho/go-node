'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')

class FileController {
  async show ({ params, response }) {
    const file = await File.findOrFail(params.id)

    // isso faz retornar o arquivo como download, não como texto ou json
    return response.download(Helpers.tmpPath(`uploads/${file.file}`))
  }

  async store ({ request, response }) {
    try {
      // verifica se não tem um arquivo na requisição
      if (!request.file('file')) return false

      // size: tamanho limite para os arquivos
      const upload = request.file('file', { size: '2mb' })

      // nome do arquvio é a timestamp mais a extenção
      const fileName = `${Date.now()}.${upload.subtype}`

      await upload.move(Helpers.tmpPath('uploads'), {
        name: fileName
      })

      // verifica se houve o upload
      if (!upload.moved()) {
        throw upload.error()
      }

      // novo registro na tabela de files
      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })

      return file
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Erro no upload de arquivo' } })
    }
  }
}
module.exports = FileController
