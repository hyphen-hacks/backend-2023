import 'dotenv/config.js';
import Server from './classes/Server';

const { PORT } = process.env;

const server = new Server(Number(PORT));
server.start();
