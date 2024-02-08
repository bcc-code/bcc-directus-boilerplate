import { createError } from '@directus/errors';
import { HookConfig } from '@directus/extensions';
import { toArray } from '@directus/utils';

const FORBIDDEN_IN_ENV = createError('FORBIDDEN', 'This action is not allowed in the current environment.', 403);
let _env;

function blockAction(_delta?: any, _meta?: any, context?: { accountability?: any }) {
    if (context?.accountability !== null && !(context?.accountability?.role == '' && context?.accountability?.admin === true) && !toArray(_env.ACTION_BLOCK_BYPASS_USER_IDS ?? []).includes(context?.accountability?.user))
        throw new FORBIDDEN_IN_ENV();
}

const registerHook: HookConfig = async ({ filter }, { env, services }) => {
    if (env.ACTION_BLOCK_ENABLED === true) {
        _env = env;
        if (!services.ExtensionsService.prototype._updateOne) services.ExtensionsService.prototype._updateOne = services.ExtensionsService.prototype.updateOne;
        services.ExtensionsService.prototype.updateOne = async function (bundle, name, req_body, ...args) {
            if (this.getKey(bundle, name) == 'action_block:hook' && req_body?.meta?.enabled == false) blockAction();
            else this._updateOne(bundle, name, req_body, ...args);
        };
        toArray(env.ACTION_BLOCK_COLLECTIONS ?? []).forEach(_collection => {
            const collection = _collection.startsWith('directus_') ? _collection.slice(9) : `${_collection}.items`;
            toArray(env.ACTION_BLOCK_ACTIONS).forEach(action => {
                filter(`${collection.toLowerCase()}.${action.toLowerCase()}`, blockAction);
            });
        });
        toArray(env.ACTION_BLOCK_EVENTS ?? []).forEach(event => {
            filter(event, blockAction);
        });
    }
};
 
export default registerHook;