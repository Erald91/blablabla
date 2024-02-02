import Base from "./Base";

export default class NotAuthenticated extends Base {
  constructor(message) {
    super(message, 401);
  }
}
