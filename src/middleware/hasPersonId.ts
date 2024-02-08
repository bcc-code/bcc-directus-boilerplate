import { createError } from '@directus/errors';
import { Request } from 'express';

const MissingPersonIDError = createError('INVALID_CREDENTIALS' /* InvalidCredentials */, 'Token is missing Person ID.', 401);

export default (req: Request, _res, next) => {
  if (!req.accountability?.meta?.personId) {
    return next(new MissingPersonIDError());
  }
  next();
};
