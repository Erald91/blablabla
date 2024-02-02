import * as dotenv from 'dotenv';
dotenv.config();
import HttpServer from './HttpServer';
import database from './database';
import { config } from './config';
import * as cluster from 'cluster';
import * as os from 'os';

(async function() {
  const numWorkers = os.cpus().length;
  if (cluster.isMaster) {
    console.log(`Master instance creating worker processes (${numWorkers} in total)`);
    for (let i = 0; i < numWorkers; i++) {
      cluster.fork();
    }
    cluster.on('online', (worker: any) => {
      console.log(`Worker ${worker.process.pid} is online`);
    });
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
      console.log('Starting new worker');
      cluster.fork();
    });
  } else {
    await database.initDatabase({});
    const server = new HttpServer(config.port);
    server.init();
  }
})();
