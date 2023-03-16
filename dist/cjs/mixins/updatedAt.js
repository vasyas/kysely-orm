"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kysely_1 = require("kysely");
function updatedAt(Base, field) {
    return class UpdatedAt extends Base {
        static async beforeUpdate(data) {
            return {
                ...await Base.beforeUpdate(data),
                [field]: (0, kysely_1.sql) `NOW()`,
            };
        }
    };
}
exports.default = updatedAt;
