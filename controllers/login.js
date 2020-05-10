const { GOOGLE_IDENTITY_CLIENT_ID } = require("../constants/protected");
const pool = require("../sql/connection");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(GOOGLE_IDENTITY_CLIENT_ID);

async function verify(token) {
  console.log("verify stage hit");
  const ticket = await client.verifyIdToken({
    idToken: token,
  });
  const payload = ticket.getPayload();
  console.log("PAYLOAD:");
  console.log(payload);
  const userid = payload["sub"];
  return userid;
}

async function lookUpUser(userid) {
  console.log("USERID");
  console.log(userid);
  let sql = "SELECT * FROM auth.users WHERE google_id = $1";
  const results = await pool.query(sql, [userid]);
  console.log(results);
  console.log(results.rows);
  if (results.rows.length !== 1) {
    throw "ERROR_USER_NOT_FOUND";
  }

  return results.rows[0].username;
}

const login = (req, res) => {
  let token = req.body.token;
  console.log("LOGIN HIT");
  console.log(token);
  verify(token)
    .then((userid) => lookUpUser(userid))
    .then((username) => {
      req.session.username = username;
      req.session.save();
      console.log(req.session);
      console.log("SUCCESS");
      return res.send({
        status: "SUCCESS",
        data: {
          username: username,
        },
      });
    })
    .catch((error) =>
      res.send({
        status: "FAILURE",
        error: error,
      })
    );
};

module.exports = {
  login,
};
