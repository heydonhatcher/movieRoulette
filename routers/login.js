const express = require("express");
const router = express.Router();
const cors = require("cors");
const loginController = require("../controllers/login");
const corsOptions = {
  origin: "http://localhost:3000",
};

router.options("/login", cors(corsOptions));
router.post("/login", cors(corsOptions), loginController.login);

module.exports = router;
