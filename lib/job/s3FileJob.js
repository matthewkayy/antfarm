"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3FileJob = void 0;
const fileJob_1 = require("./fileJob");
const tmp = require("tmp");
class S3FileJob extends fileJob_1.FileJob {
    constructor(e, basename) {
        // Create temp file
        let tmpobj = tmp.fileSync();
        super(e, tmpobj.name);
        this.rename(basename);
        this.locallyAvailable = false;
    }
    /**
     * Set remote bucket location.
     * @param bucket
     */
    set bucket(bucket) {
        this._bucket = bucket;
    }
    /**
     * Get remote bucket location.
     * @returns {string}
     */
    get bucket() {
        return this._bucket;
    }
    /**
     * Set remote key.
     * @param key
     */
    set key(key) {
        this._key = key;
    }
    /**
     * Get remote key
     * @returns {string}
     */
    get key() {
        return this._key;
    }
    /**
     * Set remote ETag
     * @param eTag
     */
    set eTag(eTag) {
        this._eTag = eTag;
    }
    /**
     * Get remote ETag
     * @returns {string}
     */
    get eTag() {
        return this._eTag;
    }
}
exports.S3FileJob = S3FileJob;
//# sourceMappingURL=s3FileJob.js.map