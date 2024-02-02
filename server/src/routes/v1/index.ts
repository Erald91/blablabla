import * as express from 'express';
import IRouterInterface from '../IRouterInterface';
import { authentication } from  './authentication';
import { authenticateAccess } from '../../middlewares/authenticateAccess'

class V1Router implements IRouterInterface {
  public path: string = '/v1';
  
  constructor() { }

  public add(): express.Router {
    const router = express.Router();

    // Middleware for path /authentication
    router.use(authentication.path, authentication.add());

    return router;
  }
}

export const v1Router = new V1Router();