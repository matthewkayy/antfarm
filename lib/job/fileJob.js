"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileJob = void 0;
const job_1 = require("./job");
const file_1 = require("./file");
class FileJob extends job_1.Job {
    /**
     * FileJob constructor.
     * @param e
     * @param path
     */
    constructor(e, path) {
        super(e, path);
        this._type = "file";
        this._file = new file_1.File(e, path);
    }
    /**
     * Get the file object.
     * @returns {File}
     */
    get file() {
        return this._file;
    }
    /**
     * Get the file _name.
     * @returns {string}
     */
    get name() {
        return this.file.name;
    }
    /**
     * Get the file _name proper.
     * @returns {string}
     */
    get nameProper() {
        return this.file.nameProper;
    }
    /**
     * Get the file directory _name.
     * @returns {string}
     */
    get dirname() {
        return this.file.dirname;
    }
    /**
     * Get the file _path.
     * @returns {string}
     */
    get path() {
        return this.file.path;
    }
    /**
     * Set a new file _path.
     * @param path
     */
    set path(path) {
        let fj = this;
        fj.e.log(0, `New path set: "${path}".`, fj);
        fj.file.path = path;
    }
    /**
     * Set a new file _name.
     * @param filename
     */
    set name(filename) {
        this.createLifeEvent("set name", this.name, filename);
        this.file.name = filename;
    }
    /**
     * Get the file content type.
     * @returns {string}
     */
    get contentType() {
        return this.file.contentType;
    }
    /**
     * Get the file extension.
     * @returns {string}
     */
    get extension() {
        return this.file.extension;
    }
    /**
     * Get the file _basename.
     * @returns {string}
     */
    get basename() {
        return this.file.basename;
    }
    /**
     * Check if job is a folder.
     * @returns {boolean}
     */
    isFolder() {
        return false;
    }
    /**
     * Check if job is a file.
     * @returns {boolean}
     */
    isFile() {
        return true;
    }
    /**
     * Moves a file to a nest. This is an asynchronous method which provides a callback on completion.
     *
     * @param destinationNest       The nest object the job will be sent to.
     *
     * @param callback              The callback provides the updated instance of the job. Depending on the nest it was sent to, it may have been cast to a new job type. This is helpful in case you need the remote path to the job once it has been uploaded to S3, for example.
     *
     * #### Example
     * ```js
     * tunnel.run((job, nest) => {
     *      console.log("Found job " + job.name);
     *      job.move(my_s3_bucket, (s3_job) => {
     *          // Uploaded
     *          console.log("Uploaded to " + s3_job.path); // https://mybucket.s3.amazonaws.com/myfile.pdf
     *      });
     * });
     * ```
     */
    move(destinationNest, callback) {
        let fj = this;
        let theNewJob = null;
        try {
            destinationNest.take(fj, (newJob) => {
                fj.e.log(1, `Job "${fj.basename}" was moved to Nest "${destinationNest.name}".`, fj, [fj.tunnel]);
                theNewJob = newJob;
            });
        }
        catch (e) {
            fj.e.log(3, `Job "${fj.basename}" was not moved to Nest "${destinationNest.name}". ${e}`, fj);
        }
        if (callback) {
            callback(theNewJob);
        }
    }
    /**
     * Rename the job file to a new _name.
     * @param newName
     */
    rename(newName) {
        let fj = this;
        let file = this.file;
        file.name = newName;
        file.renameLocal();
    }
    /**
     * Deletes the local file.
     */
    remove() {
        return this.file.removeLocal();
    }
    get size() {
        return this.file.size;
    }
    get sizeBytes() {
        return this.file.sizeBytes;
    }
}
exports.FileJob = FileJob;
//# sourceMappingURL=fileJob.js.map