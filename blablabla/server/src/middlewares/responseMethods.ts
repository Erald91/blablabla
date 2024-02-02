import IMiddlewareInterface from "./IMiddlewareInterface";

const success = function(data: Object, code: number = 200) {
  this.status(code).json({
    success: true,
    ...data
  });
}

const error = function(error: any, extraData: Object) {
  this.status(error.code || 500).json({
    success: false,
    message: error.message || 'Something went wrong',
    ...extraData
  });
}

class ResponseMethods implements IMiddlewareInterface {
  constructor() { }

  public add(req, res, next) {
    res.success = success.bind(res);
    res.error = error.bind(res);
    next();
  }
}

export const responseMethods = new ResponseMethods();
