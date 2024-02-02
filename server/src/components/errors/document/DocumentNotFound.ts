export default class DocumentNotFound extends Error {
  constructor(message) {
    super(message);
  }

  public static isSameInstance(object: Object) {
    if (object instanceof DocumentNotFound) {
      return true;
    } else {
      return false;
    }
  }
}
