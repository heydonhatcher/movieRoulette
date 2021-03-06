const pool = require("../sql/connection");
const { handleSQLError } = require("../sql/error");
const fetch = require("node-fetch");
const { OMDB_API_KEY } = require("../constants/protected");

const _getMovie = (tconst) => {
  let sql = "SELECT * FROM title_basics WHERE tconst = $1";
  return pool.query(sql, [tconst]).then((res) => {
    return res.rows[0];
  });
};

const getMovieById = (req, res) => {
  _getMovie(req.params.tconst)
    .then((movieData) => {
      return res.send(movieData);
    })
    .catch((err) => {
      return handleSQLError(res, err);
    });
};

const getMovieDetailsById = (req, res) => {
  let payload;
  let sql =
    "SELECT * FROM title_basics INNER JOIN title_principals USING (tconst) INNER JOIN name_basics USING (nconst) WHERE tconst = $1 ORDER BY ordering asc";
  pool.query(sql, [req.params.tconst], (err, dbRes) => {
    if (err) return handleSQLError(res, err);
    payload = dbRes.rows[0];
    getMoviePoster(dbRes.rows[0].tconst).then((posterUrl) => {
      payload.poster = posterUrl;
      return res.send(payload);
    });
  });
};

const getPrincipalsByMovieId = (req, res) => {
  let sql =
    "SELECT * FROM title_principals INNER JOIN name_basics USING (nconst) WHERE tconst = $1";
  pool.query(sql, [req.params.tconst], (err, dbRes) => {
    if (err) return handleSQLError(res, err);
    return res.send(dbRes.rows);
  });
};

const findMovieMatch = (req, res) => {
  if (!req.session.username) {
    return res.send({
      error: {
        type: "ERROR_USER_NOT_LOGGED_IN",
      },
    });
  }
  let sql = `WITH titles AS (
      SELECT DISTINCT tconst
      FROM
        title_basics AS tb INNER JOIN title_principals as tp USING (tconst)
      WHERE 
      tb.titletype = 'movie'
      AND tp.category IN ('director', 'writer', 'actor', 'actress')
      AND tp.nconst = ANY($1)
      AND tb.tconst != $2
      AND tb.isadult = false
    )
    SELECT
      tconst,
      primarytitle as title,
      startyear as year,
      array_to_json(ARRAY(
        SELECT
          json_build_object('nconst', nconst, 'name', primaryname)
        FROM
          title_principals tp INNER JOIN name_basics nb USING (nconst)
        WHERE
          tp.tconst = titles.tconst
          AND category = 'director'
      )) as directors,
      array_to_json(ARRAY(
        SELECT
          json_build_object('nconst', nconst, 'name', primaryname)
        FROM
          title_principals tp INNER JOIN name_basics nb USING (nconst)
        WHERE
          tp.tconst = titles.tconst
          AND category = 'writer'
      )) as writers,
        array_to_json(ARRAY(
        SELECT
          json_build_object('nconst', nconst, 'name', primaryname)
        FROM
          title_principals tp INNER JOIN name_basics nb USING (nconst)
        WHERE
          tp.tconst = titles.tconst
          AND category in ('actor', 'actress')
      )) as actors
    FROM
      titles INNER JOIN title_basics USING (tconst)
    ORDER BY random()  
    LIMIT 50`;
  pool.query(sql, [req.body.people, req.body.exclude], (err, dbRes) => {
    if (err) return handleSQLError(res, err);
    return res.send({
      error: null,
      data: dbRes.rows,
    });
  });
};

const findMovieByTitle = (req, res) => {
  if (!req.session.username) {
    return res.send({
      error: {
        type: "ERROR_USER_NOT_LOGGED_IN",
      },
    });
  }
  let sql = `SELECT
    tconst,
    primarytitle as title,
    startyear as year,
    array_to_json(ARRAY(
      SELECT
        json_build_object('nconst', nconst, 'name', primaryname)
      FROM
        title_principals tp INNER JOIN name_basics nb USING (nconst)
      WHERE
        tp.tconst = tb.tconst
        AND category = 'director'
    )) as directors,
    array_to_json(ARRAY(
      SELECT
        json_build_object('nconst', nconst, 'name', primaryname)
      FROM
        title_principals tp INNER JOIN name_basics nb USING (nconst)
      WHERE
        tp.tconst = tb.tconst
        AND category = 'writer'
    )) as writers,
      array_to_json(ARRAY(
      SELECT
        json_build_object('nconst', nconst, 'name', primaryname)
      FROM
        title_principals tp INNER JOIN name_basics nb USING (nconst)
      WHERE
        tp.tconst = tb.tconst
        AND category in ('actor', 'actress')
    )) as actors
  FROM
    title_basics tb
  WHERE
    tb.titletype = 'movie'
    AND translate(lower(primarytitle), '.-/,";:', '') LIKE '%' || translate(lower($1), '.-/,";:', '') || '%'
    AND tb.isadult = false
  ORDER BY random()
  LIMIT 50  
  `;
  pool.query(sql, [req.query.title], (err, dbRes) => {
    if (err) return handleSQLError(res, err);
    return res.send({
      error: null,
      data: dbRes.rows,
    });
  });
};

const getMoviePoster = (req, res) => {
  if (!req.session.username) {
    return res.send({
      error: {
        type: "ERROR_USER_NOT_LOGGED_IN",
      },
    });
  }
  let tconst = req.params.tconst;
  let url = `http://img.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${tconst}`;
  fetch(url, {
    method: "GET",
  })
    .then((data) => data.arrayBuffer())
    .then((buff) => {
      res.contentType("jpeg");
      res.end(Buffer.from(buff));
    })
    .catch((err) =>
      res.send({
        error: err,
      })
    );
};

module.exports = {
  getMovieById,
  getMovieDetailsById,
  findMovieMatch,
  getPrincipalsByMovieId,
  getMoviePoster,
  findMovieByTitle,
};
