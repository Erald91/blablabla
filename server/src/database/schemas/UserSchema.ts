import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import BaseSchema from './BaseSchema';
import * as uuid from 'uuid';
import database from '../';
import DocumentNotFound from '../../components/errors/document/DocumentNotFound';

export interface IUser {
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  token?: string;
  verificationCode?: string;
  resetCode?: string;
}

const modelName = 'User';
const properties = {
  username: {
    type: String,
    required: false,
    default: null
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // rooms: {
  //   type: mongoose.Shema.Types.ObjectId,
  //   ref: 'Room'
  // },
  avatar: {
    type: String,
    required: false,
    default: null
  },
  verificationCode: {
    type: String,
    required: false,
    default: null
  },
  resetCode: {
    type: String,
    required: false,
    default: null
  }
};
const options = {};

class UserSchema extends BaseSchema {
  constructor() {
    super(modelName, properties, options);

    // Setup compound indexes
    this.schema.index({ email: 1, verificationCode: 1, resetCode: 1 });

    // Setup validation for email path
    this.schema.path('email').validate({
      isAsync: true,
      validator: function(email, cb) {
        const doc = this;
        let user: mongoose.Document = null;
        
        database.models.UserModel.findByEmail(email, (err, user) => {
          if (err && !DocumentNotFound.isSameInstance(err)) {
            cb(false, err.message);
          } else {
            cb(user && user._id.equals(doc._id) ? true : !user, `Email ${email} is already in use.`);
          }
        });
      }
    });

    // Define documents methods
    this.schema.methods.hashPassword = function() {
      const doc = this;
      return new Promise((resolve, reject) => {
        bcrypt.hash(doc.password, 12, function(err, hash) {
          if (err) {
            return reject(err);
          } else {
            doc.password = hash;
            return resolve();
          }
        });
      });
    }

    this.schema.methods.verifyPassword = function(password: string) {
      const doc = this;
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, doc.password, function(err, res) {
          if (err) {
            return reject(err);
          }

          return resolve(Boolean(res));
        });
      });
    }

    this.schema.methods.generateResetCode = function() {
      this.resetCode = uuid.v4();
    }

    // Define pre hooks
    this.schema.pre('save', async function(next) {
      const doc = this;
      if (doc.isNew) {
        await doc.hashPassword();
        doc.verificationCode = uuid.v4();
      }

      next();
    });
  }
}

export const userSchema = new UserSchema();
