import * as express from 'express';

export default interface IRouterInterface {
  path: string;
  add: () => express.Router
}