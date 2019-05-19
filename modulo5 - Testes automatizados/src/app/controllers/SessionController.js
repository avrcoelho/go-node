const { User } = require("../models");
const Mail = require("../services/MailService");

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send({ message: "user not found" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).send({ message: "Incorrect pasword" });
    }

    await Mail.send({
      from: "André Coelho <anvrcoelho@gmail.com>",
      to: `${user.name} <${user.email}>`,
      subject: "Acesso em sua conta",
      text: "novo registro em sua conta"
    });

    return res.json({
      token: await user.generateToken()
    });
  }
}

module.exports = new SessionController();
