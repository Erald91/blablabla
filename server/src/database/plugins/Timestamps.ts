import * as mongoose from 'mongoose';
import * as moment from 'moment';

export default class Timestamps {
  public static add(schema: mongoose.Schema, options: any) {
    schema.add({ createdAt: { type: Number } });
    schema.add({ updatedAt: { type: Number } });

    schema.pre('save', function(next) {
      const now = moment().unix();
      if (this.isNew) {
        this.createdAt = now;
      }
      this.updatedAt = now;

      next();
    });

    if (options && options.createdAtIndex) {
      schema.path('createdAt').index(options.createdAtIndex);
    }

    if (options && options.updatedAtIndex) {
      schema.path('updatedAt').index(options.updatedAtIndex);
    }
  }
}
