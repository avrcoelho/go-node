const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')
const {
  promisify
} = require('util')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      error: 'token not provided'
    })
  }

  // remover a palavra barear
  const [, token] = authHeader.split(' ')

  try {
    // essa função não retorna uma promise, então usa o callback
    // para resolver isso usamos o promisify
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)

    // toda rota que usar esse mddleware vai ter acesso ao userId
    req.userId = decoded.id

    return next()
  } catch (err) {
    return res.status(401).json({
      error: 'Token invalid'
    })
  }
}
