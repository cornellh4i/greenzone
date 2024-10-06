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
const client_1 = __importDefault(require("../utils/client"));
/**
 * Gets all users in database and all data associated with each user
 *
 * @param filter - Filter params passed in
 * @param sort - Sort params passed in
 * @param pagination - Pagination params passed in
 * @returns A promise with list of users
 */
const getUsers = (filter, sort, pagination) => __awaiter(void 0, void 0, void 0, function* () {
    /** Prisma filtering object, handles GET /users?firstName=Bob&lastName=Jackson */
    const whereDict = {
        email: filter === null || filter === void 0 ? void 0 : filter.email,
        firstName: filter === null || filter === void 0 ? void 0 : filter.firstName,
        lastName: filter === null || filter === void 0 ? void 0 : filter.lastName,
        company: filter === null || filter === void 0 ? void 0 : filter.company,
        phone: filter === null || filter === void 0 ? void 0 : filter.phone,
        role: { equals: filter === null || filter === void 0 ? void 0 : filter.role },
    };
    /** Prisma sort object, handles GET /users?sort=firstName:asc */
    const orderBy = sort
        ? { [sort.key]: sort.order }
        : { id: "asc" };
    /** Prisma pagination object, handles GET /users?limit=20&after=asdf */
    let take = (pagination === null || pagination === void 0 ? void 0 : pagination.limit) ? parseInt(pagination === null || pagination === void 0 ? void 0 : pagination.limit) : 10;
    let skip = (pagination === null || pagination === void 0 ? void 0 : pagination.after) ? 1 : undefined;
    let cursor = (pagination === null || pagination === void 0 ? void 0 : pagination.after)
        ? { id: pagination === null || pagination === void 0 ? void 0 : pagination.after }
        : undefined;
    /** Total number of records before pagination is applied */
    const total = yield client_1.default.user.count({
        where: { AND: [whereDict] },
    });
    const result = yield client_1.default.user.findMany({
        where: { AND: [whereDict] },
        orderBy: orderBy,
        take: take,
        skip: skip,
        cursor: cursor,
    });
    const lastVisiblePost = take ? result[take - 1] : result[result.length - 1];
    const nextCursor = lastVisiblePost ? lastVisiblePost.id : "";
    return { result, nextCursor, total };
});
/**
 * Gets a user by userid
 *
 * @param userid - The id of user to be retrieved
 * @returns Promise with the retrieved user or null
 */
const getUser = (userid) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.findUnique({
        where: { id: userid },
    });
});
/**
 * Creates a new user
 *
 * @param user - User object
 * @returns Promise with the created user
 */
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.create({
        data: Object.assign({}, user),
    });
});
/**
 * Updates the user with a new User object
 *
 * @param userid - The id of user to be updated
 * @param user - A complete User object
 * @returns A promise with the updated user
 */
const updateUser = (userid, user) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.update({
        where: { id: userid },
        data: Object.assign({}, user),
    });
});
/**
 * Deletes specified user by userid.
 *
 * @param userid - The id of the user to be deleted
 * @returns A promise with the deleted user
 */
const deleteUser = (userid) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.delete({
        where: {
            id: userid,
        },
    });
});
exports.default = { getUsers, getUser, createUser, updateUser, deleteUser };
