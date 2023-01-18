import {InvalidTokenException} from 'directus/dist/exceptions';
import {Request} from 'express';

export default (req: Request, _res, next) => {
  if (!req.accountability?.meta?.personId) {
    return next(new InvalidTokenException('Token missing personId'));
  }
  next();
};
