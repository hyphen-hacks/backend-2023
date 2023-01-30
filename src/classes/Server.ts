import { fastify, FastifyInstance } from 'fastify';
import Database from './Database';

import { handleAttendeeApplication } from '../routes/apply';

export default class Server {
  port: number;
  database: Database;
  router: FastifyInstance;
  constructor(port: number) {
    this.port = port;
    this.database = new Database();
    this.router = fastify({ logger: true, trustProxy: 1 });
  }

  async start() {
    console.log('[Server] Starting backend server...');
    await this.database.start();
    this.registerRoutes();

    this.router.listen({ port: this.port, host: '0.0.0.0' }, (err, address) => {
      if (err) throw err;
      console.log(`[Server] Listening for requests at ${address}!`);
    });
  }

  registerRoutes() {
    this.router.post('/api/2023/apply/attendee', (req, res) =>
      handleAttendeeApplication(req, res, this)
    );
  }
}
