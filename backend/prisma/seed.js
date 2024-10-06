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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const alice = yield prisma.user.upsert({
            where: { email: "alice@prisma.io" },
            update: {},
            create: {
                email: "alice@prisma.io",
                firstName: "Alice",
                lastName: "Cool",
                posts: {
                    create: {
                        title: "Check out Prisma with Next.js",
                        content: "https://www.prisma.io/nextjs",
                        published: true,
                    },
                },
                role: client_2.Role.USER,
            },
        });
        const bob = yield prisma.user.upsert({
            where: { email: "bob@prisma.io" },
            update: {},
            create: {
                email: "bob@prisma.io",
                firstName: "Bob",
                lastName: "Awesome",
                posts: {
                    create: [
                        {
                            title: "Follow Prisma on Twitter",
                            content: "https://twitter.com/prisma",
                            published: true,
                        },
                        {
                            title: "Follow Nexus on Twitter",
                            content: "https://twitter.com/nexusgql",
                            published: true,
                        },
                    ],
                },
                role: client_2.Role.ADMIN,
            },
        });
        console.log({ alice, bob });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
