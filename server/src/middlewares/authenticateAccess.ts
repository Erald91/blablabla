import IMiddlewareInterface from './IMiddlewareInterface';
import Passport from '../passport/Passport';

class AuthenticateAccess implements IMiddlewareInterface {
  constructor() { }

  public async add(req, res, next) {
    try {
      const user = await Passport.doJWTAuthentication(req);
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
}

export const authenticateAccess = new AuthenticateAccess();
