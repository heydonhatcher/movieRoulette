const express = require("express");
const moviesController = require("../controllers/movies");
const router = express.Router();
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000"
};

router.get("/:tconst", cors(corsOptions), moviesController.getMovieById);

router.get(
  "/:tconst/principals",
  cors(corsOptions),
  moviesController.getPrincipalsByMovieId
);

router.get(
  "/:tconst/details",
  cors(corsOptions),
  moviesController.getMovieDetailsById
);
router.options("/match", cors(corsOptions));
router.post("/match", cors(corsOptions), moviesController.findMovieMatch);

router.get(
  "/poster/:tconst",
  cors(corsOptions),
  moviesController.getMoviePoster
);

router.get(
  "/find/:title",
  cors(corsOptions),
  moviesController.findMovieByTitle
);

module.exports = router;
