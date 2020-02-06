const pool = require("../sql/connection");
const { handleSQLError } = require("../sql/error");
const fetch = require("node-fetch");
require("dotenv").config();

const _getMovie = tconst => {
  let sql = "SELECT * FROM title_basics WHERE tconst = $1";
  return pool.query(sql, [tconst]).then(res => {
    return res.rows[0];
  });
};

const getMovieById = (req, res) => {
  _getMovie(req.params.tconst)
    .then(movieData => {
      return res.send(movieData);
    })
    .catch(err => {
      return handleSQLError(res, err);
    });
};

const getMovieDetailsById = (req, res) => {
  let sql =
    "SELECT * FROM title_basics INNER JOIN title_principals USING (tconst) INNER JOIN name_basics USING (nconst) WHERE tconst = $1 ORDER BY ordering asc";
  pool.query(sql, [req.params.tconst], (err, dbRes) => {
    if (err) return handleSQLError(res, err);
    return res.send(dbRes.rows);
  });
};

const findMovieMatch = (req, res) => {
  let payload;
  let sql =
    "SELECT * FROM title_principals INNER JOIN title_basics USING (tconst) WHERE nconst LIKE $1 AND category LIKE $2 ORDER BY random() LIMIT 1";
  pool.query(sql, [req.params.nconst, req.params.category], (err, dbRes) => {
    if (err) return handleSQLError(res, err);
    payload = dbRes.rows[0];
    getMoviePoster(dbRes.rows[0].tconst).then(posterUrl => {
      payload.poster = posterUrl;
      console.log("payload.poster: ", payload.poster);
      return res.send(payload);
    });
  });
};

const getMoviePoster = tconst => {
  console.log("tconst: ", tconst);
  return fetch(
    `https://omdbapi.com?apikey=${process.env.OMDB_API_KEY}&i=${tconst}`
  )
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data["Poster"];
    });
};

module.exports = {
  getMovieById,
  getMovieDetailsById,
  findMovieMatch
};
