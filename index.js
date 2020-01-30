const express = require("express");
const bodyParser = require("body-parser");
const moviesRouter = require("./routers/movies");

const app = express();
const port = process.env.PORT || 4001;

app.use(bodyParser.json());
app.use("/movies", moviesRouter);

app.get("/", (req, res) => {
  res.send("Welcome to our server!");
});

app.listen(port, () => {
  console.log(`Web server is listening on port ${port}!`);
});
