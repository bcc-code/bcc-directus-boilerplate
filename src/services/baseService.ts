import { Accountability } from "@directus/shared/types";
import { AbstractServiceOptions, Item, MutationOptions, PrimaryKey } from "directus/dist/types";
import { primaryKey } from "@bcc-directus-boilerplate/shared/utils";
import { ItemsService } from "directus";

export class BaseService extends ItemsService {

    constructor(collection: string, asAdmin: boolean, context: AbstractServiceOptions) {
        super(collection, {
            knex: context.knex, schema: context.schema,
            accountability: context.accountability ? {
                ...context.accountability as Accountability,
                admin: asAdmin || context.accountability?.admin
            } : null
        });
    }

    async updateOne(key: PrimaryKey, data: Partial<Item>, opts?: MutationOptions | undefined): Promise<PrimaryKey> {
        const updatedKey: PrimaryKey = await super.updateOne(key, data, opts);
        await this.cache?.delete(this.cacheKey(updatedKey))

        return updatedKey;
    }

    async updateMany(keys: PrimaryKey[], data: Partial<Item>, opts?: MutationOptions): Promise<PrimaryKey[]> {
        const updatedKeys: PrimaryKey[] = await super.updateMany(keys, data, opts);
        await Promise.all(updatedKeys.map(this.clearFromCache));

        return updatedKeys;
    }

    async clearFromCache(activity: Item | PrimaryKey ) {
        await this.cache?.delete(this.cacheKey(primaryKey(activity)))
    }

    protected cacheKey(key: PrimaryKey) {
        return `${this.collection}-dto_${key}`
    }
}