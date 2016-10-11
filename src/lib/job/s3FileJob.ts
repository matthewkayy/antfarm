import {FileJob} from "./fileJob";
import {File} from "./file";
import {Environment} from "./../environment/environment";

const   tmp = require("tmp");

export class S3FileJob extends FileJob {

    protected file: File;
    private _bucket: string;
    private _key: string;
    private _eTag: string;

    constructor(e: Environment, basename) {
        // Create temp file
        let tmpobj = tmp.fileSync();
        super(e, tmpobj.name);
        this.rename(basename);
        this.setLocallyAvailable(false);
    }

    /**
     * Set remote bucket location.
     * @param bucket
     */
    public set bucket(bucket: string) {
        this._bucket = bucket;
    }

    /**
     * Get remote bucket location.
     * @returns {string}
     */
    public get bucket() {
        return this._bucket;
    }

    /**
     * Set remote key.
     * @param key
     */
    set key(key: string) {
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
    set eTag(eTag: string) {
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