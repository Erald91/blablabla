import * as express from 'express';
import IRouterInterface from '../IRouterInterface';
import AuthenticationController from '../../controllers/v1/AuthenticationController';

class Authentication implements IRouterInterface {
  public path: string = '/authentication';

  constructor() { }

  public add(): express.Router {
    const router = express.Router();

    router.post('/register', AuthenticationController.registerUser);
    router.post('/verify-account', AuthenticationController.verifyUser);
    router.post('/reset-password', AuthenticationController.resetPassword);
    router.post('/login', AuthenticationController.login);

    return router;
  }
}

export const authentication = new Authentication();