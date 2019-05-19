module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    //  objeto de informação que vão ficar disponiveis para todas as views
    res.locals.user = req.session.user

    return next()
  }

  return res.redirect('/')
}
