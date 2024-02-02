import * as mongoose from 'mongoose';
import BaseModel from './BaseModel';
import { userSchema, IUser } from '../schemas/UserSchema';
import DocumentNotFound from '../../components/errors/document/DocumentNotFound';

export default class UserModel extends BaseModel {
  constructor(conn: mongoose.Connection) {
    super(userSchema.modalName, userSchema.schema, conn);
  }

  public createUser(userData: IUser) {
    return new Promise(async (resolve, reject) => {
      const user = new this.model(userData);

      user.save(function(err) {
        if (err) {
          return reject(err);
        }
        // TODO: Send email with verification link to confirm registration
        return resolve(user);
      });
    });
  }

  public findByEmail(email: string, cb: (err: any, user: any) => void = null) {
    return new Promise((resolve, reject) => {
      this.model.findOne({ email }, function(err, user) {
        if (err) {
          cb && cb(err, null);
          return reject(err);
        }

        if (!user) {
          const err = new DocumentNotFound(`User with email ${email} not found`)
          cb && cb(err, null);
          return reject(err);
        }
        
        cb && cb(null, user);
        return resolve(user);
      });
    });
  }

  public findUserByVerificationCodeAndVerify(verificationCode: string) {
    const userModelInstance = this;
    return new Promise((resolve, reject) => {
      userModelInstance.model.findOne({ verificationCode }, async function(err, user) {
        if (err) {
          return reject(err);
        }

        if (!user) {
          return reject(new Error(`User with verification code ${verificationCode} not found`))
        }

        // Mark verificationCode field as null so we can manage this account as activated
        user.verificationCode = null;
        try {
          await userModelInstance.saveDoc(user);
        } catch (error) {
          return reject(error);
        }
        
        return resolve(user);
      });
    });
  }

  public async findUserByEmailAndSendPasswordResetRequest(email: string) {
    try {
      const user = (await this.findByEmail(email) as mongoose.Document);
      user.generateResetCode();
      const updatedUser = await this.saveDoc(user);
      // TODO: Send email with reset link to allow password update
      return updatedUser;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public findUserByResetPasswordCodeAndUpdatePassword(resetCode: string, password: string) {
    return new Promise((resolve, reject) => {
      this.model.findOne({ resetCode }, async function(err, user) {
        if (err) {
          return reject(err);
        }

        if (!user) {
          return reject(new Error('No record found with provided reset code'));
        }

        user.password = password;
        await user.hashPassword();
        user.resetCode = null;

        user.save(function(err, doc) {
          if (err) {
            return reject(err);
          }

          // TODO: Send email with comfirmed password update notification
          return resolve(doc);
        });
      });
    });
  }
}
