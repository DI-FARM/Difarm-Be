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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const SALT_ROUNDS = 10;
const seedUsers = [
    {
        role: client_1.Roles.SUPERADMIN,
        username: 'superadmin',
        email: 'superadmin@difarm.local',
        phone: '+250700000001',
        password: 'SuperAdmin1',
        fullname: 'Super Administrator',
        gender: client_1.Gender.MALE,
    },
    {
        role: client_1.Roles.ADMIN,
        username: 'admin',
        email: 'admin@difarm.local',
        phone: '+250700000002',
        password: 'AdminPass1',
        fullname: 'Farm Administrator',
        gender: client_1.Gender.MALE,
    },
    {
        role: client_1.Roles.MANAGER,
        username: 'manager',
        email: 'manager@difarm.local',
        phone: '+250700000003',
        password: 'ManagerPass1',
        fullname: 'Farm Manager',
        gender: client_1.Gender.MALE,
    },
];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Seeding users by role...');
        for (const u of seedUsers) {
            const existing = yield prisma.account.findUnique({
                where: { username: u.username },
            });
            if (existing) {
                console.log(`  Skip ${u.role}: account "${u.username}" already exists.`);
                continue;
            }
            const hashedPassword = yield bcrypt_1.default.hash(u.password, SALT_ROUNDS);
            const account = yield prisma.account.create({
                data: {
                    username: u.username,
                    email: u.email,
                    phone: u.phone,
                    role: u.role,
                    password: hashedPassword,
                    status: true,
                },
            });
            yield prisma.user.create({
                data: {
                    accountId: account.id,
                    fullname: u.fullname,
                    gender: u.gender,
                },
            });
            console.log(`  Created ${u.role}: ${u.username} (password: ${u.password})`);
        }
        console.log('Seed completed.');
    });
}
main()
    .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
