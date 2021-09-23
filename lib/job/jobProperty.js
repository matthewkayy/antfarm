"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobProperty = void 0;
const util_1 = require("util");
class JobProperty {
    constructor(key, value) {
        let jp = this;
        jp.key = key;
        jp.value = value;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.resolveType();
    }
    resolveType() {
        let jp = this;
        let type = typeof (jp.value);
        if ((0, util_1.isArray)(jp.value)) {
            jp.type = "array";
        }
        else {
            jp.type = type;
        }
    }
    get key() {
        return this._key;
    }
    set key(key) {
        this._key = key;
    }
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
    }
}
exports.JobProperty = JobProperty;
//# sourceMappingURL=jobProperty.js.map