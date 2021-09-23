"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderJob = void 0;
const job_1 = require("./job");
const file_1 = require("./file");
const node_path = require("path"), fs = require("fs");
class FolderJob extends job_1.Job {
    /**
     * FolderJob constructor
     * @param e
     * @param path
     */
    constructor(e, path) {
        super(e, path);
        this._type = "folder";
        this._path = path;
        this._files = [];
        this.getStatistics();
        // verify _path leads to a valid, readable file, handle error if not
    }
    getStatistics() {
        this._basename = node_path.basename(this.path);
        this._dirname = node_path.dirname(this.path);
    }
    /**
     * Creates file objects for folder contents. Async operation returns a callback on completion.
     * @param callback
     */
    createFiles(callback) {
        let fl = this;
        let folder_path = fl.path;
        fs.readdir(folder_path, (err, items) => {
            items = items.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
            items.forEach((filename) => {
                let filepath = folder_path + node_path.sep + filename;
                let file = new file_1.File(fl.e, filepath);
                fl.addFile(file);
            });
            callback();
        });
    }
    /**
     * Gets the job _name.
     * @returns {string}
     */
    get name() {
        return this.basename;
    }
    /**
     * Get the _basename.
     * @returns {string}
     */
    get basename() {
        return this._basename;
    }
    /**
     * Get the directory _name.
     * @returns {string}
     */
    get dirname() {
        return this._dirname;
    }
    /**
     * Get the _path.
     * @returns {string}
     */
    get path() {
        return this._path;
    }
    /**
     * Set a new _path.
     * @param path
     */
    set path(path) {
        let fj = this;
        fj._path = path;
        fj.getStatistics();
    }
    /**
     * Add a file object to the job.
     * @param file
     */
    addFile(file) {
        this._files.push(file);
        this.e.log(0, `Adding file "${file.name}" to job.`, this);
    }
    /**
     * Get a file object from the job.
     * @param index
     * @returns {File}
     */
    getFile(index) {
        return this._files[index];
    }
    /**
     * Get all _files associated with the job.
     * @returns {File[]}
     */
    get files() {
        return this._files;
    }
    /**
     * Get the number of _files in this folder.
     * @returns {number}
     */
    count() {
        return this._files.length;
    }
    /**
     * Get the extension.
     * @returns {null}
     */
    get extension() {
        return null;
    }
    /**
     * Check if job is a folder.
     * @returns {boolean}
     */
    isFolder() {
        return true;
    }
    /**
     * Check if job is a file.
     * @returns {boolean}
     */
    isFile() {
        return false;
    }
    /**
     * Moves a folder to a nest. This is an asynchronous method which provides a callback on completion.
     * @param destinationNest
     * @param callback
     */
    move(destinationNest, callback) {
        let fj = this;
        if (!destinationNest) {
            fs.e.log(3, `Destination nest does not exist!`, fj);
        }
        try {
            destinationNest.take(fj, (job) => {
                // fj.path = new_path;
                fj.e.log(1, `Job "${fj.name}" was moved to Nest "${destinationNest.name}".`, fj);
                if (callback) {
                    callback(job);
                }
            });
        }
        catch (e) {
            fj.e.log(3, `Job "${fj.name}" was not moved to Nest "${destinationNest.name}". ${e}`, fj);
            if (callback) {
                callback();
            }
        }
    }
    /**
     * Renames the job folder, leaving its content's names alone.
     * @param newName
     */
    rename(newName) {
        let fj = this;
        let new_path = fj.dirname + node_path.sep + newName;
        try {
            fj.e.log(0, `Renaming folder to "${new_path}".`, fj);
            fs.renameSync(fj.path, new_path);
        }
        catch (err) {
            fj.e.log(3, `Rename folder error: ${err}.`, fj);
        }
        fj.path = new_path;
    }
    remove() {
        let fj = this;
        fj.files.forEach((file) => {
            file.removeLocal();
        });
    }
    ;
}
exports.FolderJob = FolderJob;
//# sourceMappingURL=folderJob.js.map