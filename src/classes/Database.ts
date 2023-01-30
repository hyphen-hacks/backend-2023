import { ParticipantApplication, PrismaClient } from '@prisma/client';

export default class Database {
  db: PrismaClient;
  constructor() {
    this.db = new PrismaClient();
  }

  async start() {
    await this.db.$connect();
    console.log('[MongoDB] Connected to database!');
  }

  async createParticipantApplication(update: ParticipantApplication) {
    return await this.db.participantApplication.create({
      data: update,
    });
  }
}
