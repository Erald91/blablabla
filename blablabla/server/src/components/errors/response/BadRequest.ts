import Base from "./Base";

export default class BadRequest extends Base {
  constructor(message: string) {
    super(message, 400);
  }
}
