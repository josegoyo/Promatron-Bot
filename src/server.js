const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createServer } = require("http");

const SlackController = require("../controllers/SlackController");

let corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.httpServer = createServer(this.app);

    this.middlewares();
    this.routes();
    this.controllers();
  }

  routes() {
    //Index Default
    this.app.get("/", function (req, res) {
      res.sendFile(path.join(__dirname, "../views/index.html"));
    });
  }

  controllers() {
    SlackController.listenCommands();
    SlackController.scheduleSlackCommands();
  }

  middlewares() {
    this.app.use(express.static("public"));
    this.app.use(cors(corsOptions));
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
  }

  listen() {
    this.httpServer.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  }
}

module.exports = Server;
