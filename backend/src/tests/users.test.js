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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../utils/server"));
const users_1 = __importDefault(require("../controllers/users"));
describe("Sanity check", () => {
    test("Ensure tests run", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(true).toBe(true);
    }));
});
describe("GET /users", () => {
    test("Get all users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users");
        expect(response.status).toBe(200);
        expect(response.body.result.length > 0).toBe(true);
    }));
});
describe("GET /users/:userid", () => {
    test("Get a valid user", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = (yield users_1.default.getUsers()).result[0];
        const response = yield (0, supertest_1.default)(server_1.default).get(`/users/${user.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(user);
    }));
    test("Get an invalid user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/asdf");
        expect(response.status).toBe(404);
    }));
});
