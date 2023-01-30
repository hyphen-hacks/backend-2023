"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = require("fastify");
const Database_1 = __importDefault(require("./Database"));
const apply_1 = require("../routes/apply");
class Server {
    constructor(port) {
        this.port = port;
        this.database = new Database_1.default();
        this.router = (0, fastify_1.fastify)({ logger: true, trustProxy: 1 });
    }
    async start() {
        console.log('[Server] Starting backend server...');
        await this.database.start();
        this.registerRoutes();
        this.router.listen({ port: this.port, host: '0.0.0.0' }, (err, address) => {
            if (err)
                throw err;
            console.log(`[Server] Listening for requests at ${address}!`);
        });
    }
    registerRoutes() {
        this.router.post('/api/2023/apply/attendee', (req, res) => (0, apply_1.handleAttendeeApplication)(req, res, this));
    }
}
exports.default = Server;
