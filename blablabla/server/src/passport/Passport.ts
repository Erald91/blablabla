import * as passport from 'passport';
import * as LocalStrategy from 'passport-local';
import * as passportJWT from 'passport-jwt';
import { localStrategy } from './localStrategy';
import { jwtStrategy } from './jwtStrategy';
import database from '../database';
import JwtService from '../services/JwtService';
import { config } from '../config';
import NotAuthenticated from '../components/errors/response/NotAuthenticated';

export default class Passport {
	public static passportInstance: any = passport;

	public static init() {
    Passport.passportInstance.use(Passport.localStrategy);
      Passport.passportInstance.use(new passportJWT.Strategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwtSecret
      }, function(payload, done) {
        const { email } = payload;
      
        try {
          console.log('Retrieved payload', payload);
          // const user = (await database.models.UserModel.findByEmail(email) as mongoose.Document);
          done(null, { some: 'some' });
        } catch (error) {
          console.log('Error', payload);
          done(error);
        }
      })
    );
	}

	public static doLocalAuthentication(req: any, options: any = {}) {
    return new Promise((resolve, reject) => {
      Passport.passportInstance.authenticate('local', { ...options, session: false }, async (err, user, info) => {
        if (err) {
          return reject(err);
        }

        if (!user) {
          return reject(new Error(`Email and Password doesn't match`));
        }

        const token = (await JwtService.signToken({ email: user.email }) as string);

        return resolve({ user, token });

      })(req);
    });
  }
  
  public static doJWTAuthentication(req: any, options: any = {}) {
    return new Promise((resolve, reject) => {
      Passport.passportInstance.authenticate('jwt', { ...options, session: false }, (err, user, info) => {
        if (err) {
          return reject(err);
        }

        if (!user) {
          return reject(new NotAuthenticated('Authorization header is missing or token is invalid'));
        }

        return resolve(user);

      })(req);
    });
  }

  private static localStrategy: LocalStrategy = localStrategy;
  private static jwtStrategy: passportJWT.Strategy = jwtStrategy;
}