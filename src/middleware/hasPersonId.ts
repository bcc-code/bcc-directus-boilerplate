import {InvalidTokenException} from 'directus';
import {Request} from 'express';

export default (req: Request, _res, next) => {
  if (!req.accountability?.meta?.personId) {
    return next(new InvalidTokenException('Token missing personId'));
  }
  next();
};
