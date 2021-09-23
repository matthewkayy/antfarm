"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const mime = require("mime-types"), fileExtension = require("file-extension"), node_path = require("path"), fs = require("fs"), filesize = require("filesize");
class File {
    /**
     * File constructor
     * @param e
     * @param path
     */
    constructor(e, path) {
        this.e = e;
        this._path = path;
        // verify _path leads to a valid, readable file, handle error if not
        this.getStatistics();
    }
    /**
     * Refresh the file statistics after a rename or modification.
     */
    getStatistics() {
        let f = this;
        f._contentType = mime.lookup(f.path);
        f._extension = fileExtension(f.path);
        f._basename = node_path.basename(f.path);
        f._dirname = node_path.dirname(f.path);
        try {
            f._sizeBytes = fs.statSync(f.path).size;
        }
        catch (err) {
            f.e.log(2, `Couldn't determine sizeBytes with statSync. ${err}`, f);
            f._sizeBytes = 0;
        }
    }
    /**
     * Get the _basename.
     * @returns {string}
     */
    get name() {
        return this._basename;
    }
    /**
     * Set a new file _name.
     * @param filename
     */
    set name(filename) {
        this._basename = filename;
    }
    /**
     * Get the file _name of the job without the file extension.
     * @returns {string}
     */
    get nameProper() {
        return node_path.basename(this.basename, node_path.extname(this.basename));
    }
    /**
     * Get the top level directory _name.
     * @returns {string}
     */
    get dirname() {
        return this._dirname;
    }
    /**
     * Get the complete directory _path.
     * @returns {string}
     */
    get path() {
        return this._path;
    }
    /**
     * Set the complete directory _path.
     * @param path
     */
    set path(path) {
        this._path = path;
        this.getStatistics();
    }
    /**
     * Get the content-type of the file.
     * @returns {string}
     */
    get contentType() {
        return this._contentType;
    }
    /**
     * Get the file extension.
     * @returns {string}
     */
    get extension() {
        return this._extension;
    }
    /**
     * Get the _basename.
     * @returns {string}
     */
    get basename() {
        return this._basename;
    }
    get sizeBytes() {
        return this._sizeBytes;
    }
    get size() {
        return filesize(this.sizeBytes);
    }
    /**
     * Renames the local job file to the current _name.
     */
    renameLocal() {
        let f = this;
        let new_path = f.dirname + node_path.sep + f.name;
        fs.renameSync(f.path, new_path);
        f.path = new_path;
        f.getStatistics();
    }
    /**
     * Deletes the local file.
     * @returns {boolean}
     */
    removeLocal() {
        let f = this;
        try {
            fs.unlinkSync(f.path);
            return true;
        }
        catch (e) {
            f.e.log(3, `File "${f.path}" could not be deleted. ${e}`, f);
            return false;
        }
    }
}
exports.File = File;
//# sourceMappingURL=file.js.map