"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Step = void 0;
/**
 * An interface step which allows GET requests to be made against the interface itself.
 */
class Step {
    set failure(message) {
        this._failure = message;
    }
    get failure() {
        return this._failure;
    }
    set callback(callback) {
        this._callback = callback;
    }
    get callback() {
        return this._callback;
    }
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
    /**
     * Set complete and wipe out any failure
     * @param complete
     */
    set complete(complete) {
        let s = this;
        if (complete === true) {
            s._complete = true;
            s.failure = null;
        }
        else {
            s._complete = false;
        }
    }
    get complete() {
        return this._complete;
    }
}
exports.Step = Step;
//# sourceMappingURL=step.js.map