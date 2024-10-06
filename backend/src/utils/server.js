"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const users_1 = __importDefault(require("../routes/users"));
const api_spec_json_1 = __importDefault(require("../../api-spec.json"));
const app = (0, express_1.default)();
// Swagger endpoint
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(api_spec_json_1.default));
// Middleware to allow cross-origin requests
app.use((0, cors_1.default)());
// Subrouters for our main router
app.use("/users", users_1.default);
// Root route
app.get("/", (req, res) => {
    res.send("Hello World!").status(200);
});
// Default route for undefined endpoints
app.get("*", (req, res) => {
    res.send("You have reached a route not defined in this API");
});
exports.default = app;
