import {Accountability} from '@directus/shared/types';
import {defineHook} from '@directus/shared/utils';
import {Request} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

export default defineHook(({filter}, {env, exceptions}) => {
  const {InvalidCredentialsException, ServiceUnavailableException} = exceptions;

  function createOpenIdFrontendAuth(provider: string) {
    const userId = env[`AUTH_${provider.toUpperCase()}_FRONTEND_USER_ID`];
    const roleId = env[`AUTH_${provider.toUpperCase()}_FRONTEND_ROLE_ID`];

    const audience = env[`AUTH_${provider.toUpperCase()}_AUDIENCE`];
    const issuer = env[`AUTH_${provider.toUpperCase()}_ISSUER_URL`];

    const algorithms: jwt.Algorithm[] = ['RS256'];

    const jwksClient = jwksRsa({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri:
        env[`AUTH_${provider.toUpperCase()}_JWKS_URL`] ||
        env[`AUTH_${provider.toUpperCase()}_JWKS_URI`],
    });

    return async (
      _accountability: Accountability,
      {req}: {req: Request & {token: string}},
      _context
    ) => {
      const decoded = jwt.decode(req.token, {complete: true});
      if (!decoded?.payload) {
        throw new ServiceUnavailableException("Couldn't verify token.", {
          service: 'jwt',
        });
      }
      const payload = decoded?.payload as JwtPayload;
      if (payload?.iss !== issuer) return null;

      const key = await jwksClient.getSigningKey(decoded.header.kid);

      jwt.verify(req.token, key.getPublicKey(), {audience, issuer, algorithms});

      const {personId, hasMembership} =
        payload['https://members.bcc.no/app_metadata'] ?? {};

      if (!personId) {
        throw new InvalidCredentialsException('Missing Person ID');
      }

      /**
       * EXPLICIT USER CREATION
       * Uncomment the following if you want to create a new user for each frontend user
       */
      // const { database } = _context;
      // await database('directus_users')
      //   .insert({
      //     provider,
      //     first_name: payload.given_name,
      //     last_name: payload.family_name,
      //     email: email,
      //     external_identifier: identifier,
      //     role: defaultRole,
      //     personId,
      //   })
      //   .onConflict('external_identifier')
      //   .merge({
      //     last_access: database.raw('now()'),
      //   });

      // const user = await this.knex
      //   .select('id', 'role')
      //   .from('directus_users')
      //   .whereRaw('LOWER(??) = ?', [
      //     'external_identifier',
      //     identifier.toLowerCase(),
      //   ])
      //   .first();

      // if (!user) {
      //   return null;
      // }

      // userId = user.id;
      // roleId = user.role;
      /**
       * END EXPLICIT USER
       */

      return Object.assign({}, _accountability, {
        user: userId,
        role: roleId,
        meta: {
          personId,
          hasMembership,
        },
      } as Accountability);
    };
  }

  filter('authenticate', createOpenIdFrontendAuth('bcc'));
});
