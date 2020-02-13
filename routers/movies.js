const express = require("express");
const moviesController = require("../controllers/movies");
const router = express.Router();
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000"
};

router.get("/:tconst", cors(corsOptions), moviesController.getMovieById);

router.get(
  "/:tconst/details",
  cors(corsOptions),
  moviesController.getMovieDetailsById
);

router.get(
  "/:nconst/:category",
  cors(corsOptions),
  moviesController.findMovieMatch
);

module.exports = router;
