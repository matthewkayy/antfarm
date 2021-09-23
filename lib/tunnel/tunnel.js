"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tunnel = void 0;
const async = require("async"), mm = require("micromatch"), shortid = require("shortid");
/**
 * Tunnels are runnable work flow units that can watch nests.
 */
class Tunnel {
    constructor(e, tunnelName) {
        this.match_obj = {
            queue: [],
            run: null,
            pattern: null,
            orphan_minutes: null
        };
        this.e = e;
        this._id = shortid.generate();
        this._nests = [];
        this._name = tunnelName;
        this._run_list = [];
        this._run_sync_list = [];
        this.job_counter = 0;
    }
    toString() {
        return "Tunnel";
    }
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
    get nests() {
        return this._nests;
    }
    get runList() {
        return this._run_list;
    }
    get runSyncList() {
        return this._run_sync_list;
    }
    get runFail() {
        return this._run_fail;
    }
    set runFail(callback) {
        this._run_fail = callback;
    }
    get id() {
        return this._id;
    }
    /**
     * Instructs the tunnel to watch a nest for new jobs.
     * @param nest
     */
    watch(nest) {
        let t = this;
        t.e.log(0, `Watching nest.`, t, [nest]);
        nest.register(t);
        nest.load();
        nest.watch();
        t.nests.push(nest);
    }
    arrive(job, nest) {
        this.job_counter++;
        this.e.log(1, `Job ${this.job_counter} triggered tunnel arrive.`, this, [job, nest]);
        this.executeRun(job, nest);
        this.executeRunSync(job, nest);
        this.executeMatch(job, nest);
    }
    /**
     * Run program logic asynchronously.
     * @param callback
     */
    run(callback) {
        this.runList.push(callback);
    }
    /**
     * Run program logic synchronously.
     * @param callback
     */
    runSync(callback) {
        this.runSyncList.push(callback);
    }
    /**
     * Failed jobs runner.
     * @param callback
     */
    fail(callback) {
        this.runFail = callback;
    }
    /**
     * Asynchronous run event.
     * @param job
     * @param nest
     */
    executeRun(job, nest) {
        let tn = this;
        if (tn.runList.length > 0) {
            tn.runList.forEach((callback) => {
                try {
                    callback(job, nest);
                }
                catch (e) {
                    // Fail if an error is thrown
                    tn.executeFail(job, nest, e);
                }
            });
        }
    }
    /**
     * Synchronous run event.
     * @param job
     * @param nest
     */
    executeRunSync(job, nest) {
        let tn = this;
        let breakFailure = false;
        let successfulRuns = 0;
        if (tn.runSyncList.length > 0) {
            async.eachSeries(tn.runSyncList, (run, doNextRun) => {
                if (breakFailure === false) {
                    run(job, nest, () => {
                        successfulRuns++;
                        doNextRun();
                    });
                }
            }, (err) => {
                if (err) {
                    breakFailure = true;
                    tn.executeFail(job, nest, err);
                }
                tn.e.log(0, `Completed ${successfulRuns}/${tn.runSyncList.length} synchronous run list(s).`, tn, [job, nest]);
            });
        }
    }
    /**
     * Fail run event.
     * @param job
     * @param nest
     * @param reason
     */
    executeFail(job, nest, reason) {
        let tn = this;
        tn.e.log(3, `Failed for reason "${reason}".`, tn, [job, nest]);
        let failCallback = tn.runFail;
        if (failCallback) {
            failCallback(job, nest, reason);
        }
        else {
            tn.e.log(2, `No fail runner available for this tunnel.`, tn, [job]);
            throw reason;
        }
    }
    /**
     * Interface for matching two or more _files together based on an array of glob filename patterns.
     * @param pattern
     * @param orphanMinutes
     * @param callback
     */
    match(pattern, orphanMinutes, callback) {
        this.match_obj.pattern = pattern;
        this.match_obj.orphan_minutes = orphanMinutes;
        this.match_obj.run = callback;
    }
    /**
     * Match execution
     * @param job
     * @param nest
     */
    executeMatch(job, nest) {
        if (this.match_obj.run) {
            // Try to find match in queue
            let tn = this;
            let qjob_pattern_match_result, job_pattern_match_result;
            let matched_jobs = [];
            let job_base, qjob_base;
            tn.e.log(0, "Executing matching process.", tn);
            tn.match_obj.pattern.forEach(function (pattern, i) {
                job_pattern_match_result = mm.isMatch(job.name, pattern);
                if (job_pattern_match_result === true) {
                    job_base = job.name.substr(0, job.name.indexOf(pattern.replace("*", "")));
                }
            });
            tn.match_obj.queue.slice().reverse().forEach(function (qJob, qIndex, qObject) {
                tn.match_obj.pattern.forEach(function (pattern) {
                    qjob_pattern_match_result = mm.isMatch(qJob.name, pattern);
                    if (qjob_pattern_match_result === true) {
                        qjob_base = qJob.name.substr(0, qJob.name.indexOf(pattern.replace("*", "")));
                        if (job_base === qjob_base) {
                            // Pull out qjob from queue
                            tn.match_obj.queue.splice(qObject.length - 1 - qIndex, 1);
                            matched_jobs.push(qJob);
                            return;
                        }
                    }
                });
            });
            // if found
            if (matched_jobs.length > 0) {
                matched_jobs.push(job);
                tn.e.log(0, `Matched ${matched_jobs.length} jobs.`, tn);
                tn.match_obj.run(matched_jobs);
            }
            else {
                // If not found, add this job to the queue
                tn.match_obj.queue.push(job);
            }
            // Need to set a timeout for the job to fail
            setTimeout(function () {
                if (tn.match_obj.queue.length !== 0) {
                    // Fail all jobs in the queue
                    tn.match_obj.queue.forEach(function (fJob) {
                        fJob.fail("Orphan timeout.");
                    });
                    // Wipe the queue
                    tn.e.log(0, `Orphan timeout executed on ${tn.match_obj.queue.length} jobs.`, tn);
                    tn.match_obj.queue = [];
                }
            }, tn.match_obj.orphan_minutes * 60000);
        }
    }
}
exports.Tunnel = Tunnel;
//# sourceMappingURL=tunnel.js.map