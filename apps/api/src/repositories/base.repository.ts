import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { db, type DBSchemas } from "~/config/db.config";

export type TransactionType = PgTransaction<
  PostgresJsQueryResultHKT,
  DBSchemas,
  ExtractTablesWithRelations<DBSchemas>
>;

export class BaseRepository {
  protected dbInstance = db;

  withTransaction(trx?: TransactionType) {
    if (trx) {
      this.dbInstance = trx;
    }

    return this;
  }
}
