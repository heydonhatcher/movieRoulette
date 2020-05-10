const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const moviesRouter = require("./routers/movies");
const loginRouter = require("./routers/login");
const pool = require("./sql/connection");

const app = express();
const port = process.env.PORT || 4001;

//middleware
app.use(bodyParser.json());
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
      schemaName: "auth",
    }),
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
    secret: "insecure",
    resave: false,
    saveUninitialized: true,
  })
);

//routers
app.use("/movies", moviesRouter);
app.use("/user", loginRouter);

app.get("/", (req, res) => {
  res.send("Welcome to our server!");
});

app.listen(port, () => {
  console.log(`Web server is listening on port ${port}!`);
});
