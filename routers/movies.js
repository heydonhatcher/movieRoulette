const express = require("express");
const moviesController = require("../controllers/movies");
const router = express.Router();
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
};

router.options("/match", cors(corsOptions));
router.post("/match", cors(corsOptions), moviesController.findMovieMatch);

router.get("/find", cors(corsOptions), moviesController.findMovieByTitle);

module.exports = router;
