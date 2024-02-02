import * as mongoose from 'mongoose';
import BadRequest from '../../components/errors/response/BadRequest';
import Validator from '../../components/Validator';
import database from '../../database';
import Passport from '../../passport/Passport';

export default class AuthenticationController {
  public static async registerUser(req, res, next) {
    try {
      const { username, email, password } = req.body;

      Validator.checkString(username, 'Username not defined', 'Username not valid');
      Validator.checkEmail(email, 'Email not defined', 'Email format not valid');
      Validator.checkPassword(password, 'Password not defined', 'Password must be at least 6 characters long');

      const user = await database.models.UserModel.createUser({ username, email, password });

      res.success({ message: 'You have been registered successfully', user }, 201);
    } catch (error) {
      next(new BadRequest(error.message), { error });
    }
  }

  public static async verifyUser(req, res, next) {
    try {
      const { code } = req.body;

      Validator.checkString(code, 'Verification code is missing from request', 'Verification code is not valid');

      const user = await database.models.UserModel.findUserByVerificationCodeAndVerify(code);

      res.success({ message: 'Your account is verified successfully' }, 202);
    } catch (error) {
      next(new BadRequest(error.message), { error });
    }
  }

  public static async resetPassword(req, res, next) {
    try {
      const { email, code, password } = req.body;
      let response: { data: any, message: string } = null;

      if (email) {
        Validator.checkEmail(email, 'Email not defined', 'Email format not valid');
        const result = await database.models.UserModel.findUserByEmailAndSendPasswordResetRequest(email);

        response = { data: result, message: 'Reset password request done successfully' };
      } else if (code) {
        Validator.checkPassword(password, 'Password not defined', 'Password not valid');

        const result = await database.models.UserModel.findUserByResetPasswordCodeAndUpdatePassword(code, password);
        response = { data: result, message: 'Password updated successfully' };
      }

      if (response) {
        res.success({ message: response.message, user: response.data });
      } else {
        next(new BadRequest('Invalid request'));
      }
    } catch (error) {
      next(new BadRequest(error.message));
    }
  }

  public static async login(req, res, next) {
    try {     
      const { email, password } = req.body;

      Validator.checkEmail(email, 'Email not defined', 'Email format not valid');
      Validator.checkString(password, 'Password not defined', 'Password not valid');

      const authData = (await Passport.doLocalAuthentication(req) as { user: any; token: string });
      res.success({ message: 'User authenticated successfully', user: authData.user, token: authData.token });
    } catch (error) {
      next(new BadRequest(error.message));
    }
  }
}
