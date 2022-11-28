"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@directus/shared/utils");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
exports.default = (0, utils_1.defineHook)(({ filter }, { env, exceptions }) => {
    const { InvalidCredentialsException, InvalidTokenException, ServiceUnavailableException, TokenExpiredException } = exceptions;
    function createOpenIdFrontendAuth(provider) {
        const defaultRole = env[`AUTH_${provider.toUpperCase()}_DEFAULT_ROLE_ID`];
        const identifierKey = env[`AUTH_${provider.toUpperCase()}_IDENTIFIER_KEY`];
        const audience = env[`AUTH_${provider.toUpperCase()}_AUDIENCE`];
        const issuer = env[`AUTH_${provider.toUpperCase()}_ISSUER_URL`];
        const allowPublicRegistration = env[`AUTH_${provider.toUpperCase()}_ALLOW_PUBLIC_REGISTRATION`];
        const algorithms = ['RS256'];
        const jwksClient = (0, jwks_rsa_1.default)({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: env[`AUTH_${provider.toUpperCase()}_JWKS_URL`] || env[`AUTH_${provider.toUpperCase()}_JWKS_URI`]
        });
        return async (_accountability, { req }, { database }) => {
            const payload = jsonwebtoken_1.default.decode(req.token, { json: true });
            if ((payload === null || payload === void 0 ? void 0 : payload.iss) !== issuer)
                return null;
            return await jsonwebtoken_1.default.verify(req.token, (header, callback) => {
                jwksClient.getSigningKey(header.kid, (_err, key) => {
                    callback(null, key.getPublicKey());
                });
            }, { audience, issuer, algorithms }, async (err, payload) => {
                var _a;
                if (err || !payload) {
                    if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                        throw new TokenExpiredException();
                    }
                    if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
                        throw new InvalidTokenException('Token invalid.');
                    }
                    throw new ServiceUnavailableException(`Couldn't verify token.`, { service: 'jwt' });
                }
                const email = payload.email ? String(payload.email) : undefined;
                const identifier = payload[identifierKey !== null && identifierKey !== void 0 ? identifierKey : 'sub'] ? String(payload[identifierKey !== null && identifierKey !== void 0 ? identifierKey : 'sub']) : email;
                if (!identifier) {
                    throw new InvalidCredentialsException();
                }
                const { personId, hasMembership } = (_a = payload['https://members.bcc.no/app_metadata']) !== null && _a !== void 0 ? _a : {};
                if (!hasMembership && !allowPublicRegistration) {
                    throw new InvalidCredentialsException("Service not available for non-members.");
                }
                if (!personId) {
                    throw new InvalidCredentialsException("Missing Person ID");
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
                }).onConflict('external_identifier').merge({
                    last_access: database.raw('now()')
                });
                const user = await this.knex
                    .select('id')
                    .from('directus_users')
                    .whereRaw('LOWER(??) = ?', ['external_identifier', identifier.toLowerCase()])
                    .first();
                if (!user) {
                    return null;
                }
                return Object.assign({}, _accountability, {
                    user: user.id,
                    role: defaultRole,
                });
            });
        };
    }
    filter('authenticate', createOpenIdFrontendAuth('bcc'));
});
