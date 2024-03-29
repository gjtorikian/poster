const path = require("path");
const isProd = process.env.NODE_ENV == "production";
const posterPassword = Buffer.from(process.env.POSTER_PASSWORD || "");

const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const timingSafeEqual = require("crypto").timingSafeEqual;

const port = 5591;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use(cors());

app.get("/", function (req, res) {
  let password = Buffer.from(req.query.password || "");
  if (!timingSafeEqual(password, posterPassword)) {
    return res.sendStatus(404);
  }

  res.sendFile(__dirname + "/index.html");
});

app.post("/message", function (req, res) {
  let body = req.body;
  let message = `(${body.time}) ${body.message}`;
  let signal = body.signal == true;
  let password = Buffer.from(req.headers.authorization || "");

  if (isProd) {
    if (!timingSafeEqual(password, posterPassword)) {
      return res.sendStatus(404);
    }
  }
  io.emit("message", message, signal);
  res.sendStatus(200);
});

server.listen(port, function () {
  console.log(`Listening on ${port}`);
});

io.on("connection", function () {
  io.emit("message", "connected");
});
