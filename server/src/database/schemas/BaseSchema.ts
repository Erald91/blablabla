import * as mongoose from 'mongoose';
import Timestamps from '../plugins/Timestamps';
import { getMessageFromMongooErrors } from '../../utils/helpers';

export interface ISchemaClass {
  modalName: string;
  schema: mongoose.Shema;
}

export default class BasicSchema implements ISchemaClass {
  public modalName: string;
  public schema: mongoose.Schema;

  constructor(name: string, properties: any, options: any) {
    this.modalName = name;
    this.schema = this.generateBasicSchema(properties, options);
  }

  private generateBasicSchema(properties: any = {}, options: any = {}): mongoose.Schema {
    const defaultSchema = new mongoose.Schema({
      ...{
        // define default properties for each Schema
      },
      ...properties
    }, {
      ...{
        // define default options for each Schema
      },
      ...options
    });

    defaultSchema.methods.validateFields = function() {
      const doc = this;
      return new Promise((resolve, reject) => {
        doc.validate(function(errors) {
          if (errors) {
            return resolve(getMessageFromMongooErrors(errors));
          }
          return resolve(null);
        });
      });
    }

    defaultSchema.post('validate', function(errors, doc, next) {
      if (errors) {
        return next(getMessageFromMongooErrors(errors));
      }
      next();
    });

    defaultSchema.plugin(Timestamps.add, null);
  
    return defaultSchema;
  }
}
