"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nest = void 0;
const shortid = require("shortid");
/**
 * A nest is a resource that holds or produces jobs.
 */
class Nest {
    constructor(e, name) {
        this.e = e;
        this._id = shortid.generate();
        this._name = name;
    }
    get id() {
        return this._id;
    }
    toString() {
        return "Nest";
    }
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
    get tunnel() {
        return this._tunnel;
    }
    register(tunnel) {
        this._tunnel = tunnel;
    }
    arrive(job) {
        let ns = this;
        ns.e.log(1, `Job "${job.name}" arrived in Nest "${ns.name}".`, ns);
        job.tunnel = ns.tunnel;
        job.nest = ns;
        ns.tunnel.arrive(job, ns);
    }
    take(job, callback) {
        throw "Base Nest class cannot take any jobs.";
    }
}
exports.Nest = Nest;
//# sourceMappingURL=nest.js.map