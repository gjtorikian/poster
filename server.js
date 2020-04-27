const path = require("path");
const isProd = process.env.NODE_ENV == "production";
const password = process.env.POSTER_PASSWORD;

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");

const port = 5591;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use(cors());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/message", function (req, res) {
  let body = req.body;
  let message = body.message;
  if (isProd) {
    if (password != req.headers.authorization) {
      return res.sendStatus(404);
    }
  }
  io.emit("message", message);
  res.sendStatus(200);
});

server.listen(port, function () {
  console.log(`Listening on ${port}`);
});

io.on("connection", function () {
  io.emit("message", "connected");
});
