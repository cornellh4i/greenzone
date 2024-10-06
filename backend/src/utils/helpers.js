"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notify = void 0;
const ws_1 = require("ws");
const websocket_1 = __importDefault(require("./websocket"));
/**
 * Sends a message from the WebSocket server to all connected clients
 *
 * @param resource - The API resource that has been updated; if a user with uuid
 *   `1234` was updated, the resource would be `/users/1234`
 * @returns Void
 */
const notify = (resource) => {
    const data = {
        resource: resource,
        message: "The resource has been updated!",
    };
    websocket_1.default.clients.forEach((client) => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};
exports.notify = notify;
