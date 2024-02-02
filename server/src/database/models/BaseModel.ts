import * as mongoose from 'mongoose';

export default class BaseModel {
	public modelName: String;
  public modelSchema: mongoose.Schema;
  public model: mongoose.Model;

	constructor(name: string, schema: mongoose.Schema, conn: mongoose.Connection) {
		this.modelName = name;
    this.modelSchema = schema;
    this.model = conn.model(this.modelName, this.modelSchema);
  }

  public saveDoc(doc: mongoose.Document) {
    return new Promise((resolve, reject) => {
      if (!doc._id) {
        return reject(new Error('Missing _id field'));
      }

      this.model.findById(doc._id, function(err, user) {
        if (err) {
          return reject(err);
        }

        user.set(doc);
        user.save(function(err) {
          if (err) {
            return reject(err);
          }

          return resolve(user);
        });
      });
    });
  }
}
