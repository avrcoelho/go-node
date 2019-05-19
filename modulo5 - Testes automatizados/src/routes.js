const routes = require("express").Router();

const authMiddlewareHeader = require("./app/middlewares/auth");

const SessionController = require("./app//controllers/SessionController");

routes.post("/sessions", SessionController.store);

routes.use(authMiddlewareHeader);

routes.get("/dashboard", (req, res) => {
  return res.status(200).send();
});

module.exports = routes;
