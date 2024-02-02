import * as mongoose from 'mongoose';

export const getMessageFromMongooErrors = (errors: mongoose.ValidationError): Error => {
  const errorProp = Object.keys(errors.errors)[0];
  return new Error(errors.errors[errorProp].message);
}
