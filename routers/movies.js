const express = require("express");
const moviesController = require("../controllers/movies");
const router = express.Router();
const cors = require("../constants/cors");

router.options("/match", cors);
router.post("/match", cors, moviesController.findMovieMatch);

router.get("/find", cors, moviesController.findMovieByTitle);
router.get("/poster/:tconst", cors, moviesController.getMoviePoster);

module.exports = router;
