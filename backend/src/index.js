"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = __importDefault(require("./utils/websocket"));
const server_1 = __importDefault(require("./utils/server"));
// Express server
const server = server_1.default.listen(process.env.PORT || 8000);
server.on("listening", () => {
    console.log("✅ Server is up and running at http://localhost:8000");
});
server.on("error", (error) => {
    console.log("❌ Server failed to start due to error: %s", error);
});
// WebSocket server
websocket_1.default.on("connection", (ws) => {
    // Error handling
    ws.on("error", console.error);
    // What happens when the server receives data
    ws.on("message", (data) => {
        console.log("received: %s", data);
        ws.send("server received your message!");
    });
    // Default message to send when connected
    ws.send("something");
});
