const appName = "Server API";
const port = process.env.PORT || 8080;
const createServer = require("./server");
import connectToServer from "./db/conn";
const server = createServer();
// get driver connection
// const dbo = require("./db/conn");
server.listen(port, () => {
  // perform a database connection when server starts
  connectToServer((err?: Error) => {
    if (err) console.error(err);
  });
  console.log(`${appName} running on port ${port}!`);
});
