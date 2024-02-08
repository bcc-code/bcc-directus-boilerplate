import { Accountability, Query, SchemaOverview } from '@directus/types';

declare global {
// eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      token: string | null;
      collection: string;
      sanitizedQuery: Query;
      schema: SchemaOverview;
      accountability?: Accountability & {
        meta?: {
          personId: string;
        };
      };
      singleton?: boolean;
    }
  }
}
