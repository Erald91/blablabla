import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import { config } from './config';
import { v1Router } from './routes/v1';
import { responseMethods } from './middlewares/responseMethods';
import NotFound from './components/errors/response/NotFound';
import Passport from './passport/Passport';

type Port = number | string;

export default class HttpServer {
  private port: Port;
  private application: express.Express;
  private server: any;

  constructor(port: Port) {
    this.port = port;
    this.application = express();
    this.server = null;
  }

  public init() {
    Passport.init();

    this.application.get('/', (req: any, res: any) => {
      res.status(200).send('BlaBlaBla signaling server');
    });

    this.application.get('/version', (req: any, res: any) => {
      res.status(200).send(`Build v${config.version}`);
    });

    this.application.use(bodyParser.json());
    this.application.use(bodyParser.urlencoded({ extended: true }));
    this.application.use(Passport.passportInstance.initialize());
    this.application.use(responseMethods.add);

    // Middleware for path /v1
    this.application.use(v1Router.path, v1Router.add());

    // Manage errors for not found actions 404
    this.application.use((req, res, next) => {
      const error = new NotFound(`Requested route ${req.path} not found`);
      next(error);
    });

    // Manage HttpServer errors
    this.application.use((err, req, res, next) => {
      res.error(err);
    });

    this.server = http.createServer(this.application);
    this.server.listen(this.port, () => {
      console.log(`Server listening in port ${this.port} from worker with PID ${process.pid}`);
    });
  }
}
