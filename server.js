const path = require("path");
const isProd = process.env.NODE_ENV == "production";
const password = process.env.POSTER_PASSWORD;

const express = require("express");
const app = express();
const http = (isProd ? require("https") : require("http")).Server(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");

const port = 5591;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

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

io.on("connection", function (socket) {
  socket.emit("message", "Connected.");
});

http.listen(port, function () {
  console.log("Listening on " + port);
});
