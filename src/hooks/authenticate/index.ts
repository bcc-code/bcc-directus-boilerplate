import {Accountability} from '@directus/shared/types';
import {defineHook} from '@directus/shared/utils';
import {Request} from 'express';
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import {Knex} from 'knex';

export default defineHook(({filter}, {env, exceptions}) => {
  const {
    InvalidCredentialsException,
    InvalidTokenException,
    ServiceUnavailableException,
    TokenExpiredException,
  } = exceptions;

  function createOpenIdFrontendAuth(provider: string) {
    const defaultRole = env[`AUTH_${provider.toUpperCase()}_DEFAULT_ROLE_ID`];

    const identifierKey = env[`AUTH_${provider.toUpperCase()}_IDENTIFIER_KEY`];
    const audience = env[`AUTH_${provider.toUpperCase()}_AUDIENCE`];
    const issuer = env[`AUTH_${provider.toUpperCase()}_ISSUER_URL`];
    const allowPublicRegistration =
      env[`AUTH_${provider.toUpperCase()}_ALLOW_PUBLIC_REGISTRATION`];
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
      {req}: {req: Request},
      {database}: {database: Knex}
    ) => {
      const payload = jwt.decode(req.token, {json: true});
      if (payload?.iss !== issuer) return null;

      return await jwt.verify(
        req.token,
        (header: any, callback: any) => {
          jwksClient.getSigningKey(header.kid, (_err, key: any) => {
            callback(null, key.getPublicKey());
          });
        },
        {audience, issuer, algorithms},
        async (err: any, payload: JwtPayload) => {
          if (err || !payload) {
            if (err instanceof TokenExpiredError) {
              throw new TokenExpiredException();
            }

            if (err instanceof JsonWebTokenError) {
              throw new InvalidTokenException('Token invalid.');
            }

            throw new ServiceUnavailableException("Couldn't verify token.", {
              service: 'jwt',
            });
          }

          const email = payload.email ? String(payload.email) : undefined;
          const identifier = payload[identifierKey ?? 'sub']
            ? String(payload[identifierKey ?? 'sub'])
            : email;

          if (!identifier) {
            throw new InvalidCredentialsException();
          }

          const {personId, hasMembership} =
            payload['https://members.bcc.no/app_metadata'] ?? {};

          if (!hasMembership && !allowPublicRegistration) {
            throw new InvalidCredentialsException(
              'Service not available for non-members.'
            );
          }

          if (!personId) {
            throw new InvalidCredentialsException('Missing Person ID');
          }

          await database('directus_users')
            .insert({
              provider,
              first_name: payload.given_name,
              last_name: payload.family_name,
              email: email,
              external_identifier: identifier,
              role: defaultRole,
              personId,
            })
            .onConflict('external_identifier')
            .merge({
              last_access: database.raw('now()'),
            });

          const user = await this.knex
            .select('id')
            .from('directus_users')
            .whereRaw('LOWER(??) = ?', [
              'external_identifier',
              identifier.toLowerCase(),
            ])
            .first();

          if (!user) {
            return null;
          }

          return Object.assign({}, _accountability, {
            user: user.id,
            role: defaultRole,
          } as Accountability);
        }
      );
    };
  }

  filter('authenticate', createOpenIdFrontendAuth('bcc'));
});
