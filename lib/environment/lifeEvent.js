"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeEvent = void 0;
/**
 * The LifeEvent class provides a lifecycle that can be provided to debug job failures.
 */
class LifeEvent {
    constructor(verb, start, finish) {
        let le = this;
        le._date = new Date();
        le._verb = verb;
        le._start = start;
        le._finish = finish;
    }
    get date() {
        return this._date;
    }
    set date(date) {
        this._date = date;
    }
    get verb() {
        return this._verb;
    }
    set verb(verb) {
        this._verb = verb;
    }
    get start() {
        return this._start;
    }
    set start(start) {
        this._start = start;
    }
    get finish() {
        return this._finish;
    }
    set finish(finish) {
        this._finish = finish;
    }
    get statement() {
        let le = this;
        return `${le.verb} from ${le.start} to ${le.finish}`;
    }
    ;
}
exports.LifeEvent = LifeEvent;
//# sourceMappingURL=lifeEvent.js.map