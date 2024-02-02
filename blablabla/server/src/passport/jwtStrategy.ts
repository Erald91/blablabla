import * as mongoose from 'mongoose';
import * as passportJWT from 'passport-jwt';
import { config } from '../config';
import database from '../database';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

export const jwtStrategy = new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
}, async function(payload, done) {
  const { email } = payload;

  try {
    const user = (await database.models.UserModel.findByEmail(email) as mongoose.Document);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
