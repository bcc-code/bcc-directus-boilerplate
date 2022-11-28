import {Accountability, Query, SchemaOverview} from "@directus/shared/types";

declare global {
    namespace Express {
        export interface Request {
            token: string | null;
            collection: string;
            sanitizedQuery: Query;
            schema: SchemaOverview;
            accountability?: Accountability;
            singleton?: boolean;
        }
    }
}