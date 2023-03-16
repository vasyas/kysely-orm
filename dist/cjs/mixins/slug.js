"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operation = void 0;
const kysely_1 = require("kysely");
const url_slug_1 = __importDefault(require("url-slug"));
// @ts-ignore
const puid_1 = __importDefault(require("puid"));
const puid = new puid_1.default(true);
var Operation;
(function (Operation) {
    Operation[Operation["GRAB_FIRST"] = 0] = "GRAB_FIRST";
    Operation[Operation["CONCAT"] = 1] = "CONCAT";
})(Operation = exports.Operation || (exports.Operation = {}));
function generate(data, options) {
    const { sources, operation = Operation.GRAB_FIRST, slugOptions: { separator = '-', truncate = 50, dictionary = {}, } = {}, } = options;
    let slug;
    if (operation === Operation.GRAB_FIRST) {
        for (let i = 0; i < sources.length; i += 1) {
            const value = data[sources[i]];
            const slugValue = value?.toString()?.trim();
            if (!!slugValue) {
                slug = value;
                break;
            }
        }
    }
    else if (operation === Operation.CONCAT) {
        const list = [];
        sources.forEach((source) => {
            const value = data[source];
            const slugValue = value?.toString()?.trim();
            if (!!slugValue) {
                list.push(slugValue);
            }
        });
        if (list.length) {
            slug = list.join(separator);
        }
    }
    if (slug) {
        const generatedSlug = (0, url_slug_1.default)(slug, {
            separator,
            dictionary,
        });
        if (truncate && generatedSlug.length > truncate) {
            return generatedSlug.substring(0, truncate);
        }
        return generatedSlug;
    }
    return slug;
}
function slug(Base, options) {
    return class Slug extends Base {
        static async beforeInsert(data) {
            const { field } = options;
            return {
                ...await Base.beforeInsert(data),
                [field]: await this.generateSlug(data),
            };
        }
        static async findBySlug(value, column = options.field) {
            return this
                .selectFrom()
                .selectAll()
                .where(this.ref(column), '=', value)
                .limit(1)
                .executeTakeFirst();
        }
        static async generateSlug(data) {
            const { field } = options;
            // generate slug
            const slug = generate(data, options) ?? puid.generate();
            // check if slug is already taken
            const rowWithSlug = await this.findBySlug(slug, field);
            if (!rowWithSlug) {
                return slug;
            }
            const operator = this.db.isSqlite ? 'like' : '~';
            // TODO add lock by bigint (hashed slug)
            // generate new slug
            const firstRow = await this
                .selectFrom()
                .where(this.ref(field), operator, `^${slug}[0-9]*$`)
                .orderBy((0, kysely_1.sql) `length(${kysely_1.sql.ref(field)})`, 'desc')
                .orderBy(this.ref(field), 'desc')
                .select(this.ref(field))
                .limit(1)
                .executeTakeFirst();
            if (firstRow) {
                const lastSlug = firstRow[field];
                const number = lastSlug?.substr(slug.length);
                const nextNumber = number ? Number(number) + 1 : 2;
                return `${slug}${nextNumber}`;
            }
            return `${slug}2`;
        }
    };
}
exports.default = slug;
