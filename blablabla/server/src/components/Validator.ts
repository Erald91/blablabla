import * as validator from 'validator';

export default class Validator {
  public static checkString(content: string, undefinedMessage: string = '', emptyMessage: string = '') {
    if (typeof content === 'undefined' || content === null) {
      throw new Error(undefinedMessage);
    }

    if (validator.isEmpty(content)) {
      throw new Error(emptyMessage);
    }
  }

  public static checkEmail(content: string, undefinedMessage: string = '', notValidEmail: string = '') {
    try {
      Validator.checkString(content, undefinedMessage, notValidEmail);

      if (!validator.isEmail(content)) {
        throw new Error(notValidEmail);
      }
    } catch (error) {
      throw error;
    }
  }

  public static checkPassword(content: string, undefinedMessage: string = '', notValidPassword: string = '') {
    try {
      Validator.checkString(content, undefinedMessage, notValidPassword);

      if (!validator.isLength(content, { min: 6 })) {
        throw new Error(notValidPassword);
      }
    } catch (error) {
      throw error;
    }
  }
}
