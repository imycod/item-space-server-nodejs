const Router = require("express").Router;

const client = require("../controllers/client.controller");

const router = Router();

router.post("/create",client.create);

module.exports = router;
