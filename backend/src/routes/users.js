"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const helpers_1 = require("../utils/helpers");
const users_1 = __importDefault(require("../controllers/users"));
const userRouter = (0, express_1.Router)();
userRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    var _a;
    // Get params
    const filter = {
        email: req.query.email,
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        company: req.query.company,
        phone: req.query.phone,
        website: req.query.website,
        location: req.query.location,
        role: req.query.role,
    };
    const sortQuery = (_a = req.query.sort) === null || _a === void 0 ? void 0 : _a.split(":");
    const sort = sortQuery && {
        key: sortQuery[0],
        order: sortQuery[1],
    };
    const pagination = {
        after: req.query.after,
        limit: req.query.limit,
    };
    // Get result
    try {
        const body = yield users_1.default.getUsers(filter, sort, pagination);
        res.status(200).send(body);
    }
    catch (error) {
        const body = { error: error.message };
        res.status(500).send(body);
    }
}));
userRouter.get("/:userid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const body = yield users_1.default.getUser(req.params.userid);
        if (body) {
            res.status(200).send(body);
        }
        else {
            const error = { error: "No user found" };
            res.status(404).send(error);
        }
    }
    catch (error) {
        const body = { error: error.message };
        res.status(500).send(body);
    }
}));
userRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    const _a = req.body, { password } = _a, rest = __rest(_a, ["password"]);
    try {
        const user = yield users_1.default.createUser(rest);
        res.status(201).send(user);
        (0, helpers_1.notify)("/users");
    }
    catch (error) {
        const body = { error: error.message };
        res.status(500).send(body);
    }
}));
userRouter.put("/:userid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const user = yield users_1.default.updateUser(req.query.userid, req.body);
        res.status(200).send(user);
        (0, helpers_1.notify)(`/users/${req.query.userid}`);
    }
    catch (error) {
        const body = { error: error.message };
        res.status(500).send(body);
    }
}));
userRouter.patch("/:userid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const user = yield users_1.default.updateUser(req.query.userid, req.body);
        res.status(200).send(user);
        (0, helpers_1.notify)(`/users/${req.query.userid}`);
    }
    catch (error) {
        const body = { error: error.message };
        res.status(500).send(body);
    }
}));
userRouter.delete("/:userid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    try {
        const user = yield users_1.default.deleteUser(req.query.userid);
        res.status(200).send(user);
        (0, helpers_1.notify)("/users");
    }
    catch (error) {
        const body = { error: error.message };
        res.status(500).send(body);
    }
}));
exports.default = userRouter;
