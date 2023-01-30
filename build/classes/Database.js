"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class Database {
    constructor() {
        this.db = new client_1.PrismaClient();
    }
    async start() {
        await this.db.$connect();
        console.log('[MongoDB] Connected to database!');
    }
    async createParticipantApplication(update) {
        return await this.db.participantApplication.create({
            data: update,
        });
    }
}
exports.default = Database;
