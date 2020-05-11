const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login");
const cors = require("../constants/cors");

router.options("/login", cors);
router.post("/login", cors, loginController.login);

module.exports = router;
