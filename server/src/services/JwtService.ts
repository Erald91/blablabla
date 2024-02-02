import * as jwt from 'jsonwebtoken';
import { config } from '../config';

export default class JwtService {
  public static signToken(payload: any, options: any = {}) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, config.jwtSecret, {
        expiresIn:`${String(config.jwtExpiration)}s`,
        ...options
      }, function(err, token) {
        if (err) {
          return reject(err);
        }
        return resolve(token);
      });
    });
  }
}
