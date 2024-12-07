import Express from "express";

/**** Node.js libraries *****/
const path = require("path");
import routes from "./routes";

/**** External libraries ****/
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

/**** Configuration ****/
const app = express();

function createServer() {
  // const routes = require("./routes");

  app.use(bodyParser.json({ limit: "100mb" }));
  app.use(bodyParser.urlencoded({ extended: false, limit: "100mb" }));
  // app.use(morgan("combined"));

  app.use(cors());

  // /**** Add routes ****/
  app.use("/api", routes);
  app.use("/languages", express.static(path.join(__dirname, "languages")));

  // "Redirect" all non-API GET requests to React's entry point (index.html)
  app.get("*", (req: Express.Request, res: Express.Response) =>
    res.send("You have reached a route not defined in this API")
  );

  // Root Url
  app.get("/", (req: Express.Request, res: Express.Response) => {
    res.send("Hello World!").status(200);
  });

  return app;
}

module.exports = createServer;
