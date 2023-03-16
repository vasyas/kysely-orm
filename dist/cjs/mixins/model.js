"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kysely_1 = require("kysely");
const RelationType_1 = __importDefault(require("../constants/RelationType"));
function model(db, table, id, noResultError = kysely_1.NoResultError) {
    return class Model {
        static db = db;
        static table = table;
        static id = id;
        static noResultError = noResultError;
        static isolated = false;
        // constructor(data: Data);
        constructor(...args) {
            Object.assign(this, args[0]);
        }
        static relation(type, from, to) {
            return {
                type,
                from,
                to,
            };
        }
        static async beforeInsert(data) {
            return {
                ...data
            };
        }
        static async beforeUpdate(data) {
            return {
                ...data
            };
        }
        static async afterInsert(_records) {
        }
        static async afterUpdate(_records) {
        }
        static async afterUpsert(_records) {
        }
        static transaction(callback) {
            return this.db.transaction(callback);
        }
        static get dynamic() {
            return this.db.dynamic;
        }
        static ref(reference) {
            return this.db.dynamic.ref(reference);
        }
        static get fn() {
            return this.db.fn;
        }
        static selectFrom() {
            if (this.db.isolated && !this.isolated) {
                throw new Error('Cannot use selectFrom() in not isolated model. Call isolate({ Model }) first.');
            }
            return this.db.selectFrom(this.table);
        }
        static updateTable() {
            if (this.db.isolated && !this.isolated) {
                throw new Error('Cannot use updateTable() in not isolated model. Call isolate({ Model }) first.');
            }
            return this.db.updateTable(this.table);
        }
        static insertInto() {
            if (this.db.isolated && !this.isolated) {
                throw new Error('Cannot use insertInto() in not isolated model. Call isolate({ Model }) first.');
            }
            return this.db.insertInto(this.table);
        }
        static deleteFrom() {
            if (this.db.isolated && !this.isolated) {
                throw new Error('Cannot use deleteFrom() in not isolated model. Call isolate({ Model }) first.');
            }
            return this.db.deleteFrom(this.table);
        }
        static with(name, expression) {
            return this.db.with(name, expression);
        }
        static async find(column, values, func) {
            const isArray = Array.isArray(values);
            return this
                .selectFrom()
                .selectAll()
                .where(this.ref(column), isArray ? 'in' : '=', values)
                .if(!!func, (qb) => func?.(qb))
                .execute();
        }
        static async findOne(column, value, func) {
            return this
                .selectFrom()
                .selectAll()
                .where(this.ref(column), '=', value)
                .if(!!func, (qb) => func?.(qb))
                .limit(1)
                .executeTakeFirst();
        }
        static async findByFields(fields, func) {
            return this
                .selectFrom()
                .selectAll()
                .where((qb) => {
                let currentQuery = qb;
                for (const [column, value] of Object.entries(fields)) {
                    const isArray = Array.isArray(value);
                    currentQuery = currentQuery.where(this.ref(column), isArray ? 'in' : '=', value);
                }
                return currentQuery;
            })
                .if(!!func, (qb) => func?.(qb))
                .execute();
        }
        static async findOneByFields(fields, func) {
            return this
                .selectFrom()
                .selectAll()
                .where((qb) => {
                let currentQuery = qb;
                for (const [column, value] of Object.entries(fields)) {
                    const isArray = Array.isArray(value);
                    currentQuery = currentQuery.where(this.ref(column), isArray ? 'in' : '=', value);
                }
                return currentQuery;
            })
                .if(!!func, (qb) => func?.(qb))
                .executeTakeFirst();
        }
        static async getOneByFields(fields, func, error = this.noResultError) {
            return this
                .selectFrom()
                .where((qb) => {
                let currentQuery = qb;
                for (const [column, value] of Object.entries(fields)) {
                    const isArray = Array.isArray(value);
                    currentQuery = currentQuery.where(this.ref(column), isArray ? 'in' : '=', value);
                }
                return currentQuery;
            })
                .selectAll()
                .if(!!func, (qb) => func?.(qb))
                .executeTakeFirstOrThrow(error);
        }
        static findById(id, func) {
            return this.findOne(this.id, id, func);
        }
        static findByIds(ids, func) {
            return this.find(this.id, ids, func);
        }
        static async getOne(column, value, func, error = this.noResultError) {
            const item = await this
                .selectFrom()
                .selectAll()
                .where(this.ref(column), '=', value)
                .if(!!func, (qb) => func?.(qb))
                .limit(1)
                .executeTakeFirstOrThrow(error);
            return item;
        }
        static getById(id, func, error = this.noResultError) {
            return this.getOne(this.id, id, func, error);
        }
        static async findOneAndUpdate(column, value, data, func) {
            const processedData = await this.beforeUpdate(data);
            const record = await this
                .updateTable()
                // @ts-ignore
                .set(processedData)
                .where(this.ref(column), '=', value)
                .if(!!func, (qb) => func?.(qb))
                .returningAll()
                .executeTakeFirst();
            if (record) {
                await this.afterUpdate([record]);
            }
            return record;
        }
        static async findByFieldsAndUpdate(fields, data, func) {
            const processedData = await this.beforeUpdate(data);
            const records = await this
                .updateTable()
                // @ts-ignore
                .set(processedData)
                .where((qb) => {
                let currentQuery = qb;
                for (const [column, value] of Object.entries(fields)) {
                    if (Array.isArray(value)) {
                        currentQuery = currentQuery.where(this.ref(column), 'in', value);
                    }
                    else {
                        currentQuery = currentQuery.where(this.ref(column), '=', value);
                    }
                }
                return currentQuery;
            })
                .if(!!func, (qb) => func?.(qb))
                .returningAll()
                .execute();
            await this.afterUpdate(records);
            return records;
        }
        static async findOneByFieldsAndUpdate(fields, data, func) {
            const processedData = await this.beforeUpdate(data);
            // TODO use with and select with limit 1
            const record = await this
                .updateTable()
                // @ts-ignore
                .set(processedData)
                .where((qb) => {
                let currentQuery = qb;
                for (const [column, value] of Object.entries(fields)) {
                    if (Array.isArray(value)) {
                        currentQuery = currentQuery.where(this.ref(column), 'in', value);
                    }
                    else {
                        currentQuery = currentQuery.where(this.ref(column), '=', value);
                    }
                }
                return currentQuery;
            })
                .if(!!func, (qb) => func?.(qb))
                .returningAll()
                .executeTakeFirst();
            if (record) {
                await this.afterUpdate([record]);
            }
            return record;
        }
        static async getOneByFieldsAndUpdate(fields, data, func, error = this.noResultError) {
            const processedData = await this.beforeUpdate(data);
            // TODO use with and select with limit 1
            const record = await this
                .updateTable()
                // @ts-ignore
                .set(processedData)
                .where((qb) => {
                let currentQuery = qb;
                for (const [column, value] of Object.entries(fields)) {
                    if (Array.isArray(value)) {
                        currentQuery = currentQuery.where(this.ref(column), 'in', value);
                    }
                    else {
                        currentQuery = currentQuery.where(this.ref(column), '=', value);
                    }
                }
                return currentQuery;
            })
                .if(!!func, (qb) => func?.(qb))
                .returningAll()
                .executeTakeFirstOrThrow(error);
            await this.afterUpdate([record]);
            return record;
        }
        static findByIdAndUpdate(id, data, func) {
            return this.findOneAndUpdate(this.id, id, data, func);
        }
        static async getOneAndUpdate(column, value, data, func, error = this.noResultError) {
            const processedData = await this.beforeUpdate(data);
            const record = await this
                .updateTable()
                // @ts-ignore
                .set(processedData)
                .where(this.ref(column), '=', value)
                .if(!!func, (qb) => func?.(qb))
                .returningAll()
                .executeTakeFirstOrThrow(error);
            await this.afterUpdate([record]);
            return record;
        }
        static getByIdAndUpdate(id, data, func, error = this.noResultError) {
            return this.getOneAndUpdate(this.id, id, data, func, error);
        }
        static lock(column, value) {
            return this
                .selectFrom()
                .where(this.ref(column), '=', value)
                .selectAll()
                .forUpdate()
                .executeTakeFirst();
        }
        static lockById(id) {
            return this.lock(this.id, id);
        }
        static async insert(values, error = this.noResultError) {
            const processedValues = await this.beforeInsert(values);
            const record = await this
                .insertInto()
                .values(processedValues)
                .returningAll()
                .executeTakeFirstOrThrow(error);
            await this.afterInsert([record]);
            return record;
        }
        static async upsert(values, upsertValues, conflictColumns, error = this.noResultError) {
            const processedInsertValues = await this.beforeInsert(values);
            // const processedUpdateValues = await this.beforeUpdate(upsertValues);
            const record = await this
                .insertInto()
                .values(processedInsertValues)
                .onConflict((oc) => oc
                .columns(Array.isArray(conflictColumns) ? conflictColumns : [conflictColumns])
                .doUpdateSet(upsertValues))
                .returningAll()
                .executeTakeFirstOrThrow(error);
            await this.afterUpsert([record]);
            return record;
        }
        static async insertIfNotExists(values, conflictColumns, error = this.noResultError) {
            const processedInsertValues = await this.beforeInsert(values);
            const record = await this
                .insertInto()
                .values(processedInsertValues)
                .onConflict((oc) => oc
                .columns(Array.isArray(conflictColumns) ? conflictColumns : [conflictColumns])
                .doUpdateSet({
                [id]: (eb) => eb.ref(`excluded.${id}`)
            }))
                .returningAll()
                .executeTakeFirstOrThrow(error);
            await this.afterInsert([record]);
            return record;
        }
        // todo add limit via with
        static async deleteOne(column, value, func, error = this.noResultError) {
            const { numDeletedRows } = await this
                .deleteFrom()
                .where(this.ref(column), '=', value)
                .if(!!func, (qb) => func?.(qb))
                .executeTakeFirstOrThrow(error);
            return numDeletedRows;
        }
        // todo add limit via with
        static async deleteOneByFields(fields, func, error = this.noResultError) {
            const { numDeletedRows } = await this
                .deleteFrom()
                .where((qb) => {
                let currentQuery = qb;
                for (const [column, value] of Object.entries(fields)) {
                    if (Array.isArray(value)) {
                        currentQuery = currentQuery.where(this.ref(column), 'in', value);
                    }
                    else {
                        currentQuery = currentQuery.where(this.ref(column), '=', value);
                    }
                }
                return currentQuery;
            })
                .if(!!func, (qb) => func?.(qb))
                .executeTakeFirstOrThrow(error);
            return numDeletedRows;
        }
        static async deleteMany(column, values, func, error = this.noResultError) {
            const { numDeletedRows } = await this
                .deleteFrom()
                .where(this.ref(column), 'in', values)
                .if(!!func, (qb) => func?.(qb))
                .executeTakeFirstOrThrow(error);
            return numDeletedRows;
        }
        static deleteById(id) {
            return this.deleteOne(this.id, id);
        }
        static findByIdAndIncrementQuery(id, columns, func) {
            const setData = {};
            Object.keys(columns).forEach((column) => {
                const value = columns[column];
                const correctColumn = column;
                setData[correctColumn] = (0, kysely_1.sql) `${kysely_1.sql.ref(column)} + ${value}`;
            });
            return this
                .updateTable()
                // @ts-ignore
                .set(setData)
                .where(this.ref(this.id), '=', id)
                .if(!!func, (qb) => func?.(qb))
                .returningAll();
        }
        static findByIdAndIncrement(id, columns, func) {
            return this.findByIdAndIncrementQuery(id, columns, func).executeTakeFirst();
        }
        static async getByIdAndIncrement(id, columns, func, error = this.noResultError) {
            const record = await this
                .findByIdAndIncrementQuery(id, columns, func)
                .executeTakeFirstOrThrow(error);
            await this.afterUpdate([record]);
            return record;
        }
        static relatedQuery(relation, ids = []) {
            const { from, to } = relation;
            const [fromTable] = from.split('.');
            const [toTable] = to.split('.');
            return this.db
                .selectFrom(fromTable)
                .innerJoin(toTable, (jb) => jb.onRef(this.ref(from), '=', this.ref(to)))
                .where(this.ref(`${fromTable}.${this.id}`), Array.isArray(ids) ? 'in' : '=', ids)
                .selectAll(toTable);
        }
        static async findRelatedById(relation, id) {
            const { type } = relation;
            const oneResult = type === RelationType_1.default.HasOneRelation || type === RelationType_1.default.BelongsToOneRelation;
            if (oneResult) {
                return await this.relatedQuery(relation, id).executeTakeFirst();
            }
            return await this.relatedQuery(relation, id).execute();
        }
        static async getRelatedById(relation, id, error = this.noResultError) {
            const { type } = relation;
            const oneResult = type === RelationType_1.default.HasOneRelation || type === RelationType_1.default.BelongsToOneRelation;
            if (oneResult) {
                return await this.relatedQuery(relation, id).executeTakeFirstOrThrow(error);
            }
            return await this.relatedQuery(relation, id).execute();
        }
        static async findRelated(relation, models) {
            const { from, to } = relation;
            const [fromTable, fromColumn] = from.split('.');
            const [toTable] = to.split('.');
            // @ts-ignore
            const ids = models.map((model) => model[fromColumn]);
            return this
                .db
                .selectFrom(fromTable)
                .innerJoin(toTable, (jb) => jb.onRef(this.ref(from), '=', this.ref(to)))
                .where(this.ref(from), 'in', ids)
                .selectAll(toTable)
                .execute();
        }
        static async findRelatedAndCombine(relation, models, field) {
            const rows = await this.findRelated(relation, models);
            const { type, from, to } = relation;
            const [_fromTable, fromColumn] = from.split('.');
            const [_toTable, toColumn] = to.split('.');
            const oneResult = type === RelationType_1.default.HasOneRelation || type === RelationType_1.default.BelongsToOneRelation;
            // combine models and rows
            return models.map((model) => {
                // @ts-ignore
                const id = model[fromColumn];
                const row = oneResult
                    // @ts-ignore
                    ? rows.find((row) => row[toColumn] === id)
                    // @ts-ignore
                    : rows.filter((row) => row[toColumn] === id);
                return { ...model, [field]: row };
            });
        }
        static jsonbIncrement(column, data) {
            const entries = Object.entries(data);
            if (!entries.length) {
                throw new Error('Data is empty');
            }
            const [[key, value], ...rest] = entries;
            let update = (0, kysely_1.sql) `jsonb_set(
        COALESCE(${kysely_1.sql.ref(column)}, '{}'), 
        ${kysely_1.sql.literal(`{${key}}`)}, 
        (COALESCE(${kysely_1.sql.ref(column)}->>${kysely_1.sql.literal(key)}, '0')::int + ${value})::text::jsonb
      )`;
            rest.forEach(([key, value]) => {
                update = (0, kysely_1.sql) `jsonb_set(
          ${update}, 
          ${kysely_1.sql.literal(`{${key}}`)}, 
          (COALESCE(${kysely_1.sql.ref(column)}->>${kysely_1.sql.literal(key)}, '0')::int + ${value})::text::jsonb
        )`;
            });
            return update;
        }
    };
}
exports.default = model;
