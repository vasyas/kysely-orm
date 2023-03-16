"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function assign() {
    return class TableClass {
        constructor(data) {
            Object.assign(this, data);
        }
    };
}
exports.default = assign;
