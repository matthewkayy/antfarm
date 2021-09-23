"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const lifeEvent_1 = require("../environment/lifeEvent");
const jobProperty_1 = require("./jobProperty");
// Handle the circular dependency by stashing the type in a variable for requiring later.
// import * as PackedJobTypes from "./packedJob";
// let PackedJob: typeof PackedJobTypes.PackedJob;
const shortid = require("shortid"), _ = require("lodash");
class Job {
    /**
     * Job constructor
     * @param e
     * @param name
     */
    constructor(e, name) {
        let j = this;
        j.e = e;
        j._id = shortid.generate();
        j._name = name;
        j._lifeCycle = [];
        j._properties = {};
        j._type = "base";
        j.createLifeEvent("created", null, name);
        j.e.log(1, `New Job "${name}" created, id: ${j.id}.`, j, [j.nest, j.tunnel]);
    }
    get type() {
        return this._type;
    }
    /**
     * Class _name for logging.
     * @returns {string}
     */
    toString() {
        return "Job";
    }
    /**
     * Check if job is locally available.
     * @returns {boolean}
     */
    get isLocallyAvailable() {
        return this._locallyAvailable;
    }
    /**
     * Set if the job is locally available.
     * @param available
     */
    set locallyAvailable(available) {
        this._locallyAvailable = available;
    }
    /**
     * Get the life cycle object.
     * @returns {LifeEvent[]}
     */
    get lifeCycle() {
        return this._lifeCycle;
    }
    set lifeCycle(events) {
        this._lifeCycle = events;
    }
    /**
     * Create a new life event.
     * @param verb
     * @param start
     * @param finish
     */
    createLifeEvent(verb, start, finish) {
        this.lifeCycle.push(new lifeEvent_1.LifeEvent(verb, start, finish));
    }
    /**
     * Set a new _name.
     * @param name
     */
    set name(name) {
        this._name = name;
    }
    /**
     * Get the _name.
     * @returns {string}
     */
    get name() {
        return this._name;
    }
    /**
     * Get the ID.
     * @returns {string}
     */
    get id() {
        return this._id;
    }
    /**
     * Get the _name proper.
     * @returns {string}
     */
    get nameProper() {
        return this.name;
    }
    /**
     * Set the nest.
     * @param nest
     */
    set nest(nest) {
        this._nest = nest;
    }
    /**
     * Get the nest.
     * @returns {Nest}
     */
    get nest() {
        return this._nest;
    }
    /**
     * Set the tunnel.
     * @param tunnel
     */
    set tunnel(tunnel) {
        this._tunnel = tunnel;
    }
    /**
     * Get the tunnel.
     * @returns {Tunnel}
     */
    get tunnel() {
        return this._tunnel;
    }
    /**
     * Function to call to fail a job while in a tunnel.
     * @param reason
     */
    fail(reason) {
        let j = this;
        if (!j.tunnel) {
            j.e.log(3, `Job "${j.name}" failed before tunnel was set.`, j);
        }
        if (!j.nest) {
            j.e.log(3, `Job "${j.name}" does not have a nest.`, j);
        }
        j.tunnel.executeFail(j, j.nest, reason);
    }
    /**
     * Transfer a job to another tunnel directly.
     * @param tunnel
     */
    transfer(tunnel) {
        let job = this;
        let oldTunnel = this.tunnel;
        let oldTunnelName = "";
        if (oldTunnel) {
            oldTunnelName = oldTunnel.name;
        }
        job.tunnel = tunnel;
        tunnel.arrive(job, null);
        job.e.log(1, `Transferred to Tunnel "${tunnel.name}".`, job, [oldTunnel]);
        job.createLifeEvent("transfer", oldTunnelName, tunnel.name);
    }
    /**
     * Move function error.
     */
    move(destinationNest, callback) {
        throw "This type of job cannot be moved.";
    }
    /**
     * Sends an email.
     * @param emailOptions      Email options
     * #### Sending pug template email example
     * ```js
     * // my_tunnel.js
     * tunnel.run(function (job, nest) {
     *      job.email({
     *          subject: "Test email from pug template",
     *          to: "john.smith@example.com",
     *          template: __dirname + "./template_files/my_email.pug"
     *      });
     * });
     * ```
     *
     * ```js
     * // template_files/my_email.pug
     * h1="Example email!"
     * p="Got job ID " + job.getId()
     * ```
     * #### Sending plain-text email
     * ```js
     * tunnel.run(function (job, nest) {
     *      job.email({
     *          subject: "Test email with hard-coded plain-text",
     *          to: "john.smith@example.com",
     *          text: "My email body!"
     *      });
     * });
     * ```
     * #### Sending html email
     * ```js
     * tunnel.run(function (job, nest) {
     *      job.email({
     *          subject: "Test email with hard-coded html",
     *          to: "john.smith@example.com",
     *          html: "<h1>My email body!</h1>"
     *      });
     * });
     * ```
     */
    email(emailOptions) {
        let job = this;
        let emailer = job.e.emailer;
        emailer.sendMail(emailOptions, job);
    }
    /**
     * Attach job specific data to the job instance.
     * #### Example
     *
     * ```js
     * job.setPropertyValue("My Job Number", 123456);
     *
     * console.log(job.getPropertyValue("My Job Number"));
     * // 123456
     * ```
     *
     * @param key
     * @param value
     */
    setPropertyValue(key, value) {
        let job = this;
        let prop = new jobProperty_1.JobProperty(key, value);
        job._properties[key] = prop;
        job.e.log(1, `Property "${key}" added to job properties.`, job);
    }
    set propertyValues(properties) {
        let job = this;
        job._properties = properties;
        job.e.log(0, `Restored ${Object.keys(job._properties).length} properties.`, job);
    }
    /**
     * Get the entire job property object.
     * @param key
     * @returns {JobProperty}
     */
    getProperty(key) {
        return this._properties[key];
    }
    get properties() {
        return this._properties;
    }
    /**
     * Get the value of a property if it has been previously set.
     * @param key
     * @returns {any}
     */
    getPropertyValue(key) {
        let job = this;
        if (job._properties[key]) {
            return job._properties[key].value;
        }
        else {
            return null;
        }
    }
    /**
     * Get the type of a property.
     * #### Example
     *
     * ```js
     * job.setPropertyValue("My Job Number", 123456);
     *
     * console.log(job.getPropertyType("My Job Number"));
     * // "number"
     * ```
     *
     * @param key
     * @returns {string}
     */
    getPropertyType(key) {
        let job = this;
        if (job._properties[key]) {
            return job._properties[key].type;
        }
        else {
            return null;
        }
    }
    /**
     * Packs the job instance and file together in a zip.
     * Returns a PackJob in the parameter of the callback.
     * @param callback
     * #### Example
     * ```js
     * job.pack(function(packJob){
     *      packJob.move(packed_folder_nest);
     * });
     * ```
     */
    pack(callback) {
        let job = this;
        let PackedJob = require("./packedJob").PackedJob;
        let pj = new PackedJob(job.e, job);
        pj.execPack(() => {
            callback(pj);
        });
    }
    /**
     * Unpacks a packed job. Returns a the original unpacked job in the parameter of the callback.
     * @param callback
     * #### Example
     * ```js
     * packedJob.unpack(function(unpackedJob){
     *     console.log("Unpacked", unpackedJob.name);
     *     unpackedJob.move(unpacked_folder);
     *     packedJob.remove();
     * });
     * ```
     */
    unpack(callback) {
        let job = this;
        let PackedJob = require("./packedJob").PackedJob;
        let pj = new PackedJob(job.e, job);
        pj.execUnpack((unpackedJob) => {
            callback(unpackedJob);
        });
    }
    /**
     * Get the job object as JSON with circular references removed.
     * @returns {string}
     */
    getJSON() {
        let job = this;
        let json;
        let replacer = function (key, value) {
            // Filtering out properties
            if (key === "nest" || key === "e" || key === "tunnel") {
                return undefined;
            }
            if (key === "_nest" || key === "_tunnel") {
                return undefined;
            }
            return value;
        };
        try {
            json = JSON.stringify(job, replacer);
        }
        catch (err) {
            job.e.log(3, `getJSON stringify error: ${err}`, job);
        }
        return json;
    }
    get path() {
        return undefined;
    }
    isFile() {
        return undefined;
    }
    isFolder() {
        return undefined;
    }
    get files() {
        return undefined;
    }
    getFile(index) {
        return undefined;
    }
    set path(path) {
    }
    rename(name) {
        return undefined;
    }
    /**
     * Add a message to the log with this job as the actor.
     * @param level             0 = debug, 1 = info, 2, = warning, 3 = error
     * @param message           Log message
     * @returns {undefined}
     */
    log(level, message) {
        let job = this;
        return job.e.log(level, message, job);
    }
    get size() {
        return undefined;
    }
    get sizeBytes() {
        return undefined;
    }
}
exports.Job = Job;
//# sourceMappingURL=job.js.map