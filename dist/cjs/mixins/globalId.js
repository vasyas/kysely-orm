"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeTypeFromGlobalId = void 0;
function encodeBase64(i) {
    return Buffer.from(i, 'utf8').toString('base64');
}
function decodeBase64(i) {
    return Buffer.from(i, 'base64').toString('utf8');
}
function fromGlobalId(globalId, parse) {
    const unbasedGlobalId = decodeBase64(globalId);
    const [type, unparsedId] = unbasedGlobalId.split(':');
    if (!type || !unparsedId) {
        throw new Error('Node type or id is not defined in globalId');
    }
    const id = parse(unparsedId);
    return {
        type,
        id,
    };
}
function decodeTypeFromGlobalId(globalId) {
    const unbasedGlobalId = decodeBase64(globalId);
    const [type] = unbasedGlobalId.split(':');
    if (!type) {
        throw new Error('Node type is not defined in globalId');
    }
    return type;
}
exports.decodeTypeFromGlobalId = decodeTypeFromGlobalId;
function globalId(Base, parseId, type) {
    return class GlobalId extends Base {
        static globalIdType = type || Base.table;
        static getGlobalId(id) {
            if (typeof id === 'string' || typeof id === 'number') {
                return encodeBase64([this.globalIdType, id.toString()].join(':'));
            }
            throw new Error('Id is not defined');
        }
        static getLocalId(globalId) {
            const { type, id } = fromGlobalId(globalId, parseId);
            if (this.globalIdType !== type) {
                throw new Error(`Model ${this.globalIdType} is not model ${type}`);
            }
            return id;
        }
        static findByGlobalId(globalId) {
            const id = this.getLocalId(globalId);
            return this.findById(id);
        }
        static getByGlobalId(globalId) {
            const id = this.getLocalId(globalId);
            return this.getById(id);
        }
        static findByGlobalIds(globalIds) {
            const ids = globalIds.map((globalId) => this.getLocalId(globalId));
            return this.findByIds(ids);
        }
    };
}
exports.default = globalId;
