const Router = require("express").Router;

const authorizationCode = require("../controllers/authorization.controller");

const router = Router();

router.post("/create",authorizationCode.create);

module.exports = router;
