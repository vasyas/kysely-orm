"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kysely_1 = require("kysely");
const node_async_hooks_1 = require("node:async_hooks");
const model_1 = __importDefault(require("./mixins/model"));
class Database {
    kysely;
    asyncLocalDb = new node_async_hooks_1.AsyncLocalStorage();
    isolated;
    log;
    debug;
    static HasManyRelation = 1;
    constructor(config) {
        this.isolated = config.isolated ?? false;
        this.log = config.log;
        this.debug = config.debug ?? false;
        if ('kysely' in config) {
            this.kysely = config.kysely;
        }
        else {
            this.kysely = new kysely_1.Kysely({
                dialect: config.dialect,
                plugins: [
                    new kysely_1.CamelCasePlugin(),
                ],
                log: (event) => {
                    if (this.debug) {
                        if (event.level === 'query') {
                            console.log(event?.query?.sql);
                            console.log(event?.query?.parameters);
                        }
                    }
                    this.log?.(event);
                },
            });
        }
    }
    get adapter() {
        return this.kysely.getExecutor().adapter;
    }
    get isSqlite() {
        return this.adapter instanceof kysely_1.SqliteAdapter;
    }
    get isPostgres() {
        return this.adapter instanceof kysely_1.PostgresDialect;
    }
    model(table, id, error) {
        return (0, model_1.default)(this, table, id, error);
    }
    get dynamic() {
        return this.db.dynamic;
    }
    get fn() {
        return this.db.fn;
    }
    get isTransaction() {
        return this.db.isTransaction;
    }
    get db() {
        const transactionState = this.asyncLocalDb.getStore();
        if (!transactionState) {
            return this.kysely;
        }
        const { transaction, committed } = transactionState;
        if (committed) {
            throw new Error('Transaction is already committed');
        }
        return transaction;
    }
    selectFrom(table) {
        return this.db.selectFrom(table);
    }
    insertInto(table) {
        return this.db.insertInto(table);
    }
    updateTable(table) {
        return this.db.updateTable(table);
    }
    deleteFrom(table) {
        return this.db.deleteFrom(table);
    }
    with(name, expression) {
        return this.db.with(name, expression);
    }
    destroy() {
        return this.db.destroy();
    }
    async transaction(callback) {
        const transactionState = this.asyncLocalDb.getStore();
        if (transactionState && !transactionState.committed) {
            console.log('you are already in transaction. using current transaction instance');
            return callback({
                transaction: transactionState.transaction,
                afterCommit(callback) {
                    transactionState.afterCommit.push(callback);
                },
            });
        }
        const afterCommit = [];
        const result = await this.db.transaction().execute(async (transaction) => {
            const newTransactionState = {
                transaction,
                committed: false,
                afterCommit,
            };
            return new Promise((resolve, reject) => {
                this.asyncLocalDb.run(newTransactionState, async () => {
                    try {
                        const result = await callback({
                            transaction,
                            afterCommit(callback) {
                                newTransactionState.afterCommit.push(callback);
                            },
                        });
                        resolve(result);
                    }
                    catch (error) {
                        reject(error);
                    }
                    finally {
                        newTransactionState.committed = true;
                    }
                });
            });
        });
        for (const afterCommitCallback of afterCommit) {
            await afterCommitCallback();
        }
        return result;
    }
}
exports.default = Database;
