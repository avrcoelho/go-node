const Purchase = require('../nodels/Purchase')

class ApproverController {
  async update (req, res) {
    const {
      id
    } = req.params

    const {
      ad
    } = await Purchase.findById(id)
      .populate({
        // return o ad e popula o author
        path: 'ad',
        populate: {
          path: 'author'
        }
      })

    if (!ad.author._id.equals(req.userId)) {
      return res.status(401).json({
        error: 'You´re not the ad  author'
      })
    }

    // verifica se ja não foi aprovado
    if (ad.purchasedBy) {
      return res.status(401).json({
        error: 'This ad had already been purchase'
      })
    }

    ad.purchasedBy = id

    // atualiza o ad
    await ad.save()

    return res.json(ad)
  }
}

module.exports = new ApproverController()
