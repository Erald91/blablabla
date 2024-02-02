import * as mongoose from 'mongoose';
import UserModel from './UserModel';

export default class Models {
	public UserModel: UserModel;

  constructor(conn: mongoose.Connection) {
    this.UserModel = new UserModel(conn);
  }
}
