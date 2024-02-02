import Base from "./Base";

export default class NotFound extends Base {
  constructor(message: string) {
    super(message, 404);
  }
}
