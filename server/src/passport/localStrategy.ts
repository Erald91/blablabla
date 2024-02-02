import * as mongoose from 'mongoose';
import * as LocalStrategy from 'passport-local';
import database from '../database';

export const localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password' 
}, async function(email, password, cb) {
  try {
    const user = (await database.models.UserModel.findByEmail(email) as mongoose.Document);
    const macthPassword = (await user.verifyPassword(password) as boolean);
    if (macthPassword) {
      cb(null, user);
    } else {
      cb(new Error(`Password doesn't match`));
    }
  } catch (error) {
    cb(error);
  }
});
